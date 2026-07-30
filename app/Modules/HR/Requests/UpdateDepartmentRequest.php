<?php

namespace App\Modules\HR\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('department'));
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
