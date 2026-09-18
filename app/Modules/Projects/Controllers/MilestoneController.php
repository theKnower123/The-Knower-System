<?php

namespace App\Modules\Projects\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Projects\Requests\StoreMilestoneRequest;
use App\Modules\Projects\Requests\UpdateMilestoneRequest;
use App\Http\Resources\Projects\MilestoneResource;
use App\Modules\Projects\Models\Milestone;
use App\Modules\Projects\Services\MilestoneService;
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
        $milestone = $this->milestoneService->create($request->all());

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
        $milestone = $this->milestoneService->update($milestone, $request->all());

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
