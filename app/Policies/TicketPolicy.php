<?php

namespace App\Policies;

use App\Modules\Support\Models\Ticket;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TicketPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('client_portal.view') || $user->hasPermissionTo('support.view') || $user->hasPermissionTo('ticket.manage');
    }

    public function view(User $user, Ticket $ticket): bool
    {
        if ($user->hasPermissionTo('client_portal.view')) {
            return $user->client()->value('id') && $user->client()->value('id') === $ticket->client_id;
        }
        return $user->hasPermissionTo('support.view') || $user->hasPermissionTo('ticket.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('ticket.manage');
    }

    public function update(User $user, Ticket $ticket): bool
    {
        return $user->hasPermissionTo('ticket.manage');
    }

    public function delete(User $user, Ticket $ticket): bool
    {
        return $user->hasPermissionTo('ticket.manage');
    }

    public function restore(User $user, Ticket $ticket): bool
    {
        return $user->hasPermissionTo('ticket.manage');
    }

    public function forceDelete(User $user, Ticket $ticket): bool
    {
        return $user->hasPermissionTo('ticket.manage');
    }
}
