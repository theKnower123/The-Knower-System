<?php

namespace App\Http\Requests\CRM;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('client'));
    }

    public function rules(): array
    {
        return [

            'company_id' => 'nullable|exists:companies,id',
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255|unique:clients,email,' . $client->id,
            'phone' => 'nullable|string|max:50',
            'position' => 'nullable|string|max:100',
            'status' => 'sometimes|required|in:active,inactive,prospect',
        
        ];
    }
}
