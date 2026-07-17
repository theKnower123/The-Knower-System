<?php

namespace App\Services\Projects;

use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;

class TaskService
{
    public function getAll(): Collection
    {
        return Task::latest()->get(); // Add default relations if needed
    }

    public function create(array $data): Task
    {
        return Task::create($data);
    }

    public function update(Task $task, array $data): Task
    {
        $task->update($data);
        return $task;
    }

    public function delete(Task $task): ?bool
    {
        return $task->delete();
    }
}
