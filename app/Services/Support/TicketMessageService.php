<?php

namespace App\Services\Support;

use App\Models\TicketMessage;
use Illuminate\Database\Eloquent\Collection;

class TicketMessageService
{
    public function getAll(): Collection
    {
        return TicketMessage::latest()->get(); // Add default relations if needed
    }

    public function create(array $data): TicketMessage
    {
        return TicketMessage::create($data);
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
