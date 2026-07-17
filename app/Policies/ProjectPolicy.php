<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProjectPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_projects');
    }

    public function view(User $user, Project $project): bool
    {
        return $user->hasPermissionTo('view_projects');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_projects');
    }

    public function update(User $user, Project $project): bool
    {
        return $user->hasPermissionTo('edit_projects');
    }

    public function delete(User $user, Project $project): bool
    {
        return $user->hasPermissionTo('delete_projects');
    }
}
