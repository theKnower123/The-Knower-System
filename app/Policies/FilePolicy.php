<?php

namespace App\Policies;

use App\Modules\Projects\Models\File;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FilePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('project.view') || $user->hasPermissionTo('file.manage');
    }

    public function view(User $user, File $file): bool
    {
        return $user->hasPermissionTo('project.view') || $user->hasPermissionTo('file.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('file.manage');
    }

    public function update(User $user, File $file): bool
    {
        return $user->hasPermissionTo('file.manage');
    }

    public function delete(User $user, File $file): bool
    {
        return $user->hasPermissionTo('file.manage');
    }

    public function restore(User $user, File $file): bool
    {
        return $user->hasPermissionTo('file.manage');
    }

    public function forceDelete(User $user, File $file): bool
    {
        return $user->hasPermissionTo('file.manage');
    }
}
