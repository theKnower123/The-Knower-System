<?php
namespace App\Services\Core;

use App\Modules\Settings\Models\Workspace;
use Illuminate\Database\Eloquent\Collection;

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
