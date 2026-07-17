<?php

namespace App\Policies;

use App\Models\Attendance;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AttendancePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_attendances');
    }

    public function view(User $user, Attendance $attendance): bool
    {
        return $user->hasPermissionTo('view_attendances');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_attendances');
    }

    public function update(User $user, Attendance $attendance): bool
    {
        return $user->hasPermissionTo('edit_attendances');
    }

    public function delete(User $user, Attendance $attendance): bool
    {
        return $user->hasPermissionTo('delete_attendances');
    }
}
