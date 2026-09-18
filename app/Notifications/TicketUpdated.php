<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;
use App\Modules\Support\Models\Ticket;

class TicketUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    public $ticket;

    public function __construct(Ticket $ticket)
    {
        $this->ticket = $ticket;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'ticket_updated',
            'ticket_id' => $this->ticket->id,
            'title' => 'Ticket Updated: ' . $this->ticket->subject,
            'message' => 'There has been an update to ticket #' . $this->ticket->id,
            'url' => '/support/tickets/' . $this->ticket->id,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }
}
