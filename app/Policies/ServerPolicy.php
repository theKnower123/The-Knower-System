<?php

namespace App\Policies;

use App\Models\Server;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ServerPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_servers');
    }

    public function view(User $user, Server $server): bool
    {
        return $user->hasPermissionTo('view_servers');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_servers');
    }

    public function update(User $user, Server $server): bool
    {
        return $user->hasPermissionTo('edit_servers');
    }

    public function delete(User $user, Server $server): bool
    {
        return $user->hasPermissionTo('delete_servers');
    }
}
