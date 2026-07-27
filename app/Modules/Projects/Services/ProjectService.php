<?php

namespace App\Modules\Projects\Services;

use App\Modules\Projects\Models\Project;
use Illuminate\Database\Eloquent\Collection;

class ProjectService
{
    public function getAll(): Collection
    {
        return Project::orderBy("id", "desc")->get(); // Add default relations if needed
    }

    public function create(array $data): Project
    {
        $users = $data['users'] ?? [];
        unset($data['users']);
        $project = Project::create($data);
        if (!empty($users)) {
            $project->users()->sync($users);
        }
        return $project;
    }

    public function update(Project $project, array $data): Project
    {
        $users = $data['users'] ?? null;
        unset($data['users']);
        $project->update($data);
        if ($users !== null) {
            $project->users()->sync($users);
        }
        return $project;
    }

    public function delete(Project $project): ?bool
    {
        return $project->delete();
    }
}
