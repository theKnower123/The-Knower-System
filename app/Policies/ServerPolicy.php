<?php

namespace App\Policies;

use App\Modules\Hosting\Models\Server;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ServerPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('client_portal.view') || $user->hasPermissionTo('hosting.view') || $user->hasPermissionTo('server.manage');
    }

    public function view(User $user, Server $server): bool
    {
        if ($user->hasPermissionTo('client_portal.view')) {
            return $user->client()->value('id') && $user->client()->value('id') === $server->client_id;
        }
        return $user->hasPermissionTo('hosting.view') || $user->hasPermissionTo('server.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('server.manage');
    }

    public function update(User $user, Server $server): bool
    {
        return $user->hasPermissionTo('server.manage');
    }

    public function delete(User $user, Server $server): bool
    {
        return $user->hasPermissionTo('server.manage');
    }

    public function restore(User $user, Server $server): bool
    {
        return $user->hasPermissionTo('server.manage');
    }

    public function forceDelete(User $user, Server $server): bool
    {
        return $user->hasPermissionTo('server.manage');
    }
}
