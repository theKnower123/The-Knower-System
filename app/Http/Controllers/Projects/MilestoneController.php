<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Http\Requests\Projects\StoreMilestoneRequest;
use App\Http\Requests\Projects\UpdateMilestoneRequest;
use App\Http\Resources\Projects\MilestoneResource;
use App\Models\Milestone;
use App\Services\Projects\MilestoneService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class MilestoneController extends Controller
{
    protected MilestoneService $milestoneService;

    public function __construct(MilestoneService $milestoneService)
    {
        $this->milestoneService = $milestoneService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Milestone::class);

        $milestones = $this->milestoneService->getAll();
        
        // Load relations if needed
        $milestones->load('project');

        return response()->json([
            'success' => true,
            'message' => 'Milestones retrieved successfully.',
            'data' => MilestoneResource::collection($milestones)
        ]);
    }

    public function store(StoreMilestoneRequest $request): JsonResponse
    {
        $milestone = $this->milestoneService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Milestone created successfully.',
            'data' => new MilestoneResource($milestone)
        ], 201);
    }

    public function show(Milestone $milestone): JsonResponse
    {
        Gate::authorize('view', $milestone);
        $milestone->load(['project', 'tasks']);

        return response()->json([
            'success' => true,
            'message' => 'Milestone retrieved successfully.',
            'data' => new MilestoneResource($milestone)
        ]);
    }

    public function update(UpdateMilestoneRequest $request, Milestone $milestone): JsonResponse
    {
        $milestone = $this->milestoneService->update($milestone, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Milestone updated successfully.',
            'data' => new MilestoneResource($milestone)
        ]);
    }

    public function destroy(Milestone $milestone): JsonResponse
    {
        Gate::authorize('delete', $milestone);

        $this->milestoneService->delete($milestone);

        return response()->json([
            'success' => true,
            'message' => 'Milestone deleted successfully.',
            'data' => null
        ]);
    }
}
