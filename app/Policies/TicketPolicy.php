<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TicketPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_tickets');
    }

    public function view(User $user, Ticket $ticket): bool
    {
        return $user->hasPermissionTo('view_tickets');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_tickets');
    }

    public function update(User $user, Ticket $ticket): bool
    {
        return $user->hasPermissionTo('edit_tickets');
    }

    public function delete(User $user, Ticket $ticket): bool
    {
        return $user->hasPermissionTo('delete_tickets');
    }
}
