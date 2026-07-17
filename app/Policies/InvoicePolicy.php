<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class InvoicePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_invoices');
    }

    public function view(User $user, Invoice $invoice): bool
    {
        return $user->hasPermissionTo('view_invoices');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_invoices');
    }

    public function update(User $user, Invoice $invoice): bool
    {
        return $user->hasPermissionTo('edit_invoices');
    }

    public function delete(User $user, Invoice $invoice): bool
    {
        return $user->hasPermissionTo('delete_invoices');
    }
}
