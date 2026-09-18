<?php

namespace App\Modules\HR\Services;

use App\Modules\HR\Models\Employee;
use Illuminate\Database\Eloquent\Collection;

class EmployeeService
{
    public function getAll(): Collection
    {
        return Employee::trashMode()->orderBy("id", "desc")->get(); // Add default relations if needed
    }

    public function create(array $data): Employee
    {
        // If a new employee is being created from the UI with name/email, create a User first if not existing
        if (empty($data['user_id']) && !empty($data['email'])) {
            $name = $data['name'] ?? explode('@', $data['email'])[0];
            $password = !empty($data['password']) ? $data['password'] : 'password';
            $role = $data['role'] ?? 'developer';

            $user = \App\Modules\Auth\Models\User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $name,
                    'password' => \Illuminate\Support\Facades\Hash::make($password),
                    'role' => $role,
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

        if ($employee->user) {
            $userUpdates = array_filter([
                'name' => $data['name'] ?? null,
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
            ], fn($v) => !is_null($v));

            if (!empty($userUpdates)) {
                $employee->user->update($userUpdates);
            }
        }

        return $employee;
    }

    public function delete(Employee $employee): ?bool
    {
        return $employee->delete();
    }
}
