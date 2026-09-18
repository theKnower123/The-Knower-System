<?php

namespace App\Policies;

use App\Modules\Auth\Models\User;
use App\Modules\GraduationProjects\Models\GraduationProject;
use Illuminate\Auth\Access\HandlesAuthorization;

class GraduationProjectPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('graduation_projects.view')
            || $user->hasPermissionTo('graduation_projects.manage');
    }

    public function view(User $user, GraduationProject $graduationProject): bool
    {
        return $user->hasPermissionTo('graduation_projects.view')
            || $user->hasPermissionTo('graduation_projects.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('graduation_projects.manage');
    }

    public function update(User $user, GraduationProject $graduationProject): bool
    {
        return $user->hasPermissionTo('graduation_projects.manage');
    }

    public function delete(User $user, GraduationProject $graduationProject): bool
    {
        return $user->hasPermissionTo('graduation_projects.manage');
    }

    public function restore(User $user, GraduationProject $graduationProject): bool
    {
        return $user->hasPermissionTo('graduation_projects.manage');
    }

    public function forceDelete(User $user, GraduationProject $graduationProject): bool
    {
        return $user->hasPermissionTo('graduation_projects.manage');
    }
}
