<?php

namespace App\Policies;

use App\Models\Leave;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class LeavePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_leaves');
    }

    public function view(User $user, Leave $leave): bool
    {
        return $user->hasPermissionTo('view_leaves');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_leaves');
    }

    public function update(User $user, Leave $leave): bool
    {
        return $user->hasPermissionTo('edit_leaves');
    }

    public function delete(User $user, Leave $leave): bool
    {
        return $user->hasPermissionTo('delete_leaves');
    }
}
