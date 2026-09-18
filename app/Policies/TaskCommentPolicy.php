<?php

namespace App\Policies;

use App\Modules\Projects\Models\TaskComment;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TaskCommentPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('project.view') || $user->hasPermissionTo('task.manage');
    }

    public function view(User $user, TaskComment $taskComment): bool
    {
        return $user->hasPermissionTo('project.view') || $user->hasPermissionTo('task.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('task.manage');
    }

    public function update(User $user, TaskComment $taskComment): bool
    {
        return $user->hasPermissionTo('task.manage');
    }

    public function delete(User $user, TaskComment $taskComment): bool
    {
        return $user->hasPermissionTo('task.manage');
    }

    public function restore(User $user, TaskComment $taskComment): bool
    {
        return $user->hasPermissionTo('task.manage');
    }

    public function forceDelete(User $user, TaskComment $taskComment): bool
    {
        return $user->hasPermissionTo('task.manage');
    }
}
