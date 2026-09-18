<?php

namespace App\Policies;

use App\Modules\Core\Models\Role;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class RolePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('settings.view') || $user->hasPermissionTo('settings.manage');
    }

    public function view(User $user, Role $role): bool
    {
        return $user->hasPermissionTo('settings.view') || $user->hasPermissionTo('settings.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('settings.manage');
    }

    public function update(User $user, Role $role): bool
    {
        return $user->hasPermissionTo('settings.manage');
    }

    public function delete(User $user, Role $role): bool
    {
        return $user->hasPermissionTo('settings.manage');
    }

    public function restore(User $user, Role $role): bool
    {
        return $user->hasPermissionTo('settings.manage');
    }

    public function forceDelete(User $user, Role $role): bool
    {
        return $user->hasPermissionTo('settings.manage');
    }
}
