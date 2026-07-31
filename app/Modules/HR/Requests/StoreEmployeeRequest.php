<?php

namespace App\Modules\HR\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Modules\HR\Models\Employee::class);
    }

    public function rules(): array
    {
        return [
            'user_id' => 'nullable|exists:users,id|unique:employees,user_id',
            'name' => 'required_without:user_id|nullable|string|max:255',
            'email' => 'required_without:user_id|nullable|email|max:255|unique:users,email',
            'password' => 'nullable|string|min:6',
            'role' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'id_number' => 'nullable|string|max:255',
            'id_photo' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'salary' => 'nullable|numeric|min:0',
            'status' => 'required|in:active,inactive,on_leave,terminated',
            'hire_date' => 'nullable|date',
        ];
    }
}
