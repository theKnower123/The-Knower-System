<?php

namespace App\Http\Requests\CRM;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('company'));
    }

    public function rules(): array
    {
        return [

            'company_name' => 'sometimes|required|string|max:255',
            'industry' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'tax_number' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        
        ];
    }
}
