<?php

namespace App\Modules\GraduationProjects\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ApproveGraduationProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('graduation_project')) ?? false;
    }

    public function rules(): array
    {
        return [
            'deposit_amount' => ['required', 'numeric', 'min:0'],
        ];
    }
}
