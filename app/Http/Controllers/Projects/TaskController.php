<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Http\Requests\Projects\StoreTaskRequest;
use App\Http\Requests\Projects\UpdateTaskRequest;
use App\Http\Resources\Projects\TaskResource;
use App\Models\Task;
use App\Services\Projects\TaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class TaskController extends Controller
{
    protected TaskService $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Task::class);

        $tasks = $this->taskService->getAll();
        
        // Load relations if needed
        $tasks->load(['project', 'milestone', 'assignee']);

        return response()->json([
            'success' => true,
            'message' => 'Tasks retrieved successfully.',
            'data' => TaskResource::collection($tasks)
        ]);
    }

    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = $this->taskService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully.',
            'data' => new TaskResource($task)
        ], 201);
    }

    public function show(Task $task): JsonResponse
    {
        Gate::authorize('view', $task);
        $task->load(['project', 'milestone', 'assignee', 'comments.user', 'bugs']);

        return response()->json([
            'success' => true,
            'message' => 'Task retrieved successfully.',
            'data' => new TaskResource($task)
        ]);
    }

    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        $task = $this->taskService->update($task, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully.',
            'data' => new TaskResource($task)
        ]);
    }

    public function destroy(Task $task): JsonResponse
    {
        Gate::authorize('delete', $task);

        $this->taskService->delete($task);

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully.',
            'data' => null
        ]);
    }
}
