<?php

namespace App\Policies;

use App\Models\Bug;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BugPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_bugs');
    }

    public function view(User $user, Bug $bug): bool
    {
        return $user->hasPermissionTo('view_bugs');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_bugs');
    }

    public function update(User $user, Bug $bug): bool
    {
        return $user->hasPermissionTo('edit_bugs');
    }

    public function delete(User $user, Bug $bug): bool
    {
        return $user->hasPermissionTo('delete_bugs');
    }
}
