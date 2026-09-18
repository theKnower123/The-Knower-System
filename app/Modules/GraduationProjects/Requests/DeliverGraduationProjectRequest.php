<?php

namespace App\Modules\GraduationProjects\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DeliverGraduationProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('graduation_project')) ?? false;
    }

    public function rules(): array
    {
        return [
            'final_amount' => ['nullable', 'numeric', 'min:0'],
            'hardware_handed_over' => ['nullable', 'boolean'],
            'files' => ['nullable', 'array'],
            'files.*' => ['file', 'max:51200'],
        ];
    }
}
