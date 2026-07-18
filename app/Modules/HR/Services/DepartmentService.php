<?php

namespace App\Modules\HR\Services;

use App\Modules\HR\Models\Department;
use Illuminate\Database\Eloquent\Collection;

class DepartmentService
{
    public function getAll(): Collection
    {
        return Department::latest()->get();
    }

    public function create(array $data): Department
    {
        return Department::create($data);
    }

    public function update(Department $department, array $data): Department
    {
        $department->update($data);
        return $department;
    }

    public function delete(Department $department): ?bool
    {
        return $department->delete();
    }
}
