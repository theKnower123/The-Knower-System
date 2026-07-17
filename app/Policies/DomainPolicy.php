<?php

namespace App\Policies;

use App\Models\Domain;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DomainPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_domains');
    }

    public function view(User $user, Domain $domain): bool
    {
        return $user->hasPermissionTo('view_domains');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_domains');
    }

    public function update(User $user, Domain $domain): bool
    {
        return $user->hasPermissionTo('edit_domains');
    }

    public function delete(User $user, Domain $domain): bool
    {
        return $user->hasPermissionTo('delete_domains');
    }
}
