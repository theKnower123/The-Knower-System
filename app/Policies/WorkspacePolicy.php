<?php

namespace App\Policies;

use App\Modules\Settings\Models\Workspace;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class WorkspacePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('settings.view') || $user->hasPermissionTo('settings.manage');
    }

    public function view(User $user, Workspace $workspace): bool
    {
        return $user->hasPermissionTo('settings.view') || $user->hasPermissionTo('settings.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('settings.manage');
    }

    public function update(User $user, Workspace $workspace): bool
    {
        return $user->hasPermissionTo('settings.manage');
    }

    public function delete(User $user, Workspace $workspace): bool
    {
        return $user->hasPermissionTo('settings.manage');
    }

    public function restore(User $user, Workspace $workspace): bool
    {
        return $user->hasPermissionTo('settings.manage');
    }

    public function forceDelete(User $user, Workspace $workspace): bool
    {
        return $user->hasPermissionTo('settings.manage');
    }
}
