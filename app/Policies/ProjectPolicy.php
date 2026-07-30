<?php

namespace App\Policies;

use App\Modules\Projects\Models\Project;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProjectPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('client_portal.view') || $user->hasPermissionTo('project.view') || $user->hasPermissionTo('project.manage');
    }

    public function view(User $user, Project $project): bool
    {
        if ($user->hasPermissionTo('client_portal.view')) {
            return $user->client()->value('id') && $user->client()->value('id') === $project->client_id;
        }
        return $user->hasPermissionTo('project.view') || $user->hasPermissionTo('project.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('project.manage');
    }

    public function update(User $user, Project $project): bool
    {
        return $user->hasPermissionTo('project.manage');
    }

    public function delete(User $user, Project $project): bool
    {
        return $user->hasPermissionTo('project.manage');
    }

    public function restore(User $user, Project $project): bool
    {
        return $user->hasPermissionTo('project.manage');
    }

    public function forceDelete(User $user, Project $project): bool
    {
        return $user->hasPermissionTo('project.manage');
    }
}
