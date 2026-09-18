<?php

namespace App\Policies;

use App\Modules\CRM\Models\Contract;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ContractPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('client_portal.view') || $user->hasPermissionTo('crm.view') || $user->hasPermissionTo('contract.manage');
    }

    public function view(User $user, Contract $contract): bool
    {
        if ($user->hasPermissionTo('client_portal.view')) {
            return $user->client()->value('id') && $user->client()->value('id') === $contract->client_id;
        }
        return $user->hasPermissionTo('crm.view') || $user->hasPermissionTo('contract.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('contract.manage');
    }

    public function update(User $user, Contract $contract): bool
    {
        return $user->hasPermissionTo('contract.manage');
    }

    public function delete(User $user, Contract $contract): bool
    {
        return $user->hasPermissionTo('contract.manage');
    }

    public function restore(User $user, Contract $contract): bool
    {
        return $user->hasPermissionTo('contract.manage');
    }

    public function forceDelete(User $user, Contract $contract): bool
    {
        return $user->hasPermissionTo('contract.manage');
    }
}
