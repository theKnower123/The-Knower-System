<?php

namespace App\Modules\Projects\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Projects\Requests\StoreProjectRequest;
use App\Modules\Projects\Requests\UpdateProjectRequest;
use App\Http\Resources\Projects\ProjectResource;
use App\Modules\Projects\Models\Project;
use App\Modules\Projects\Services\ProjectService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class ProjectController extends Controller
{
    protected ProjectService $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Project::class);

        $projects = $this->projectService->getAll();
        
        // Load relations if needed
        $projects->load(['client', 'creator', 'users']);

        return response()->json([
            'success' => true,
            'message' => 'Projects retrieved successfully.',
            'data' => ProjectResource::collection($projects)
        ]);
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $project = $this->projectService->create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully.',
            'data' => new ProjectResource($project)
        ], 201);
    }

    public function show(Project $project): JsonResponse
    {
        Gate::authorize('view', $project);
        $project->load(['client', 'creator', 'users', 'milestones', 'tasks.assignee', 'bugs', 'files']);

        return response()->json([
            'success' => true,
            'message' => 'Project retrieved successfully.',
            'data' => new ProjectResource($project)
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $project = $this->projectService->update($project, $request->all());

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully.',
            'data' => new ProjectResource($project)
        ]);
    }

    public function activity(Project $project)
    {
        return response()->json([
            'success' => true,
            'message' => 'Project activity retrieved successfully.',
            'data' => $project->activities()->with('causer')->latest()->get()
        ]);
    }

    public function destroy(Project $project): JsonResponse
    {
        Gate::authorize('delete', $project);

        $this->projectService->delete($project);

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully.',
            'data' => null
        ]);
    }
}
