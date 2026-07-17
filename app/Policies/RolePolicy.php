<?php

namespace App\Policies;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Auth\Access\HandlesAuthorization;

class RolePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_roles');
    }

    public function view(User $user, Role $role): bool
    {
        return $user->hasPermissionTo('view_roles');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_roles');
    }

    public function update(User $user, Role $role): bool
    {
        // Prevent editing super admin
        if ($role->name === 'Super Admin') return false;
        return $user->hasPermissionTo('edit_roles');
    }

    public function delete(User $user, Role $role): bool
    {
        // Prevent deleting core roles
        if (in_array($role->name, ['Super Admin', 'Organization Admin'])) return false;
        return $user->hasPermissionTo('delete_roles');
    }
}
