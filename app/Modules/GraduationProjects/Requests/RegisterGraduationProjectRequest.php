<?php

namespace App\Modules\GraduationProjects\Requests;

use App\Enums\GraduationProjectType;
use App\Enums\GraduationServiceType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterGraduationProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $members = $this->input('members');
        if (is_string($members)) {
            $decoded = json_decode($members, true);
            $this->merge(['members' => is_array($decoded) ? $decoded : []]);
        }
    }

    public function rules(): array
    {
        return [
            'team_name' => ['required', 'string', 'max:255'],
            'university' => ['required', 'string', 'max:255'],
            'college' => ['required', 'string', 'max:255'],
            'team_size' => ['required', 'integer', 'min:1', 'max:20'],
            'primary_contact_name' => ['required', 'string', 'max:255'],
            'primary_contact_phone' => ['required', 'string', 'max:40'],
            'primary_contact_email' => ['required', 'email', 'max:255'],
            'primary_contact_role' => ['nullable', 'string', 'max:100'],
            'project_type' => ['required', Rule::in(GraduationProjectType::values())],
            'service_type' => ['required', Rule::in(GraduationServiceType::values())],
            'description' => ['required', 'string', 'max:10000'],
            'deadline' => ['nullable', 'date'],
            'brief_attachment' => ['nullable', 'file', 'max:10240', 'mimes:pdf,doc,docx,zip,png,jpg,jpeg'],
            'members' => ['nullable', 'array'],
            'members.*.name' => ['required_with:members', 'string', 'max:255'],
            'members.*.phone' => ['nullable', 'string', 'max:40'],
            'members.*.email' => ['nullable', 'email', 'max:255'],
            'members.*.role_in_team' => ['nullable', 'string', 'max:100'],
        ];
    }
}
