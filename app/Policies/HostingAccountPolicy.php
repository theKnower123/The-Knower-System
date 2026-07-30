<?php

namespace App\Policies;

use App\Modules\Hosting\Models\HostingAccount;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class HostingAccountPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('client_portal.view') || $user->hasPermissionTo('hosting.view') || $user->hasPermissionTo('hosting.manage');
    }

    public function view(User $user, HostingAccount $hostingAccount): bool
    {
        if ($user->hasPermissionTo('client_portal.view')) {
            return $user->client()->value('id') && $user->client()->value('id') === $hostingAccount->client_id;
        }
        return $user->hasPermissionTo('hosting.view') || $user->hasPermissionTo('hosting.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('hosting.manage');
    }

    public function update(User $user, HostingAccount $hostingAccount): bool
    {
        return $user->hasPermissionTo('hosting.manage');
    }

    public function delete(User $user, HostingAccount $hostingAccount): bool
    {
        return $user->hasPermissionTo('hosting.manage');
    }

    public function restore(User $user, HostingAccount $hostingAccount): bool
    {
        return $user->hasPermissionTo('hosting.manage');
    }

    public function forceDelete(User $user, HostingAccount $hostingAccount): bool
    {
        return $user->hasPermissionTo('hosting.manage');
    }
}
