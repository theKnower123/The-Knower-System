<?php

namespace App\Policies;

use App\Models\TicketMessage;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TicketMessagePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_ticketmessages');
    }

    public function view(User $user, TicketMessage $ticketmessage): bool
    {
        return $user->hasPermissionTo('view_ticketmessages');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_ticketmessages');
    }

    public function update(User $user, TicketMessage $ticketmessage): bool
    {
        return $user->hasPermissionTo('edit_ticketmessages');
    }

    public function delete(User $user, TicketMessage $ticketmessage): bool
    {
        return $user->hasPermissionTo('delete_ticketmessages');
    }
}
