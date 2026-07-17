<?php
namespace App\Policies;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Auth\Access\HandlesAuthorization;

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
