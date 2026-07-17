<?php

namespace App\Services\HR;

use App\Models\Attendance;
use Illuminate\Database\Eloquent\Collection;

class AttendanceService
{
    public function getAll(): Collection
    {
        return Attendance::latest()->get(); // Add default relations if needed
    }

    public function create(array $data): Attendance
    {
        return Attendance::create($data);
    }

    public function update(Attendance $attendance, array $data): Attendance
    {
        $attendance->update($data);
        return $attendance;
    }

    public function delete(Attendance $attendance): ?bool
    {
        return $attendance->delete();
    }
}
