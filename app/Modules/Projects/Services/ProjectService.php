<?php

namespace App\Modules\Projects\Services;

use App\Modules\Projects\Models\Project;
use Illuminate\Database\Eloquent\Collection;

class ProjectService
{
    public function getAll(): Collection
    {
        return Project::trashMode()->orderBy("id", "desc")->get(); // Add default relations if needed
    }

    public function create(array $data): Project
    {
        $users = $data['users'] ?? [];
        unset($data['users']);
        $project = Project::create($data);
        if (!empty($users)) {
            $project->users()->sync($users);
        }

        \App\Services\UserActivityLogger::log(
            auth()->id() ?? 1,
            "Created Project: {$project->name}",
            "projects",
            "Project #{$project->id}",
            "New project initialized in system.",
            "Projects",
            "create"
        );

        if (!empty($users)) {
            \App\Services\SystemNotificationService::notify(
                $users,
                "Assigned to New Project: {$project->name}",
                "You have been assigned to project '{$project->name}'.",
                "projects",
                "/projects/{$project->id}"
            );
        }

        return $project->load(['client', 'creator', 'users']);
    }

    public function update(Project $project, array $data): Project
    {
        $users = $data['users'] ?? null;
        unset($data['users']);
        $project->update($data);
        if ($users !== null) {
            $project->users()->sync($users);
        }

        \App\Services\UserActivityLogger::log(
            auth()->id() ?? 1,
            "Updated Project: {$project->name}",
            "projects",
            "Project #{$project->id}",
            "Project details or team assignment updated.",
            "Projects",
            "edit"
        );

        return $project->load(['client', 'creator', 'users']);
    }

    public function delete(Project $project): ?bool
    {
        \App\Services\UserActivityLogger::log(
            auth()->id() ?? 1,
            "Deleted Project: {$project->name}",
            "projects",
            "Project #{$project->id}",
            "Project moved to trash.",
            "Projects",
            "delete"
        );

        return $project->delete();
    }
}
