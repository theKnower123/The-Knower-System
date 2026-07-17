<?php
namespace App\Http\Requests\CRM;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\ContactStatus;
use App\Enums\ContactType;
use Illuminate\Validation\Rules\Enum;

class UpdateContactRequest extends FormRequest
{
    public function authorize() { return true; }
    public function rules() {
        return [
            'company_id' => 'required|exists:companies,id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'mobile' => 'nullable|string|max:50',
            'job_title' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'status' => ['nullable', new Enum(ContactStatus::class)],
            'type' => ['nullable', new Enum(ContactType::class)],
            'is_primary' => 'boolean',
        ];
    }
}
