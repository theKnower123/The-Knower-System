<?php

namespace App\Services\Hosting;

use App\Models\Server;
use Illuminate\Database\Eloquent\Collection;

class ServerService
{
    public function getAll(): Collection
    {
        return Server::latest()->get(); // Add default relations if needed
    }

    public function create(array $data): Server
    {
        return Server::create($data);
    }

    public function update(Server $server, array $data): Server
    {
        $server->update($data);
        return $server;
    }

    public function delete(Server $server): ?bool
    {
        return $server->delete();
    }
}
