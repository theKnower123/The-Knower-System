<?php

namespace App\Http\Requests\HR;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('employee'));
    }

    public function rules(): array
    {
        return [

            'user_id' => 'sometimes|required|exists:users,id|unique:employees,user_id,' . $employee->id,
            'department' => 'nullable|string|max:100',
            'position' => 'nullable|string|max:100',
            'salary' => 'nullable|numeric|min:0',
            'hire_date' => 'nullable|date',
            'status' => 'sometimes|required|in:active,inactive,on_leave,terminated',
        
        ];
    }
}
