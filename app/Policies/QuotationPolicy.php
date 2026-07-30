<?php

namespace App\Policies;

use App\Modules\CRM\Models\Quotation;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class QuotationPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('client_portal.view') || $user->hasPermissionTo('crm.view') || $user->hasPermissionTo('quotation.manage');
    }

    public function view(User $user, Quotation $quotation): bool
    {
        if ($user->hasPermissionTo('client_portal.view')) {
            return $user->client()->value('id') && $user->client()->value('id') === $quotation->client_id;
        }
        return $user->hasPermissionTo('crm.view') || $user->hasPermissionTo('quotation.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('quotation.manage');
    }

    public function update(User $user, Quotation $quotation): bool
    {
        return $user->hasPermissionTo('quotation.manage');
    }

    public function delete(User $user, Quotation $quotation): bool
    {
        return $user->hasPermissionTo('quotation.manage');
    }

    public function restore(User $user, Quotation $quotation): bool
    {
        return $user->hasPermissionTo('quotation.manage');
    }

    public function forceDelete(User $user, Quotation $quotation): bool
    {
        return $user->hasPermissionTo('quotation.manage');
    }
}
