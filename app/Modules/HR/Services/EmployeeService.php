<?php

namespace App\Modules\HR\Services;

use App\Modules\HR\Models\Employee;
use Illuminate\Database\Eloquent\Collection;

class EmployeeService
{
    public function getAll(): Collection
    {
        return Employee::latest()->get(); // Add default relations if needed
    }

    public function create(array $data): Employee
    {
        // If a new employee is being created from the UI with name/email, create a User first
        if (isset($data['name']) && isset($data['email'])) {
            $user = \App\Models\User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => \Illuminate\Support\Facades\Hash::make($data['password']),
                    'role' => $data['role'],
                    'phone' => $data['phone'] ?? null,
                    'avatar' => $data['id_photo'] ?? null,
                    'permissions' => []
                ]
            );
            $data['user_id'] = $user->id;
        }

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
