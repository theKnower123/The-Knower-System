<?php

namespace App\Modules\HR\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        $employee = $this->route('employee');
        if (is_numeric($employee) || is_string($employee)) {
            $employee = \App\Modules\HR\Models\Employee::find($employee);
        }
        if ($employee) {
            return $this->user()->can('update', $employee);
        }
        return $this->user()->hasPermissionTo('hr.manage') || $this->user()->hasPermissionTo('hr.view');
    }

    public function rules(): array
    {
        $employee = $this->route('employee');
        $employeeId = is_object($employee) ? $employee->id : $employee;

        return [
            'user_id' => 'nullable|exists:users,id|unique:employees,user_id,' . $employeeId,
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'id_number' => 'nullable|string|max:255',
            'id_photo' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:100',
            'position' => 'nullable|string|max:100',
            'salary' => 'nullable|numeric|min:0',
            'hire_date' => 'nullable|date',
            'status' => 'sometimes|required|in:active,inactive,on_leave,terminated',
        ];
    }
}
