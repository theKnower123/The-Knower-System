<?php

namespace App\Modules\Support\Services;

use App\Modules\Support\Models\Ticket;
use Illuminate\Database\Eloquent\Collection;

class TicketService
{
    public function getAll(): Collection
    {
        return Ticket::trashMode()->orderBy("id", "desc")->get(); // Add default relations if needed
    }

    public function create(array $data): Ticket
    {
        $ticket = Ticket::create($data);
        if (!empty($data['messages']) && is_array($data['messages'])) {
            foreach ($data['messages'] as $msg) {
                $ticket->messages()->create([
                    'sender' => $msg['sender'] ?? 'Client',
                    'message' => $msg['message'] ?? '',
                ]);
            }
        }
        return $ticket;
    }

    public function update(Ticket $ticket, array $data): Ticket
    {
        $ticket->update($data);
        return $ticket;
    }

    public function delete(Ticket $ticket): ?bool
    {
        return $ticket->delete();
    }
}
