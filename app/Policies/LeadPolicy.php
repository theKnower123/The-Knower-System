<?php

namespace App\Policies;

use App\Modules\CRM\Models\Lead;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class LeadPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('crm.view') || $user->hasPermissionTo('lead.manage');
    }

    public function view(User $user, Lead $lead): bool
    {
        return $user->hasPermissionTo('crm.view') || $user->hasPermissionTo('lead.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('lead.manage');
    }

    public function update(User $user, Lead $lead): bool
    {
        return $user->hasPermissionTo('lead.manage');
    }

    public function delete(User $user, Lead $lead): bool
    {
        return $user->hasPermissionTo('lead.manage');
    }

    public function restore(User $user, Lead $lead): bool
    {
        return $user->hasPermissionTo('lead.manage');
    }

    public function forceDelete(User $user, Lead $lead): bool
    {
        return $user->hasPermissionTo('lead.manage');
    }
}
