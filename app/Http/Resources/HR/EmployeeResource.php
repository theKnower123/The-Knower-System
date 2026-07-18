<?php

namespace App\Http\Resources\HR;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'userId' => (string) $this->user_id,
            'name' => $this->user ? $this->user->name : null,
            'email' => $this->user ? $this->user->email : null,
            'phone' => $this->user ? $this->user->phone : null,
            'role' => $this->user ? $this->user->role : null,
            'address' => $this->address,
            'idNumber' => $this->id_number,
            'idPhoto' => $this->id_photo,
            'department' => $this->department,
            'position' => $this->position,
            'salary' => (float) $this->salary,
            'status' => $this->status,
            'hireDate' => $this->hire_date ? $this->hire_date->toISOString() : null,
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
        ];
    }
}
