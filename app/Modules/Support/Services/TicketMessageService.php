<?php

namespace App\Modules\Support\Services;

use App\Modules\Support\Models\TicketMessage;
use Illuminate\Database\Eloquent\Collection;

class TicketMessageService
{
    public function getAll(): Collection
    {
        return TicketMessage::trashMode()->orderBy("id", "desc")->get(); // Add default relations if needed
    }

    public function create(array $data): TicketMessage
    {
        $message = TicketMessage::create($data);
        $ticket = $message->ticket;

        if ($ticket) {
            // Notify the assigned agent if sender is client, or notify client if sender is agent
            if ($message->sender_id !== $ticket->client_id) {
                // Sender is an agent, notify the client
                $clientUser = \App\Modules\Auth\Models\User::find($ticket->client_id);
                if ($clientUser) {
                    $clientUser->notify(new \App\Notifications\TicketUpdated($ticket));
                }
            } else {
                // Sender is the client, notify the assigned agent (if any) or admins
                if ($ticket->assigned_to) {
                    $agent = \App\Modules\Auth\Models\User::find($ticket->assigned_to);
                    if ($agent) {
                        $agent->notify(new \App\Notifications\TicketUpdated($ticket));
                    }
                }
            }
        }

        return $message;
    }

    public function update(TicketMessage $ticketmessage, array $data): TicketMessage
    {
        $ticketmessage->update($data);
        return $ticketmessage;
    }

    public function delete(TicketMessage $ticketmessage): ?bool
    {
        return $ticketmessage->delete();
    }
}
