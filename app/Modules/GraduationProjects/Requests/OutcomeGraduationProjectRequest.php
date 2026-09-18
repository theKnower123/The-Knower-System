<?php

namespace App\Modules\GraduationProjects\Requests;

use App\Enums\GraduationProjectOutcome;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OutcomeGraduationProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('graduation_project')) ?? false;
    }

    public function rules(): array
    {
        return [
            'outcome' => ['nullable', Rule::in(GraduationProjectOutcome::values())],
            'outcome_notes' => ['nullable', 'string', 'max:5000'],
            'is_showcased' => ['nullable', 'boolean'],
        ];
    }
}
