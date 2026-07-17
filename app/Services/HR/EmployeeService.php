<?php

namespace App\Services\HR;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Collection;

class EmployeeService
{
    public function getAll(): Collection
    {
        return Employee::latest()->get(); // Add default relations if needed
    }

    public function create(array $data): Employee
    {
        return Employee::create($data);
    }

    public function update(Employee $employee, array $data): Employee
    {
        $employee->update($data);
        return $employee;
    }

    public function delete(Employee $employee): ?bool
    {
        return $employee->delete();
    }
}
