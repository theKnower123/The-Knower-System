<?php

namespace App\Modules\Projects\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Projects\Requests\StoreTaskCommentRequest;
use App\Modules\Projects\Requests\UpdateTaskCommentRequest;
use App\Http\Resources\Projects\TaskCommentResource;
use App\Modules\Projects\Models\TaskComment;
use App\Modules\Projects\Services\TaskCommentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class TaskCommentController extends Controller
{
    protected TaskCommentService $taskcommentService;

    public function __construct(TaskCommentService $taskcommentService)
    {
        $this->taskcommentService = $taskcommentService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', TaskComment::class);

        $taskcomments = $this->taskcommentService->getAll();
        
        // Load relations if needed
        $taskcomments->load(['task', 'user']);

        return response()->json([
            'success' => true,
            'message' => 'TaskComments retrieved successfully.',
            'data' => TaskCommentResource::collection($taskcomments)
        ]);
    }

    public function store(StoreTaskCommentRequest $request): JsonResponse
    {
        $taskcomment = $this->taskcommentService->create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'TaskComment created successfully.',
            'data' => new TaskCommentResource($taskcomment)
        ], 201);
    }

    public function show(TaskComment $taskcomment): JsonResponse
    {
        Gate::authorize('view', $taskcomment);

        return response()->json([
            'success' => true,
            'message' => 'TaskComment retrieved successfully.',
            'data' => new TaskCommentResource($taskcomment)
        ]);
    }

    public function update(UpdateTaskCommentRequest $request, TaskComment $taskcomment): JsonResponse
    {
        $taskcomment = $this->taskcommentService->update($taskcomment, $request->all());

        return response()->json([
            'success' => true,
            'message' => 'TaskComment updated successfully.',
            'data' => new TaskCommentResource($taskcomment)
        ]);
    }

    public function destroy(TaskComment $taskcomment): JsonResponse
    {
        Gate::authorize('delete', $taskcomment);

        $this->taskcommentService->delete($taskcomment);

        return response()->json([
            'success' => true,
            'message' => 'TaskComment deleted successfully.',
            'data' => null
        ]);
    }
}
