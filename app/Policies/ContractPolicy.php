<?php

namespace App\Policies;

use App\Models\Contract;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ContractPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_contracts');
    }

    public function view(User $user, Contract $contract): bool
    {
        return $user->hasPermissionTo('view_contracts');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_contracts');
    }

    public function update(User $user, Contract $contract): bool
    {
        return $user->hasPermissionTo('edit_contracts');
    }

    public function delete(User $user, Contract $contract): bool
    {
        return $user->hasPermissionTo('delete_contracts');
    }
}
