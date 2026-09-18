<?php

namespace App\Modules\Projects\Services;

use App\Modules\Projects\Models\Milestone;
use Illuminate\Database\Eloquent\Collection;

class MilestoneService
{
    public function getAll(): Collection
    {
        return Milestone::trashMode()->orderBy("id", "desc")->get(); // Add default relations if needed
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
