<?php

namespace App\Policies;

use App\Modules\Finance\Models\Payment;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PaymentPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('client_portal.view') || $user->hasPermissionTo('finance.view') || $user->hasPermissionTo('payment.manage');
    }

    public function view(User $user, Payment $payment): bool
    {
        if ($user->hasPermissionTo('client_portal.view')) {
            return $user->client()->value('id') && $user->client()->value('id') === $payment->client_id;
        }
        return $user->hasPermissionTo('finance.view') || $user->hasPermissionTo('payment.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('payment.manage');
    }

    public function update(User $user, Payment $payment): bool
    {
        return $user->hasPermissionTo('payment.manage');
    }

    public function delete(User $user, Payment $payment): bool
    {
        return $user->hasPermissionTo('payment.manage');
    }

    public function restore(User $user, Payment $payment): bool
    {
        return $user->hasPermissionTo('payment.manage');
    }

    public function forceDelete(User $user, Payment $payment): bool
    {
        return $user->hasPermissionTo('payment.manage');
    }
}
