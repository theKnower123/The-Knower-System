<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CRM\Models\Client;
use App\Modules\HR\Models\Employee;
use App\Services\UserActivityLogger;
use App\Services\SystemNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    /**
     * Update General Information (Name, Phone, Address, ID Number, Avatar).
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name'      => 'required|string|max:255',
            'phone'     => 'nullable|string|max:50',
            'address'   => 'nullable|string|max:500',
            'id_number' => 'nullable|string|max:100',
            'avatar'    => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        $oldData = [
            'name'      => $user->name,
            'phone'     => $user->phone,
            'address'   => $user->address,
            'id_number' => $user->id_number,
        ];

        $user->name      = trim($request->input('name'));
        $user->phone     = trim($request->input('phone', $user->phone));
        $user->address   = trim($request->input('address', $user->address));
        $user->id_number = trim($request->input('id_number', $user->id_number));

        if ($request->filled('avatar')) {
            $user->avatar = $request->input('avatar');
        }

        $user->save();

        // Sync with linked Client or Employee records
        if ($user->role === 'client') {
            $client = Client::withTrashed()->where('user_id', $user->id)->first();
            if ($client) {
                $client->update([
                    'name'  => $user->name,
                    'phone' => $user->phone,
                ]);
            }
        } else {
            $employee = Employee::withTrashed()->where('user_id', $user->id)->first();
            if ($employee) {
                $employee->update([
                    'id_number' => $user->id_number,
                ]);
            }
        }

        UserActivityLogger::log(
            $user->id,
            'Updated Profile Settings',
            'profile',
            "User Profile #{$user->id}",
            "User updated personal information.",
            'Profile',
            'edit',
            ['before' => $oldData, 'after' => $user->only(['name', 'phone', 'address', 'id_number'])],
            $user->id,
            $user->name,
            $user->role
        );

        return response()->json([
            'success' => true,
            'message' => 'Profile settings updated successfully.',
            'data'    => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'phone'      => $user->phone,
                'address'    => $user->address,
                'id_number'  => $user->id_number,
                'avatar'     => $user->avatar,
                'role'       => $user->role,
                'department' => $user->employee?->department ?? 'Unassigned',
                'position'   => $user->employee?->position ?? 'Unassigned',
            ],
        ]);
    }

    /**
     * Update Password.
     */
    public function updatePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password'     => ['required', Password::defaults()],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        if (!Hash::check($request->input('current_password'), $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'The current password you provided is incorrect.',
            ], 422);
        }

        $user->password = Hash::make($request->input('new_password'));
        $user->save();

        UserActivityLogger::log(
            $user->id,
            'Changed Account Password',
            'security',
            "User Account #{$user->id}",
            "Account password updated securely.",
            'Profile',
            'edit',
            null,
            $user->id,
            $user->name,
            $user->role
        );

        return response()->json([
            'success' => true,
            'message' => 'Password updated successfully.',
        ]);
    }

    /**
     * Get Active Devices for User.
     */
    public function getDevices(Request $request): JsonResponse
    {
        $user = $request->user();
        $currentSessionId = session()->getId();
        $currentIp = $request->ip();
        $currentUserAgent = $request->userAgent();

        // Sync or register current active device
        $existingCurrent = DB::table('user_devices')
            ->where('user_id', $user->id)
            ->where('ip_address', $currentIp)
            ->where('user_agent', $currentUserAgent)
            ->first();

        if (!$existingCurrent) {
            DB::table('user_devices')->insert([
                'user_id'        => $user->id,
                'session_id'     => $currentSessionId,
                'device_name'    => self::parseDeviceName($currentUserAgent),
                'browser'        => self::parseBrowser($currentUserAgent),
                'platform'       => self::parsePlatform($currentUserAgent),
                'ip_address'     => $currentIp,
                'user_agent'     => $currentUserAgent,
                'status'         => 'active',
                'is_current'     => true,
                'last_active_at' => now(),
                'created_at'     => now(),
                'updated_at'     => now(),
            ]);
        } else {
            DB::table('user_devices')
                ->where('id', $existingCurrent->id)
                ->update([
                    'session_id'     => $currentSessionId,
                    'status'         => 'active',
                    'is_current'     => true,
                    'last_active_at' => now(),
                    'updated_at'     => now(),
                ]);
        }

        $devices = DB::table('user_devices')
            ->where('user_id', $user->id)
            ->orderByDesc('is_current')
            ->orderByDesc('last_active_at')
            ->get()
            ->map(function ($dev) use ($currentSessionId, $currentIp, $currentUserAgent) {
                $isCurrent = ($dev->session_id === $currentSessionId) || ($dev->ip_address === $currentIp && $dev->user_agent === $currentUserAgent);
                return [
                    'id'             => $dev->id,
                    'device_name'    => $dev->device_name,
                    'browser'        => $dev->browser,
                    'platform'       => $dev->platform,
                    'ip_address'     => $dev->ip_address,
                    'status'         => $dev->status,
                    'is_current'     => (bool) $isCurrent,
                    'last_active_at' => $dev->last_active_at,
                ];
            });

        return response()->json([
            'success' => true,
            'devices' => $devices,
        ]);
    }

    /**
     * Revoke / Remove a Device & Logout if current.
     */
    public function revokeDevice(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        $device = DB::table('user_devices')
            ->where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$device) {
            return response()->json([
                'success' => false,
                'message' => 'Device not found.',
            ], 404);
        }

        $currentSessionId = session()->getId();
        $isCurrentDevice = ($device->session_id === $currentSessionId) || ($device->ip_address === $request->ip() && $device->user_agent === $request->userAgent());

        // Mark device as revoked
        DB::table('user_devices')
            ->where('id', $device->id)
            ->update([
                'status'     => 'revoked',
                'is_current' => false,
                'updated_at' => now(),
            ]);

        // Destroy sessions with matching IP / User Agent
        DB::table('sessions')
            ->where('user_id', $user->id)
            ->where(function ($q) use ($device) {
                $q->where('id', $device->session_id)
                  ->orWhere('ip_address', $device->ip_address);
            })
            ->delete();

        // Audit Log & Notify
        UserActivityLogger::log(
            $user->id,
            'Revoked Logged-in Device',
            'security',
            "Device: {$device->device_name}",
            "Removed active device access for {$device->device_name} ({$device->ip_address}). Require approval for future logins.",
            'Security',
            'delete',
            ['device_id' => $device->id, 'ip' => $device->ip_address],
            $user->id,
            $user->name,
            $user->role
        );

        // If revoking current device, log out user immediately
        if ($isCurrentDevice) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json([
                'success'     => true,
                'is_logged_out' => true,
                'message'     => 'Your current device access has been revoked. You have been logged out.',
            ]);
        }

        return response()->json([
            'success'     => true,
            'is_logged_out' => false,
            'message'     => "Device '{$device->device_name}' logged out successfully.",
        ]);
    }

    /**
     * Approve Device Relogin Request.
     */
    public function approveDeviceRequest(Request $request, $requestId): JsonResponse
    {
        $user = $request->user();
        $req = DB::table('device_approval_requests')
            ->where('user_id', $user->id)
            ->where('id', $requestId)
            ->first();

        if (!$req) {
            return response()->json(['success' => false, 'message' => 'Request not found.'], 404);
        }

        DB::table('device_approval_requests')
            ->where('id', $req->id)
            ->update(['status' => 'approved', 'updated_at' => now()]);

        if ($req->user_device_id) {
            DB::table('user_devices')
                ->where('id', $req->user_device_id)
                ->update(['status' => 'active', 'updated_at' => now()]);
        }

        UserActivityLogger::log(
            $user->id,
            'Approved Device Login Request',
            'security',
            "Device: {$req->device_name}",
            "Approved login request from IP {$req->ip_address}.",
            'Security',
            'edit'
        );

        return response()->json([
            'success' => true,
            'message' => 'Device approved successfully.',
        ]);
    }

    private static function parseDeviceName(?string $ua): string
    {
        if (!$ua) return 'Unknown Browser';
        if (str_contains($ua, 'iPhone')) return 'iPhone Mobile';
        if (str_contains($ua, 'Android')) return 'Android Phone';
        if (str_contains($ua, 'Macintosh')) return 'MacBook / macOS';
        if (str_contains($ua, 'Windows')) return 'Windows PC';
        if (str_contains($ua, 'Linux')) return 'Linux Workstation';
        return 'Web Client';
    }

    private static function parseBrowser(?string $ua): string
    {
        if (!$ua) return 'Browser';
        if (str_contains($ua, 'Chrome')) return 'Chrome';
        if (str_contains($ua, 'Safari') && !str_contains($ua, 'Chrome')) return 'Safari';
        if (str_contains($ua, 'Firefox')) return 'Firefox';
        if (str_contains($ua, 'Edg')) return 'Edge';
        return 'Web Browser';
    }

    private static function parsePlatform(?string $ua): string
    {
        if (!$ua) return 'Desktop';
        if (str_contains($ua, 'Mobile')) return 'Mobile';
        return 'Desktop';
    }
}
