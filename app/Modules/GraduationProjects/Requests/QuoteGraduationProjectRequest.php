<?php

namespace App\Modules\GraduationProjects\Requests;

use App\Enums\GraduationServiceType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class QuoteGraduationProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('graduation_project')) ?? false;
    }

    public function rules(): array
    {
        return [
            'quoted_price' => ['required', 'numeric', 'min:0'],
            'final_service_type' => ['nullable', Rule::in(GraduationServiceType::values())],
        ];
    }
}
