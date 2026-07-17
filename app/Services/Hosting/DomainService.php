<?php

namespace App\Services\Hosting;

use App\Models\Domain;
use Illuminate\Database\Eloquent\Collection;

class DomainService
{
    public function getAll(): Collection
    {
        return Domain::latest()->get(); // Add default relations if needed
    }

    public function create(array $data): Domain
    {
        return Domain::create($data);
    }

    public function update(Domain $domain, array $data): Domain
    {
        $domain->update($data);
        return $domain;
    }

    public function delete(Domain $domain): ?bool
    {
        return $domain->delete();
    }
}
