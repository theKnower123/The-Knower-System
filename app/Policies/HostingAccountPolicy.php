<?php

namespace App\Policies;

use App\Models\HostingAccount;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class HostingAccountPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_hostingaccounts');
    }

    public function view(User $user, HostingAccount $hostingaccount): bool
    {
        return $user->hasPermissionTo('view_hostingaccounts');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_hostingaccounts');
    }

    public function update(User $user, HostingAccount $hostingaccount): bool
    {
        return $user->hasPermissionTo('edit_hostingaccounts');
    }

    public function delete(User $user, HostingAccount $hostingaccount): bool
    {
        return $user->hasPermissionTo('delete_hostingaccounts');
    }
}
