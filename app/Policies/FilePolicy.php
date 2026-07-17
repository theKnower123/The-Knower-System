<?php

namespace App\Policies;

use App\Models\File;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FilePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_files');
    }

    public function view(User $user, File $file): bool
    {
        return $user->hasPermissionTo('view_files');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_files');
    }

    public function update(User $user, File $file): bool
    {
        return $user->hasPermissionTo('edit_files');
    }

    public function delete(User $user, File $file): bool
    {
        return $user->hasPermissionTo('delete_files');
    }
}
