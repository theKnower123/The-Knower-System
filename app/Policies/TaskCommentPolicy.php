<?php

namespace App\Policies;

use App\Models\TaskComment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TaskCommentPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_taskcomments');
    }

    public function view(User $user, TaskComment $taskcomment): bool
    {
        return $user->hasPermissionTo('view_taskcomments');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_taskcomments');
    }

    public function update(User $user, TaskComment $taskcomment): bool
    {
        return $user->hasPermissionTo('edit_taskcomments');
    }

    public function delete(User $user, TaskComment $taskcomment): bool
    {
        return $user->hasPermissionTo('delete_taskcomments');
    }
}
