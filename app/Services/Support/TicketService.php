<?php

namespace App\Services\Support;

use App\Models\Ticket;
use Illuminate\Database\Eloquent\Collection;

class TicketService
{
    public function getAll(): Collection
    {
        return Ticket::latest()->get(); // Add default relations if needed
    }

    public function create(array $data): Ticket
    {
        return Ticket::create($data);
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
