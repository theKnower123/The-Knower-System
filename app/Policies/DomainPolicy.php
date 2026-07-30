<?php

namespace App\Policies;

use App\Modules\Hosting\Models\Domain;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DomainPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('client_portal.view') || $user->hasPermissionTo('hosting.view') || $user->hasPermissionTo('domain.manage');
    }

    public function view(User $user, Domain $domain): bool
    {
        if ($user->hasPermissionTo('client_portal.view')) {
            return $user->client()->value('id') && $user->client()->value('id') === $domain->client_id;
        }
        return $user->hasPermissionTo('hosting.view') || $user->hasPermissionTo('domain.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('domain.manage');
    }

    public function update(User $user, Domain $domain): bool
    {
        return $user->hasPermissionTo('domain.manage');
    }

    public function delete(User $user, Domain $domain): bool
    {
        return $user->hasPermissionTo('domain.manage');
    }

    public function restore(User $user, Domain $domain): bool
    {
        return $user->hasPermissionTo('domain.manage');
    }

    public function forceDelete(User $user, Domain $domain): bool
    {
        return $user->hasPermissionTo('domain.manage');
    }
}
