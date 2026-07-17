<?php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PaymentPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_payments');
    }

    public function view(User $user, Payment $payment): bool
    {
        return $user->hasPermissionTo('view_payments');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_payments');
    }

    public function update(User $user, Payment $payment): bool
    {
        return $user->hasPermissionTo('edit_payments');
    }

    public function delete(User $user, Payment $payment): bool
    {
        return $user->hasPermissionTo('delete_payments');
    }
}
