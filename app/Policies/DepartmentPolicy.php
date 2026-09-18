<?php

namespace App\Policies;

use App\Modules\HR\Models\Department;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DepartmentPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage');
    }

    public function view(User $user, Department $department): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage');
    }

    public function update(User $user, Department $department): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage');
    }

    public function delete(User $user, Department $department): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage');
    }

    public function restore(User $user, Department $department): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage');
    }

    public function forceDelete(User $user, Department $department): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage');
    }
}
