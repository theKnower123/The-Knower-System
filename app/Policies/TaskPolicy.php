<?php

namespace App\Policies;

use App\Modules\Projects\Models\Task;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TaskPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('task.view') || $user->hasPermissionTo('project.view') || $user->hasPermissionTo('task.manage');
    }

    public function view(User $user, Task $task): bool
    {
        return $user->hasPermissionTo('task.view') || $user->hasPermissionTo('project.view') || $user->hasPermissionTo('task.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('task.manage');
    }

    public function update(User $user, Task $task): bool
    {
        return $user->hasPermissionTo('task.manage');
    }

    public function delete(User $user, Task $task): bool
    {
        return $user->hasPermissionTo('task.manage');
    }

    public function restore(User $user, Task $task): bool
    {
        return $user->hasPermissionTo('task.manage');
    }

    public function forceDelete(User $user, Task $task): bool
    {
        return $user->hasPermissionTo('task.manage');
    }
}
