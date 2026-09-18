<?php

namespace App\Policies;

use App\Modules\Projects\Models\Milestone;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MilestonePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('project.view') || $user->hasPermissionTo('project.manage');
    }

    public function view(User $user, Milestone $milestone): bool
    {
        return $user->hasPermissionTo('project.view') || $user->hasPermissionTo('project.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('project.manage');
    }

    public function update(User $user, Milestone $milestone): bool
    {
        return $user->hasPermissionTo('project.manage');
    }

    public function delete(User $user, Milestone $milestone): bool
    {
        return $user->hasPermissionTo('project.manage');
    }

    public function restore(User $user, Milestone $milestone): bool
    {
        return $user->hasPermissionTo('project.manage');
    }

    public function forceDelete(User $user, Milestone $milestone): bool
    {
        return $user->hasPermissionTo('project.manage');
    }
}
