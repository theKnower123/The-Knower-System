<?php

namespace App\Modules\Projects\Services;

use App\Modules\Projects\Models\Bug;
use Illuminate\Database\Eloquent\Collection;

class BugService
{
    public function getAll(): Collection
    {
        return Bug::orderBy("id", "desc")->get(); // Add default relations if needed
    }

    public function create(array $data): Bug
    {
        if (empty($data['description'])) {
            $data['description'] = 'No description provided.';
        }
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
