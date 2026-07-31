<?php

namespace App\Policies;

use App\Modules\HR\Models\Leave;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class LeavePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage') || $user->hasPermissionTo('leave.manage');
    }

    public function view(User $user, Leave $leave): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage') || $user->hasPermissionTo('leave.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage') || $user->hasPermissionTo('leave.manage');
    }

    public function update(User $user, Leave $leave): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage') || $user->hasPermissionTo('leave.manage');
    }

    public function delete(User $user, Leave $leave): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage') || $user->hasPermissionTo('leave.manage');
    }

    public function restore(User $user, Leave $leave): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage') || $user->hasPermissionTo('leave.manage');
    }

    public function forceDelete(User $user, Leave $leave): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage') || $user->hasPermissionTo('leave.manage');
    }
}
