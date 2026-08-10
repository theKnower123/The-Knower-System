<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Models\User;
use App\Modules\CRM\Models\Client;
use App\Modules\HR\Models\Employee;
use Illuminate\Http\Request;
use App\Modules\Auth\Models\UserActivityLog;
use App\Services\UserActivityLogger;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserManagementController extends Controller
{
    /**
     * Ensure the requesting user is a Super Admin.
     */
    protected function authorizeSuperAdmin(Request $request): void
    {
        $user = $request->user();
        if (!$user || $user->role !== 'super_admin') {
            abort(403, 'Unauthorized. User management is reserved exclusively for Super Admin.');
        }
    }

    /**
     * List all users with search, role filters, status filters, and pagination.
     */
    public function index(Request $request)
    {
        $this->authorizeSuperAdmin($request);

        $search = $request->input('search');
        $role = $request->input('role');
        $status = $request->input('status', 'all'); // 'all', 'active', 'trashed'
        $perPage = (int) $request->input('per_page', 20);

        $query = User::withTrashed()->with(['client', 'employee']);

        // Filter by Status
        if ($status === 'active') {
            $query->whereNull('deleted_at');
        } elseif ($status === 'trashed' || $status === 'frozen') {
            $query->onlyTrashed();
        }

        // Filter by Role
        if (!empty($role) && $role !== 'all') {
            $query->where('role', $role);
        }

        // Instant Search across fields
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('role', 'like', "%{$search}%")
                  ->orWhereHas('client', function ($cq) use ($search) {
                      $cq->where('name', 'like', "%{$search}%")
                         ->orWhere('position', 'like', "%{$search}%");
                  })
                  ->orWhereHas('employee', function ($eq) use ($search) {
                      $eq->where('department', 'like', "%{$search}%")
                         ->orWhere('position', 'like', "%{$search}%")
                         ->orWhere('id_number', 'like', "%{$search}%");
                  });
            });
        }

        $users = $query->orderBy('id', 'desc')->paginate($perPage);

        // Append extra calculated flags
        $users->getCollection()->transform(function (User $user) {
            $user->is_frozen = $user->trashed();
            $user->user_type_label = $this->getUserTypeLabel($user->role);
            return $user;
        });

        // Summary counts
        $counts = [
            'total'       => User::withTrashed()->count(),
            'active'      => User::count(),
            'frozen'      => User::onlyTrashed()->count(),
            'super_admins' => User::where('role', 'super_admin')->count(),
            'admins'      => User::whereIn('role', ['administrator', 'admin'])->count(),
            'employees'   => User::whereIn('role', ['employee', 'developer', 'designer', 'qa', 'hr', 'sales', 'support', 'project_manager', 'accountant', 'team_leader'])->count(),
            'clients'     => User::where('role', 'client')->count(),
        ];

        return response()->json([
            'success' => true,
            'data'    => $users,
            'counts'  => $counts,
        ]);
    }

    /**
     * Get single detailed user info based on type.
     */
    public function show(Request $request, int|string $id)
    {
        $this->authorizeSuperAdmin($request);

        $user = User::withTrashed()
            ->with([
                'client.projects',
                'client.invoices',
                'client.contracts',
                'client.tickets',
                'employee',
                'assignedTasks',
                'assignedTickets',
                'createdProjects',
            ])
            ->findOrFail($id);

        $user->is_frozen = $user->trashed();
        $user->user_type_label = $this->getUserTypeLabel($user->role);

        // Permissions calculation
        $rolePermissions = $user->getAllPermissions();
        $directPermissions = $user->permissions ?? [];
        $isSuperAdmin = $user->role === 'super_admin';
        $effectivePermissions = $isSuperAdmin ? ['* (All System Access Granted)'] : array_values(array_unique(array_merge($rolePermissions, $directPermissions)));

        $permissionsBreakdown = [
            'is_super_admin'       => $isSuperAdmin,
            'role_code'            => $user->role,
            'role_name'            => $user->user_type_label,
            'role_permissions'     => $rolePermissions,
            'direct_permissions'   => $directPermissions,
            'effective_permissions' => $effectivePermissions,
        ];

        // Security Breakdown
        $security = [
            'is_frozen'          => $user->is_frozen,
            'account_status'     => $user->is_frozen ? 'Frozen / Blocked' : ($user->email_verified_at ? 'Active & Verified' : 'Active (Unverified)'),
            'email_verified'     => !empty($user->email_verified_at),
            'email_verified_at'  => $user->email_verified_at ? $user->email_verified_at->toIso8601String() : null,
            'has_password'       => !empty($user->password),
            'has_google'         => !empty($user->google_id),
            'google_id'          => $user->google_id ?? null,
            'auth_method'        => !empty($user->google_id) ? 'Google OAuth' : 'Standard Credentials',
            'two_factor_status'  => 'Disabled',
            'last_login_at'      => $user->last_login_at ? $user->last_login_at->toIso8601String() : null,
            'active_sessions'    => $user->tokens()->count(),
            'created_at'         => $user->created_at ? $user->created_at->toIso8601String() : null,
            'updated_at'         => $user->updated_at ? $user->updated_at->toIso8601String() : null,
            'deleted_at'         => $user->deleted_at ? $user->deleted_at->toIso8601String() : null,
        ];

        // Activity timeline simulation
        $activityLog = [
            [
                'action'       => 'Account Created',
                'description'  => "User account '{$user->name}' created in system.",
                'timestamp'    => $user->created_at ? $user->created_at->toIso8601String() : now()->toIso8601String(),
                'performed_by' => 'System / Administrator',
            ]
        ];

        if ($user->last_login_at) {
            $activityLog[] = [
                'action'       => 'Successful Login',
                'description'  => "User logged in successfully via {$security['auth_method']}.",
                'timestamp'    => $user->last_login_at->toIso8601String(),
                'performed_by' => $user->name,
            ];
        }

        if ($user->is_frozen) {
            $activityLog[] = [
                'action'       => 'Account Frozen / Trashed',
                'description'  => "Account was frozen by Super Admin and moved to Trash. Login access revoked.",
                'timestamp'    => $user->deleted_at ? $user->deleted_at->toIso8601String() : now()->toIso8601String(),
                'performed_by' => 'Super Admin Administrator',
            ];
        }

        // Build type-specific metadata summary
        $extra = [];

        if ($user->role === 'client' && $user->client) {
            $extra['client_details'] = [
                'client_id'         => $user->client->id,
                'company_name'      => $user->client->name,
                'position'          => $user->client->position,
                'phone'             => $user->client->phone,
                'status'            => $user->client->status,
                'total_projects'    => $user->client->projects->count(),
                'active_projects'   => $user->client->projects->whereIn('status', ['active', 'in_progress'])->count(),
                'total_invoices'    => $user->client->invoices->count(),
                'unpaid_invoices'   => $user->client->invoices->whereIn('status', ['sent', 'overdue'])->count(),
                'total_contracts'   => $user->client->contracts->count(),
                'total_tickets'     => $user->client->tickets->count(),
                'projects'          => $user->client->projects->take(5),
                'invoices'          => $user->client->invoices->take(5),
            ];
        } elseif ($user->employee) {
            $extra['employee_details'] = [
                'employee_id'      => $user->employee->id,
                'department'       => $user->employee->department,
                'position'         => $user->employee->position,
                'salary'           => $user->employee->salary,
                'hire_date'        => $user->employee->hire_date ? $user->employee->hire_date->format('Y-m-d') : null,
                'id_number'        => $user->employee->id_number,
                'status'           => $user->employee->status,
                'assigned_tasks'   => $user->assignedTasks->count(),
                'assigned_tickets' => $user->assignedTickets->count(),
            ];
        } elseif ($isSuperAdmin) {
            $extra['super_admin_details'] = [
                'access_level'       => 'Full Root Super Admin',
                'system_privileges'  => 'Unrestricted Read/Write/Delete/Execute Across All System Modules',
                'security_clearance' => 'Level 10 (Highest)',
                'can_manage_users'   => true,
                'can_manage_system'  => true,
            ];
        } elseif (in_array($user->role, ['administrator', 'admin', 'ceo'])) {
            $extra['admin_details'] = [
                'access_level'       => 'Administrative Officer',
                'accessible_modules' => ['CRM', 'Projects', 'Finance', 'HR', 'Support', 'Reports', 'Marketing'],
                'can_manage_users'   => false,
            ];
        }

        return response()->json([
            'success'               => true,
            'data'                  => $user,
            'permissions_breakdown' => $permissionsBreakdown,
            'security'              => $security,
            'activity_log'          => $activityLog,
            'extra'                 => $extra,
        ]);
    }

    /**
     * Get search-filtered & paginated activity logs for a specific user.
     */
    public function activityLogs(Request $request, int|string $id)
    {
        $this->authorizeSuperAdmin($request);

        $perPage = (int) $request->input('per_page', 10);
        $search = $request->input('search');
        $category = $request->input('category');
        $actionType = $request->input('action_type');
        $module = $request->input('module');
        $fromDate = $request->input('from_date');
        $toDate = $request->input('to_date');

        $user = User::withTrashed()->findOrFail($id);

        // Auto-seed initial historical milestones if log is fresh
        if (UserActivityLog::where('user_id', $user->id)->count() === 0) {
            UserActivityLogger::log(
                $user->id,
                'Account Created',
                'auth',
                "User Account #{$user->id}",
                "User account '{$user->name}' was initialized in system with role '{$user->role}'.",
                'Auth',
                'create',
                ['role' => $user->role, 'email' => $user->email],
                $user->id,
                $user->name,
                $user->role
            );

            if ($user->last_login_at) {
                UserActivityLogger::log(
                    $user->id,
                    'Successful Login',
                    'auth',
                    "User Account #{$user->id}",
                    "User authenticated into the platform successfully.",
                    'Auth',
                    'login',
                    null,
                    $user->id,
                    $user->name,
                    $user->role
                );
            }

            if ($user->trashed()) {
                UserActivityLogger::log(
                    $user->id,
                    'Account Frozen & Moved to Trash',
                    'security',
                    "User Account #{$user->id}",
                    "Account was frozen by Super Admin and moved to Trash. Login access revoked.",
                    'Users',
                    'freeze',
                    ['status' => 'trashed'],
                    $request->user()->id,
                    $request->user()->name,
                    $request->user()->role
                );
            }
        }

        $query = UserActivityLog::where('user_id', $user->id);

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('target_entity', 'like', "%{$search}%")
                  ->orWhere('causer_name', 'like', "%{$search}%")
                  ->orWhere('module', 'like', "%{$search}%");
            });
        }

        if (!empty($category) && $category !== 'all') {
            $query->where('category', $category);
        }

        if (!empty($actionType) && $actionType !== 'all') {
            $query->where('action_type', $actionType);
        }

        if (!empty($module) && $module !== 'all') {
            $query->where('module', $module);
        }

        if (!empty($fromDate)) {
            $query->where('created_at', '>=', $fromDate);
        }

        if (!empty($toDate)) {
            $query->where('created_at', '<=', $toDate);
        }

        $paginated = $query->orderBy('id', 'desc')->paginate($perPage);

        return response()->json([
            'success'      => true,
            'data'         => $paginated->items(),
            'current_page' => $paginated->currentPage(),
            'last_page'    => $paginated->lastPage(),
            'total'        => $paginated->total(),
            'per_page'     => $paginated->perPage(),
        ]);
    }

    /**
     * System-Wide Global Activity Audit Log Endpoint.
     */
    public function globalActivityLogs(Request $request)
    {
        $this->authorizeSuperAdmin($request);

        $perPage = (int) $request->input('per_page', 15);
        $search = $request->input('search');
        $userId = $request->input('user_id');
        $category = $request->input('category');
        $actionType = $request->input('action_type');
        $module = $request->input('module');
        $fromDate = $request->input('from_date');
        $toDate = $request->input('to_date');

        $query = UserActivityLog::with(['user']);

        if (!empty($userId) && $userId !== 'all') {
            $query->where(function($q) use ($userId) {
                $q->where('user_id', $userId)->orWhere('causer_id', $userId);
            });
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('target_entity', 'like', "%{$search}%")
                  ->orWhere('causer_name', 'like', "%{$search}%")
                  ->orWhere('module', 'like', "%{$search}%");
            });
        }

        if (!empty($category) && $category !== 'all') {
            $query->where('category', $category);
        }

        if (!empty($actionType) && $actionType !== 'all') {
            $query->where('action_type', $actionType);
        }

        if (!empty($module) && $module !== 'all') {
            $query->where('module', $module);
        }

        if (!empty($fromDate)) {
            $query->where('created_at', '>=', $fromDate);
        }

        if (!empty($toDate)) {
            $query->where('created_at', '<=', $toDate);
        }

        $paginated = $query->orderBy('id', 'desc')->paginate($perPage);

        return response()->json([
            'success'      => true,
            'data'         => $paginated->items(),
            'current_page' => $paginated->currentPage(),
            'last_page'    => $paginated->lastPage(),
            'total'        => $paginated->total(),
            'per_page'     => $paginated->perPage(),
        ]);
    }

    /**
     * Create a new user (with linked Client/Employee profile if appropriate).
     */
    public function store(Request $request)
    {
        $this->authorizeSuperAdmin($request);

        $validator = Validator::make($request->all(), [
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|string|min:6',
            'role'       => 'required|string',
            'phone'      => 'nullable|string|max:50',
            'avatar'     => 'nullable|string',
            // Client specific
            'company_name' => 'nullable|string|max:255',
            // Employee specific
            'department' => 'nullable|string|max:100',
            'position'   => 'nullable|string|max:100',
            'salary'     => 'nullable|numeric',
            'hire_date'  => 'nullable|date',
            'id_number'  => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();
        try {
            /** @var User $user */
            $user = User::create([
                'name'        => $request->input('name'),
                'email'       => $request->input('email'),
                'password'    => Hash::make($request->input('password')),
                'role'        => $request->input('role'),
                'phone'       => $request->input('phone'),
                'avatar'      => $request->input('avatar'),
                'permissions' => $request->input('permissions'),
            ]);

            // Create linked Client if role is client
            if ($user->role === 'client') {
                Client::create([
                    'name'     => $request->input('company_name') ?: $user->name,
                    'email'    => $user->email,
                    'phone'    => $user->phone,
                    'position' => $request->input('position', 'Client Representative'),
                    'user_id'  => $user->id,
                    'status'   => 'active',
                ]);
            } else {
                // Create linked Employee record for staff roles
                Employee::create([
                    'user_id'    => $user->id,
                    'department' => $request->input('department', 'General'),
                    'position'   => $request->input('position', ucwords(str_replace('_', ' ', $user->role))),
                    'salary'     => $request->input('salary', 0),
                    'hire_date'  => $request->input('hire_date', now()),
                    'id_number'  => $request->input('id_number'),
                    'status'     => 'active',
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'User created successfully.',
                'data'    => $user->load(['client', 'employee']),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update existing user information.
     */
    public function update(Request $request, int|string $id)
    {
        $this->authorizeSuperAdmin($request);

        /** @var User $user */
        $user = User::withTrashed()->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name'     => 'sometimes|required|string|max:255',
            'email'    => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6',
            'role'     => 'sometimes|required|string',
            'phone'    => 'nullable|string|max:50',
            'avatar'   => 'nullable|string',
            // Type-specific
            'company_name' => 'nullable|string|max:255',
            'department'   => 'nullable|string|max:100',
            'position'     => 'nullable|string|max:100',
            'salary'       => 'nullable|numeric',
            'hire_date'    => 'nullable|date',
            'id_number'    => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();
        try {
            $user->name  = $request->input('name', $user->name);
            $user->email = $request->input('email', $user->email);
            $user->role  = $request->input('role', $user->role);
            $user->phone = $request->input('phone', $user->phone);

            if ($request->has('avatar')) {
                $user->avatar = $request->input('avatar');
            }

            if ($request->filled('password')) {
                $user->password = Hash::make($request->input('password'));
            }

            $user->save();

            // Sync Client profile
            if ($user->role === 'client') {
                $client = Client::withTrashed()->where('user_id', $user->id)->first();
                if ($client) {
                    $client->update([
                        'name'     => $request->input('company_name') ?: $user->name,
                        'email'    => $user->email,
                        'phone'    => $user->phone,
                        'position' => $request->input('position', $client->position),
                    ]);
                } else {
                    Client::create([
                        'name'     => $request->input('company_name') ?: $user->name,
                        'email'    => $user->email,
                        'phone'    => $user->phone,
                        'position' => $request->input('position', 'Client Representative'),
                        'user_id'  => $user->id,
                        'status'   => 'active',
                    ]);
                }
            } else {
                // Sync Employee profile
                $employee = Employee::withTrashed()->where('user_id', $user->id)->first();
                if ($employee) {
                    $employee->update([
                        'department' => $request->input('department', $employee->department),
                        'position'   => $request->input('position', $employee->position),
                        'salary'     => $request->input('salary', $employee->salary),
                        'hire_date'  => $request->input('hire_date', $employee->hire_date),
                        'id_number'  => $request->input('id_number', $employee->id_number),
                    ]);
                } else {
                    Employee::create([
                        'user_id'    => $user->id,
                        'department' => $request->input('department', 'General'),
                        'position'   => $request->input('position', ucwords(str_replace('_', ' ', $user->role))),
                        'salary'     => $request->input('salary', 0),
                        'hire_date'  => $request->input('hire_date', now()),
                        'id_number'  => $request->input('id_number'),
                        'status'     => 'active',
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully.',
                'data'    => $user->fresh(['client', 'employee']),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Soft delete user (Move to Trash / Freeze account).
     */
    public function destroy(Request $request, int|string $id)
    {
        $this->authorizeSuperAdmin($request);

        /** @var User $user */
        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot freeze/trash your own Super Admin account.',
            ], 400);
        }

        $user->delete();

        UserActivityLogger::log(
            $user->id,
            'Account Frozen & Moved to Trash',
            'security',
            "User Account #{$user->id}",
            "Account was frozen by Super Admin '{$request->user()->name}'. Login access revoked.",
            $request->user()->id,
            $request->user()->name
        );

        return response()->json([
            'success' => true,
            'message' => "User '{$user->name}' has been frozen and moved to Trash.",
        ]);
    }

    /**
     * Permanently delete user.
     */
    public function forceDelete(Request $request, int|string $id)
    {
        $this->authorizeSuperAdmin($request);

        /** @var User $user */
        $user = User::withTrashed()->findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot permanently delete your own Super Admin account.',
            ], 400);
        }

        $userName = $user->name;

        UserActivityLogger::log(
            $user->id,
            'Permanently Deleted User Account',
            'security',
            "User Account #{$user->id}",
            "User account '{$userName}' was permanently destroyed from database by Super Admin '{$request->user()->name}'.",
            $request->user()->id,
            $request->user()->name
        );

        $user->forceDelete();

        return response()->json([
            'success' => true,
            'message' => "User '{$userName}' permanently deleted.",
        ]);
    }

    /**
     * Restore user from Trash.
     */
    public function restore(Request $request, int|string $id)
    {
        $this->authorizeSuperAdmin($request);

        /** @var User $user */
        $user = User::onlyTrashed()->findOrFail($id);
        $user->restore();

        UserActivityLogger::log(
            $user->id,
            'Restored User Account',
            'security',
            "User Account #{$user->id}",
            "Account was restored from Trash by Super Admin '{$request->user()->name}'. Login access re-enabled.",
            $request->user()->id,
            $request->user()->name
        );

        return response()->json([
            'success' => true,
            'message' => "User '{$user->name}' restored successfully.",
        ]);
    }

    /**
     * Perform bulk operations (bulk_trash, bulk_restore, bulk_delete).
     */
    public function bulkAction(Request $request)
    {
        $this->authorizeSuperAdmin($request);

        $validator = Validator::make($request->all(), [
            'action' => 'required|in:trash,restore,delete',
            'ids'    => 'required|array',
            'ids.*'  => 'integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        $action = $request->input('action');
        $ids = array_diff($request->input('ids', []), [$request->user()->id]); // Exclude current user

        if (empty($ids)) {
            return response()->json([
                'success' => false,
                'message' => 'No valid users selected for bulk action.',
            ], 400);
        }

        DB::beginTransaction();
        try {
            $count = 0;
            $msg = 'Bulk action executed.';

            if ($action === 'trash') {
                /** @var \Illuminate\Database\Eloquent\Collection<int, User> $users */
                $users = User::whereIn('id', $ids)->get();
                foreach ($users as $u) {
                    $u->delete();
                    $count++;
                }
                $msg = "{$count} users moved to Trash & accounts frozen.";
            } elseif ($action === 'restore') {
                /** @var \Illuminate\Database\Eloquent\Collection<int, User> $users */
                $users = User::onlyTrashed()->whereIn('id', $ids)->get();
                foreach ($users as $u) {
                    $u->restore();
                    $count++;
                }
                $msg = "{$count} users restored successfully.";
            } elseif ($action === 'delete') {
                /** @var \Illuminate\Database\Eloquent\Collection<int, User> $users */
                $users = User::withTrashed()->whereIn('id', $ids)->get();
                foreach ($users as $u) {
                    $u->forceDelete();
                    $count++;
                }
                $msg = "{$count} users permanently deleted.";
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => $msg,
                'count'   => $count,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Bulk action failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Download User-Type-Specific Excel/CSV Template.
     */
    public function downloadExcelTemplate(Request $request)
    {
        $this->authorizeSuperAdmin($request);

        $userType = strtolower(trim($request->input('user_type', 'client')));

        $fileName = "user_import_template_{$userType}.csv";
        $headers = [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0',
        ];

        if ($userType === 'client') {
            $columns = ['Name', 'Email', 'Password', 'Phone', 'Company Name', 'Position'];
            $samples = [
                ['Acme Corp Lead', 'john@acmecorp.com', 'SecurePass123!', '+1555123456', 'Acme Corporation', 'CEO'],
                ['TechStart Representative', 'sarah@techstart.io', 'SecurePass123!', '+1555987654', 'TechStart Inc', 'CTO'],
                ['Global Logistics', 'mark@globallogistics.com', 'SecurePass123!', '+1555333444', 'Global Logistics Ltd', 'Operations Director'],
            ];
        } elseif (in_array($userType, ['employee', 'developer', 'staff', 'hr', 'designer', 'accountant', 'support'])) {
            $columns = ['Name', 'Email', 'Password', 'Phone', 'Role', 'Department', 'Position', 'Salary', 'Hire Date', 'National ID'];
            $samples = [
                ['Alice Developer', 'alice@company.com', 'Pass123!', '+1555000111', 'developer', 'Engineering', 'Senior Fullstack Dev', '7500', '2026-01-15', 'NAT-998877'],
                ['Bob Designer', 'bob@company.com', 'Pass123!', '+1555000222', 'designer', 'Product Design', 'Lead UX Designer', '6500', '2026-02-01', 'NAT-554433'],
                ['Charlie Support', 'charlie@company.com', 'Pass123!', '+1555000333', 'support', 'Customer Care', 'Support Agent', '4500', '2026-03-01', 'NAT-112233'],
            ];
        } else {
            // Admin & Super Admin templates
            $columns = ['Name', 'Email', 'Password', 'Phone', 'Role', 'Admin Title'];
            $samples = [
                ['Sarah Administrator', 'sarah.admin@company.com', 'AdminPass123!', '+1555111222', 'administrator', 'System Operations Lead'],
                ['David Super Admin', 'david.super@company.com', 'AdminPass123!', '+1555333222', 'super_admin', 'Executive Super Admin'],
            ];
        }

        $callback = function () use ($columns, $samples) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            foreach ($samples as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Parse & Validate Uploaded Excel File (No immediate DB creation).
     */
    public function parseExcel(Request $request)
    {
        $this->authorizeSuperAdmin($request);

        $validator = Validator::make($request->all(), [
            'file'      => 'nullable|file|mimes:csv,txt,xlsx,xls|max:20480',
            'rows'      => 'nullable|array',
            'user_type' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        $userType = strtolower(trim($request->input('user_type', 'client')));
        $rawRows = [];

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->getRealPath();
            $handle = fopen($path, 'r');
            $header = fgetcsv($handle);

            if ($header) {
                while (($data = fgetcsv($handle)) !== false) {
                    if (count($data) >= 2) {
                        if ($userType === 'client') {
                            $rawRows[] = [
                                'name'         => trim($data[0] ?? ''),
                                'email'        => trim($data[1] ?? ''),
                                'password'     => trim($data[2] ?? ''),
                                'phone'        => trim($data[3] ?? ''),
                                'role'         => 'client',
                                'company_name' => trim($data[4] ?? ''),
                                'position'     => trim($data[5] ?? ''),
                            ];
                        } elseif (in_array($userType, ['employee', 'developer', 'staff', 'hr', 'designer', 'accountant', 'support'])) {
                            $rawRows[] = [
                                'name'        => trim($data[0] ?? ''),
                                'email'       => trim($data[1] ?? ''),
                                'password'    => trim($data[2] ?? ''),
                                'phone'       => trim($data[3] ?? ''),
                                'role'        => trim($data[4] ?? '') ?: $userType,
                                'department'  => trim($data[5] ?? ''),
                                'position'    => trim($data[6] ?? ''),
                                'salary'      => trim($data[7] ?? ''),
                                'hire_date'   => trim($data[8] ?? ''),
                                'id_number'   => trim($data[9] ?? ''),
                            ];
                        } else {
                            $rawRows[] = [
                                'name'        => trim($data[0] ?? ''),
                                'email'       => trim($data[1] ?? ''),
                                'password'    => trim($data[2] ?? ''),
                                'phone'       => trim($data[3] ?? ''),
                                'role'        => trim($data[4] ?? '') ?: 'administrator',
                                'position'    => trim($data[5] ?? ''),
                            ];
                        }
                    }
                }
            }
            fclose($handle);
        } elseif ($request->has('rows') && is_array($request->rows)) {
            $rawRows = $request->rows;
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Please upload a valid Excel or CSV file.',
            ], 400);
        }

        if (empty($rawRows)) {
            return response()->json([
                'success' => false,
                'message' => 'No readable data rows found in the uploaded file.',
            ], 400);
        }

        $userEmails   = User::withTrashed()->pluck('email')->map(fn($e) => strtolower($e))->toArray();
        $clientEmails = Client::withTrashed()->pluck('email')->map(fn($e) => strtolower($e))->toArray();
        $existingEmails = array_values(array_unique(array_filter(array_merge($userEmails, $clientEmails))));
        $fileEmails = [];
        
        $parsedRows = [];
        $validCount = 0;
        $warningCount = 0;
        $errorCount = 0;

        foreach ($rawRows as $idx => $r) {
            $rowNum = $idx + 1;
            $name  = trim($r['name'] ?? '');
            $email = strtolower(trim($r['email'] ?? ''));
            $role  = strtolower(trim($r['role'] ?? 'client'));
            if ($userType === 'client') $role = 'client';

            $password = trim($r['password'] ?? '');
            if (empty($password)) {
                $password = 'Knower@2026';
            }

            $phone        = trim($r['phone'] ?? '');
            $companyName  = trim($r['company_name'] ?? '');
            $department   = trim($r['department'] ?? '');
            $position     = trim($r['position'] ?? '');
            $salary       = trim($r['salary'] ?? '');
            $hireDate     = trim($r['hire_date'] ?? '');
            $idNumber     = trim($r['id_number'] ?? '');

            $rowErrors = [];
            $rowWarnings = [];

            // Validation Rules
            if (empty($name)) {
                $rowErrors[] = 'Full Name is required.';
            }

            if (empty($email)) {
                $rowErrors[] = 'Email address is required.';
            } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $rowErrors[] = 'Invalid email address format.';
            } elseif (in_array($email, $existingEmails)) {
                $rowErrors[] = 'Email address already exists in the system (User or Client).';
            } elseif (in_array($email, $fileEmails)) {
                $rowErrors[] = 'Duplicate email found within this Excel file batch.';
            }

            if (!empty($email)) {
                $fileEmails[] = $email;
            }

            // User-type specific checks
            if ($userType === 'client' && empty($companyName)) {
                $rowWarnings[] = 'Company Name is empty. Will default to user name.';
            }

            if (empty($phone)) {
                $rowWarnings[] = 'Phone number is not specified.';
            }

            $status = !empty($rowErrors) ? 'error' : (!empty($rowWarnings) ? 'warning' : 'valid');

            if ($status === 'valid') $validCount++;
            elseif ($status === 'warning') $warningCount++;
            else $errorCount++;

            $parsedRows[] = [
                'id'           => 'temp_' . uniqid(),
                'row_number'   => $rowNum,
                'name'         => $name,
                'email'        => $email,
                'role'         => $role,
                'user_type'    => $userType,
                'password'     => $password,
                'phone'        => $phone,
                'company_name' => $companyName,
                'department'   => $department,
                'position'     => $position,
                'salary'       => $salary,
                'hire_date'    => $hireDate,
                'id_number'    => $idNumber,
                'status'       => $status, // valid, warning, error, skipped
                'is_skipped'   => false,
                'errors'       => $rowErrors,
                'warnings'     => $rowWarnings,
            ];
        }

        return response()->json([
            'success'       => true,
            'user_type'     => $userType,
            'total_rows'    => count($parsedRows),
            'valid_count'   => $validCount,
            'warning_count' => $warningCount,
            'error_count'   => $errorCount,
            'skipped_count' => 0,
            'rows'          => $parsedRows,
        ]);
    }

    /**
     * Legacy import alias for backward compatibility.
     */
    public function importExcel(Request $request)
    {
        return $this->parseExcel($request);
    }

    /**
     * Confirm & Execute Batch User Creation.
     */
    public function confirmImport(Request $request)
    {
        $this->authorizeSuperAdmin($request);

        $validator = Validator::make($request->all(), [
            'rows' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $rows = $request->input('rows');
        $createdCount = 0;
        $skippedCount = 0;
        $failedCount = 0;

        $resultsReport = [];

        foreach ($rows as $r) {
            $isSkipped = !empty($r['is_skipped']) || ($r['status'] ?? '') === 'skipped';
            $status = $r['status'] ?? 'valid';

            if ($isSkipped) {
                $skippedCount++;
                $resultsReport[] = [
                    'row_number' => $r['row_number'] ?? 0,
                    'name'       => $r['name'] ?? '',
                    'email'      => $r['email'] ?? '',
                    'status'     => 'SKIPPED',
                    'message'    => 'User skipped by administrator review.',
                ];
                continue;
            }

            if ($status === 'error' || !empty($r['errors'])) {
                $failedCount++;
                $resultsReport[] = [
                    'row_number' => $r['row_number'] ?? 0,
                    'name'       => $r['name'] ?? '',
                    'email'      => $r['email'] ?? '',
                    'status'     => 'FAILED',
                    'message'    => implode(' ', $r['errors'] ?? ['Validation error.']),
                ];
                continue;
            }

            $email = strtolower(trim($r['email']));

            // Check if user email already exists
            if (User::withTrashed()->where('email', $email)->exists()) {
                $failedCount++;
                $resultsReport[] = [
                    'row_number' => $r['row_number'] ?? 0,
                    'name'       => $r['name'] ?? '',
                    'email'      => $email,
                    'status'     => 'FAILED',
                    'message'    => 'Email address already exists in system.',
                ];
                continue;
            }

            DB::beginTransaction();
            try {
                $user = User::create([
                    'name'     => trim($r['name']),
                    'email'    => $email,
                    'password' => Hash::make(trim($r['password'] ?: 'Knower@2026')),
                    'role'     => trim($r['role'] ?: 'client'),
                    'phone'    => trim($r['phone'] ?? ''),
                ]);

                if ($user->role === 'client') {
                    $existingClient = Client::withTrashed()->where('email', $user->email)->first();
                    if ($existingClient) {
                        if ($existingClient->trashed()) {
                            $existingClient->restore();
                        }
                        $existingClient->update([
                            'name'     => trim($r['company_name']) ?: $user->name,
                            'phone'    => $user->phone,
                            'position' => trim($r['position']) ?: 'Client Representative',
                            'user_id'  => $user->id,
                            'status'   => 'active',
                        ]);
                    } else {
                        Client::create([
                            'name'     => trim($r['company_name']) ?: $user->name,
                            'email'    => $user->email,
                            'phone'    => $user->phone,
                            'position' => trim($r['position']) ?: 'Client Representative',
                            'user_id'  => $user->id,
                            'status'   => 'active',
                        ]);
                    }
                } else {
                    $existingEmployee = Employee::withTrashed()->where('user_id', $user->id)->first();
                    if ($existingEmployee) {
                        if ($existingEmployee->trashed()) {
                            $existingEmployee->restore();
                        }
                        $existingEmployee->update([
                            'department' => trim($r['department'] ?? 'General'),
                            'position'   => trim($r['position'] ?? ucwords(str_replace('_', ' ', $user->role))),
                            'salary'     => is_numeric($r['salary'] ?? null) ? (float)$r['salary'] : 0,
                            'hire_date'  => !empty($r['hire_date']) ? $r['hire_date'] : now(),
                            'id_number'  => trim($r['id_number'] ?? ''),
                            'status'     => 'active',
                        ]);
                    } else {
                        Employee::create([
                            'user_id'    => $user->id,
                            'department' => trim($r['department'] ?? 'General'),
                            'position'   => trim($r['position'] ?? ucwords(str_replace('_', ' ', $user->role))),
                            'salary'     => is_numeric($r['salary'] ?? null) ? (float)$r['salary'] : 0,
                            'hire_date'  => !empty($r['hire_date']) ? $r['hire_date'] : now(),
                            'id_number'  => trim($r['id_number'] ?? ''),
                            'status'     => 'active',
                        ]);
                    }
                }

                UserActivityLogger::log(
                    $user->id,
                    'Account Created via Excel Batch',
                    'admin',
                    "User Account #{$user->id}",
                    "User imported from Excel file by Super Admin.",
                    'Users',
                    'create',
                    ['role' => $user->role, 'email' => $user->email],
                    $request->user()->id,
                    $request->user()->name,
                    $request->user()->role
                );

                DB::commit();

                $createdCount++;
                $resultsReport[] = [
                    'row_number' => $r['row_number'] ?? 0,
                    'name'       => $user->name,
                    'email'      => $user->email,
                    'status'     => 'SUCCESS',
                    'message'    => "Created as ID #{$user->id} ({$user->role})",
                ];
            } catch (\Exception $e) {
                DB::rollBack();
                $failedCount++;
                $resultsReport[] = [
                    'row_number' => $r['row_number'] ?? 0,
                    'name'       => $r['name'] ?? '',
                    'email'      => $email,
                    'status'     => 'FAILED',
                    'message'    => 'Database error: ' . $e->getMessage(),
                ];
            }
        }

        return response()->json([
            'success'       => true,
            'message'       => "Batch import complete. Created: {$createdCount}, Skipped: {$skippedCount}, Failed: {$failedCount}",
            'created_count' => $createdCount,
            'skipped_count' => $skippedCount,
            'failed_count'  => $failedCount,
            'results'       => $resultsReport,
        ]);
    }

    /**
     * Download Audit Report for Completed Import Batch.
     */
    public function downloadImportReport(Request $request)
    {
        $this->authorizeSuperAdmin($request);

        $results = $request->input('results', []);

        $fileName = "user_import_report_" . date('Y-m-d_H-i-s') . ".csv";
        $headers = [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
        ];

        $columns = ['Row #', 'Name', 'Email Address', 'Import Status', 'Details / Message'];

        $callback = function () use ($columns, $results) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            foreach ($results as $r) {
                fputcsv($file, [
                    $r['row_number'] ?? 'N/A',
                    $r['name'] ?? '',
                    $r['email'] ?? '',
                    $r['status'] ?? '',
                    $r['message'] ?? '',
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Map role codes to human-readable user type labels.
     */
    protected function getUserTypeLabel(string $role): string
    {
        $labels = [
            'super_admin'            => 'Super Admin',
            'administrator'          => 'Administrator',
            'admin'                  => 'Admin',
            'ceo'                    => 'CEO',
            'sales'                  => 'Sales Representative',
            'marketing_admin'        => 'Marketing Admin',
            'social_manager'         => 'Social Media Manager',
            'ads_specialist'         => 'Ads Specialist',
            'content_creator'        => 'Content Creator',
            'project_manager'        => 'Project Manager',
            'team_leader'            => 'Team Leader',
            'developer'              => 'Software Developer',
            'backend_developer'      => 'Backend Developer',
            'frontend_developer'     => 'Frontend Developer',
            'full_stack_developer'  => 'Full Stack Developer',
            'mobile_developer'       => 'Mobile Developer',
            'devops'                 => 'DevOps Engineer',
            'designer'               => 'UI/UX Designer',
            'qa'                     => 'QA Tester',
            'accountant'             => 'Accountant',
            'hr'                     => 'HR Manager',
            'support'                => 'Support Agent',
            'support_manager'        => 'Support Manager',
            'client'                 => 'Client Portal User',
        ];

        return $labels[$role] ?? ucwords(str_replace('_', ' ', $role));
    }
}
