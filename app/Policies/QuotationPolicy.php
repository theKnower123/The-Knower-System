<?php

namespace App\Policies;

use App\Models\Quotation;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class QuotationPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_quotations');
    }

    public function view(User $user, Quotation $quotation): bool
    {
        return $user->hasPermissionTo('view_quotations');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_quotations');
    }

    public function update(User $user, Quotation $quotation): bool
    {
        return $user->hasPermissionTo('edit_quotations');
    }

    public function delete(User $user, Quotation $quotation): bool
    {
        return $user->hasPermissionTo('delete_quotations');
    }
}
