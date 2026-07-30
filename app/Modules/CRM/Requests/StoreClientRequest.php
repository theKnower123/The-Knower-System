<?php

namespace App\Modules\CRM\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Modules\CRM\Models\Client::class);
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:clients,email',
            'phone' => 'nullable|string|max:50',
            'position' => 'nullable|string|max:100',
            'status' => 'required|in:active,inactive,prospect',

            // Portal account (optional)
            'create_portal_account' => 'sometimes|boolean',
            'password' => 'nullable|required_if:create_portal_account,true|string|min:6',
        ];
    }
}
