<?php

namespace App\Modules\Hosting\Services;

use App\Modules\Hosting\Models\Server;
use Illuminate\Database\Eloquent\Collection;

class ServerService
{
    public function getAll(): Collection
    {
        return Server::trashMode()->orderBy("id", "desc")->get(); // Add default relations if needed
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
