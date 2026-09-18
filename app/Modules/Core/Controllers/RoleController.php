<?php

namespace App\Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use App\Services\Core\RoleService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Gate;

class RoleController extends Controller
{
    protected RoleService $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Role::class);
        return response()->json([
            'success' => true,
            'message' => 'Roles retrieved successfully.',
            'data' => $this->roleService->getAll()
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        Gate::authorize('create', Role::class);
        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name|max:255',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name'
        ]);

        $role = $this->roleService->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Role created successfully.',
            'data' => $role->load('permissions')
        ], 201);
    }

    public function show(Role $role): JsonResponse
    {
        Gate::authorize('view', $role);
        return response()->json([
            'success' => true,
            'message' => 'Role retrieved successfully.',
            'data' => $role->load('permissions')
        ]);
    }

    public function update(Request $request, Role $role): JsonResponse
    {
        Gate::authorize('update', $role);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name'
        ]);

        $role = $this->roleService->update($role, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Role updated successfully.',
            'data' => $role->load('permissions')
        ]);
    }

    public function destroy(Role $role): JsonResponse
    {
        Gate::authorize('delete', $role);
        $this->roleService->delete($role);

        return response()->json([
            'success' => true,
            'message' => 'Role deleted successfully.',
            'data' => null
        ]);
    }

    public function permissions(): JsonResponse
    {
        Gate::authorize('viewAny', Role::class); // Reusing role view perm
        return response()->json([
            'success' => true,
            'message' => 'Permissions retrieved successfully.',
            'data' => $this->roleService->getAllPermissions()
        ]);
    }
}
