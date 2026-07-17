<?php

namespace App\Services\Projects;

use App\Models\TaskComment;
use Illuminate\Database\Eloquent\Collection;

class TaskCommentService
{
    public function getAll(): Collection
    {
        return TaskComment::latest()->get(); // Add default relations if needed
    }

    public function create(array $data): TaskComment
    {
        return TaskComment::create($data);
    }

    public function update(TaskComment $taskcomment, array $data): TaskComment
    {
        $taskcomment->update($data);
        return $taskcomment;
    }

    public function delete(TaskComment $taskcomment): ?bool
    {
        return $taskcomment->delete();
    }
}
