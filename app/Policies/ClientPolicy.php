<?php

namespace App\Policies;

use App\Modules\CRM\Models\Client;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ClientPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('crm.view') || $user->hasPermissionTo('client.manage');
    }

    public function view(User $user, Client $client): bool
    {
        return $user->hasPermissionTo('crm.view') || $user->hasPermissionTo('client.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('client.manage');
    }

    public function update(User $user, Client $client): bool
    {
        return $user->hasPermissionTo('client.manage');
    }

    public function delete(User $user, Client $client): bool
    {
        return $user->hasPermissionTo('client.manage');
    }

    public function restore(User $user, Client $client): bool
    {
        return $user->hasPermissionTo('client.manage');
    }

    public function forceDelete(User $user, Client $client): bool
    {
        return $user->hasPermissionTo('client.manage');
    }
}
