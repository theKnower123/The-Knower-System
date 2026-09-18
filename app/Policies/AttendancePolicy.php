<?php

namespace App\Policies;

use App\Modules\HR\Models\Attendance;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AttendancePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage') || $user->hasPermissionTo('attendance.manage');
    }

    public function view(User $user, Attendance $attendance): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage') || $user->hasPermissionTo('attendance.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage') || $user->hasPermissionTo('attendance.manage');
    }

    public function update(User $user, Attendance $attendance): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage') || $user->hasPermissionTo('attendance.manage');
    }

    public function delete(User $user, Attendance $attendance): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage') || $user->hasPermissionTo('attendance.manage');
    }

    public function restore(User $user, Attendance $attendance): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage') || $user->hasPermissionTo('attendance.manage');
    }

    public function forceDelete(User $user, Attendance $attendance): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage') || $user->hasPermissionTo('attendance.manage');
    }
}
