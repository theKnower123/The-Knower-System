<?php

namespace App\Modules\HR\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        $dept = $this->route('department');
        if (is_numeric($dept) || is_string($dept)) {
            $dept = \App\Modules\HR\Models\Department::find($dept);
        }
        if ($dept) {
            return $this->user()->can('update', $dept);
        }
        return $this->user()->hasPermissionTo('hr.manage') || $this->user()->hasPermissionTo('hr.view');
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'head' => 'nullable|string|max:255',
            'employee_count' => 'nullable|integer|min:0',
        ];
    }
}
