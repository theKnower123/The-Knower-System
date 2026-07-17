<?php

namespace App\Services\Projects;

use App\Models\Milestone;
use Illuminate\Database\Eloquent\Collection;

class MilestoneService
{
    public function getAll(): Collection
    {
        return Milestone::latest()->get(); // Add default relations if needed
    }

    public function create(array $data): Milestone
    {
        return Milestone::create($data);
    }

    public function update(Milestone $milestone, array $data): Milestone
    {
        $milestone->update($data);
        return $milestone;
    }

    public function delete(Milestone $milestone): ?bool
    {
        return $milestone->delete();
    }
}
