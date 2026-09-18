<?php

namespace App\Modules\Projects\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Projects\Requests\StoreBugRequest;
use App\Modules\Projects\Requests\UpdateBugRequest;
use App\Http\Resources\Projects\BugResource;
use App\Modules\Projects\Models\Bug;
use App\Modules\Projects\Services\BugService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class BugController extends Controller
{
    protected BugService $bugService;

    public function __construct(BugService $bugService)
    {
        $this->bugService = $bugService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Bug::class);

        $bugs = $this->bugService->getAll();
        
        // Load relations if needed
        $bugs->load(['project', 'task', 'reporter', 'assignee']);

        return response()->json([
            'success' => true,
            'message' => 'Bugs retrieved successfully.',
            'data' => BugResource::collection($bugs)
        ]);
    }

    public function store(StoreBugRequest $request): JsonResponse
    {
        $bug = $this->bugService->create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Bug created successfully.',
            'data' => new BugResource($bug)
        ], 201);
    }

    public function show(Bug $bug): JsonResponse
    {
        Gate::authorize('view', $bug);
        $bug->load(['project', 'task', 'reporter', 'assignee']);

        return response()->json([
            'success' => true,
            'message' => 'Bug retrieved successfully.',
            'data' => new BugResource($bug)
        ]);
    }

    public function update(UpdateBugRequest $request, Bug $bug): JsonResponse
    {
        $bug = $this->bugService->update($bug, $request->all());

        return response()->json([
            'success' => true,
            'message' => 'Bug updated successfully.',
            'data' => new BugResource($bug)
        ]);
    }

    public function destroy(Bug $bug): JsonResponse
    {
        Gate::authorize('delete', $bug);

        $this->bugService->delete($bug);

        return response()->json([
            'success' => true,
            'message' => 'Bug deleted successfully.',
            'data' => null
        ]);
    }
}
