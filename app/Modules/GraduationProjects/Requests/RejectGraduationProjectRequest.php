<?php

namespace App\Modules\GraduationProjects\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RejectGraduationProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('graduation_project')) ?? false;
    }

    public function rules(): array
    {
        return [
            'rejection_reason' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
