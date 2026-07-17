<?php

namespace App\Policies;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class EmployeePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_employees');
    }

    public function view(User $user, Employee $employee): bool
    {
        return $user->hasPermissionTo('view_employees');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_employees');
    }

    public function update(User $user, Employee $employee): bool
    {
        return $user->hasPermissionTo('edit_employees');
    }

    public function delete(User $user, Employee $employee): bool
    {
        return $user->hasPermissionTo('delete_employees');
    }
}
