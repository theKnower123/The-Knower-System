<?php
namespace App\Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use App\Services\Core\WorkspaceService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Modules\Settings\Models\Workspace;
use Illuminate\Support\Facades\Gate;

class WorkspaceController extends Controller
{
    protected WorkspaceService $workspaceService;

    public function __construct(WorkspaceService $workspaceService)
    {
        $this->workspaceService = $workspaceService;
    }

    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Workspace::class);
        return response()->json([
            'success' => true,
            'message' => 'Workspaces retrieved successfully.',
            'data' => $this->workspaceService->getAllForUser($request->user())
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        Gate::authorize('create', Workspace::class);
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:workspaces,name'
        ]);

        $workspace = $this->workspaceService->create($validated, $request->user());

        return response()->json([
            'success' => true,
            'message' => 'Workspace created successfully.',
            'data' => $workspace
        ], 201);
    }

    public function show(Workspace $workspace): JsonResponse
    {
        Gate::authorize('view', $workspace);
        return response()->json([
            'success' => true,
            'message' => 'Workspace retrieved successfully.',
            'data' => $workspace->load('users')
        ]);
    }

    public function update(Request $request, Workspace $workspace): JsonResponse
    {
        Gate::authorize('update', $workspace);
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:workspaces,name,' . $workspace->id
        ]);

        $workspace = $this->workspaceService->update($workspace, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Workspace updated successfully.',
            'data' => $workspace
        ]);
    }

    public function destroy(Workspace $workspace): JsonResponse
    {
        Gate::authorize('delete', $workspace);
        $this->workspaceService->delete($workspace);

        return response()->json([
            'success' => true,
            'message' => 'Workspace deleted successfully.',
            'data' => null
        ]);
    }

    public function switch(Request $request, Workspace $workspace): JsonResponse
    {
        Gate::authorize('view', $workspace);
        
        $user = $request->user();
        $user->current_workspace_id = $workspace->id;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Switched workspace context successfully.',
            'data' => $workspace
        ]);
    }
}
