<?php

namespace App\Policies;

use App\Modules\HR\Models\Employee;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class EmployeePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage');
    }

    public function view(User $user, Employee $employee): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('hr.manage');
    }

    public function update(User $user, Employee $employee): bool
    {
        return $user->hasPermissionTo('hr.manage');
    }

    public function delete(User $user, Employee $employee): bool
    {
        return $user->hasPermissionTo('hr.manage');
    }

    public function restore(User $user, Employee $employee): bool
    {
        return $user->hasPermissionTo('hr.manage');
    }

    public function forceDelete(User $user, Employee $employee): bool
    {
        return $user->hasPermissionTo('hr.manage');
    }
}
