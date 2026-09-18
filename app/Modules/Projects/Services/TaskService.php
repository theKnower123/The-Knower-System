<?php

namespace App\Modules\Projects\Services;

use App\Modules\Projects\Models\Task;
use Illuminate\Database\Eloquent\Collection;

class TaskService
{
    public function getAll(): Collection
    {
        return Task::trashMode()->orderBy("id", "desc")->get(); // Add default relations if needed
    }

    public function create(array $data): Task
    {
        $task = Task::create($data);

        if ($task->assigned_to) {
            $assignee = \App\Modules\Auth\Models\User::find($task->assigned_to);
            if ($assignee) {
                $assignee->notify(new \App\Notifications\TaskAssigned($task));
            }
        }

        return $task;
    }

    public function update(Task $task, array $data): Task
    {
        $originalAssignee = $task->assigned_to;
        $task->update($data);

        // If newly assigned or reassigned to a new user
        if ($task->assigned_to && $task->assigned_to !== $originalAssignee) {
            $assignee = \App\Modules\Auth\Models\User::find($task->assigned_to);
            if ($assignee) {
                $assignee->notify(new \App\Notifications\TaskAssigned($task));
            }
        }

        return $task;
    }

    public function delete(Task $task): ?bool
    {
        return $task->delete();
    }
}
