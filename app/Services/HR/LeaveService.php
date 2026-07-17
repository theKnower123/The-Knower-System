<?php

namespace App\Services\HR;

use App\Models\Leave;
use Illuminate\Database\Eloquent\Collection;

class LeaveService
{
    public function getAll(): Collection
    {
        return Leave::latest()->get(); // Add default relations if needed
    }

    public function create(array $data): Leave
    {
        return Leave::create($data);
    }

    public function update(Leave $leave, array $data): Leave
    {
        $leave->update($data);
        return $leave;
    }

    public function delete(Leave $leave): ?bool
    {
        return $leave->delete();
    }
}
