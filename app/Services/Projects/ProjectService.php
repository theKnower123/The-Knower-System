<?php

namespace App\Services\Projects;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

class ProjectService
{
    public function getAll(): Collection
    {
        return Project::latest()->get(); // Add default relations if needed
    }

    public function create(array $data): Project
    {
        return Project::create($data);
    }

    public function update(Project $project, array $data): Project
    {
        $project->update($data);
        return $project;
    }

    public function delete(Project $project): ?bool
    {
        return $project->delete();
    }
}
