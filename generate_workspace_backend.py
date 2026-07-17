import os

# Create Service
service_code = """<?php
namespace App\\Services\\Core;

use App\\Models\\Workspace;
use Illuminate\\Database\\Eloquent\\Collection;

class WorkspaceService
{
    public function getAllForUser($user): Collection
    {
        if ($user->hasRole('Super Admin')) {
            return Workspace::all();
        }
        return $user->workspaces()->get();
    }

    public function create(array $data, $user): Workspace
    {
        $workspace = Workspace::create([
            'name' => $data['name'],
            'slug' => str()->slug($data['name']),
            'owner_id' => $user->id,
        ]);
        
        $workspace->users()->attach($user->id);
        
        if (empty($user->current_workspace_id)) {
            $user->current_workspace_id = $workspace->id;
            $user->save();
        }
        
        return $workspace;
    }

    public function update(Workspace $workspace, array $data): Workspace
    {
        if (isset($data['name'])) {
            $workspace->name = $data['name'];
            $workspace->slug = str()->slug($data['name']);
        }
        $workspace->save();
        return $workspace;
    }

    public function delete(Workspace $workspace): bool
    {
        return $workspace->delete();
    }
}
"""
with open('app/Services/Core/WorkspaceService.php', 'w') as f: f.write(service_code)

# Create Policy
policy_code = """<?php
namespace App\\Policies;

use App\\Models\\User;
use App\\Models\\Workspace;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class WorkspacePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true; // Users can view their own workspaces (handled in service)
    }

    public function view(User $user, Workspace $workspace): bool
    {
        return $user->hasRole('Super Admin') || $workspace->users()->where('user_id', $user->id)->exists();
    }

    public function create(User $user): bool
    {
        return $user->hasRole('Super Admin') || $user->hasRole('Organization Admin');
    }

    public function update(User $user, Workspace $workspace): bool
    {
        return $user->hasRole('Super Admin') || $workspace->owner_id === $user->id;
    }

    public function delete(User $user, Workspace $workspace): bool
    {
        return $user->hasRole('Super Admin') || $workspace->owner_id === $user->id;
    }
}
"""
with open('app/Policies/WorkspacePolicy.php', 'w') as f: f.write(policy_code)

# Create Controller
controller_code = """<?php
namespace App\\Http\\Controllers\\Core;

use App\\Http\\Controllers\\Controller;
use App\\Services\\Core\\WorkspaceService;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\JsonResponse;
use App\\Models\\Workspace;
use Illuminate\\Support\\Facades\\Gate;

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
"""
with open('app/Http/Controllers/Core/WorkspaceController.php', 'w') as f: f.write(controller_code)

print("Generated workspace backend logic.")
