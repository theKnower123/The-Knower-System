<?php

namespace App\Policies;

use App\Models\Client;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ClientPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_clients');
    }

    public function view(User $user, Client $client): bool
    {
        return $user->hasPermissionTo('view_clients');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_clients');
    }

    public function update(User $user, Client $client): bool
    {
        return $user->hasPermissionTo('edit_clients');
    }

    public function delete(User $user, Client $client): bool
    {
        return $user->hasPermissionTo('delete_clients');
    }
}
