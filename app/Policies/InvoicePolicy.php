<?php

namespace App\Policies;

use App\Modules\Finance\Models\Invoice;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class InvoicePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('client_portal.view') || $user->hasPermissionTo('finance.view') || $user->hasPermissionTo('invoice.manage');
    }

    public function view(User $user, Invoice $invoice): bool
    {
        if ($user->hasPermissionTo('client_portal.view')) {
            return $user->client()->value('id') && $user->client()->value('id') === $invoice->client_id;
        }
        return $user->hasPermissionTo('finance.view') || $user->hasPermissionTo('invoice.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('invoice.manage');
    }

    public function update(User $user, Invoice $invoice): bool
    {
        return $user->hasPermissionTo('invoice.manage');
    }

    public function delete(User $user, Invoice $invoice): bool
    {
        return $user->hasPermissionTo('invoice.manage');
    }

    public function restore(User $user, Invoice $invoice): bool
    {
        return $user->hasPermissionTo('invoice.manage');
    }

    public function forceDelete(User $user, Invoice $invoice): bool
    {
        return $user->hasPermissionTo('invoice.manage');
    }
}
