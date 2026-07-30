<?php

namespace App\Policies;

use App\Modules\Support\Models\TicketMessage;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TicketMessagePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('support.view') || $user->hasPermissionTo('ticket.manage');
    }

    public function view(User $user, TicketMessage $ticketMessage): bool
    {
        return $user->hasPermissionTo('support.view') || $user->hasPermissionTo('ticket.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('ticket.manage');
    }

    public function update(User $user, TicketMessage $ticketMessage): bool
    {
        return $user->hasPermissionTo('ticket.manage');
    }

    public function delete(User $user, TicketMessage $ticketMessage): bool
    {
        return $user->hasPermissionTo('ticket.manage');
    }

    public function restore(User $user, TicketMessage $ticketMessage): bool
    {
        return $user->hasPermissionTo('ticket.manage');
    }

    public function forceDelete(User $user, TicketMessage $ticketMessage): bool
    {
        return $user->hasPermissionTo('ticket.manage');
    }
}
