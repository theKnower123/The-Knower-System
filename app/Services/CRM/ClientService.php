<?php

namespace App\Services\CRM;

use App\Models\Client;
use Illuminate\Database\Eloquent\Collection;

class ClientService
{
    public function getAll(): Collection
    {
        return Client::latest()->get(); // Add default relations if needed
    }

    public function create(array $data): Client
    {
        return Client::create($data);
    }

    public function update(Client $client, array $data): Client
    {
        $client->update($data);
        return $client;
    }

    public function delete(Client $client): ?bool
    {
        return $client->delete();
    }
}
