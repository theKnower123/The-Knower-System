<?php

namespace App\Policies;

use App\Modules\Projects\Models\Bug;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BugPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('project.view') || $user->hasPermissionTo('bug.manage');
    }

    public function view(User $user, Bug $bug): bool
    {
        return $user->hasPermissionTo('project.view') || $user->hasPermissionTo('bug.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('bug.manage');
    }

    public function update(User $user, Bug $bug): bool
    {
        return $user->hasPermissionTo('bug.manage');
    }

    public function delete(User $user, Bug $bug): bool
    {
        return $user->hasPermissionTo('bug.manage');
    }

    public function restore(User $user, Bug $bug): bool
    {
        return $user->hasPermissionTo('bug.manage');
    }

    public function forceDelete(User $user, Bug $bug): bool
    {
        return $user->hasPermissionTo('bug.manage');
    }
}
