<?php

namespace App\Http\Requests\CRM;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLeadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('lead'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'source' => 'nullable|string|max:100',
            'budget' => 'nullable|numeric|min:0',
            'status' => ['sometimes', 'required', \Illuminate\Validation\Rule::enum(\App\Enums\LeadStatus::class)],
            'assigned_to' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
        ];
    }
}
