<?php

namespace App\Policies;

use App\Models\Milestone;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MilestonePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_milestones');
    }

    public function view(User $user, Milestone $milestone): bool
    {
        return $user->hasPermissionTo('view_milestones');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_milestones');
    }

    public function update(User $user, Milestone $milestone): bool
    {
        return $user->hasPermissionTo('edit_milestones');
    }

    public function delete(User $user, Milestone $milestone): bool
    {
        return $user->hasPermissionTo('delete_milestones');
    }
}
