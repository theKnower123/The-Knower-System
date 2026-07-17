<?php

namespace App\Services\Projects;

use App\Models\Bug;
use Illuminate\Database\Eloquent\Collection;

class BugService
{
    public function getAll(): Collection
    {
        return Bug::latest()->get(); // Add default relations if needed
    }

    public function create(array $data): Bug
    {
        return Bug::create($data);
    }

    public function update(Bug $bug, array $data): Bug
    {
        $bug->update($data);
        return $bug;
    }

    public function delete(Bug $bug): ?bool
    {
        return $bug->delete();
    }
}
