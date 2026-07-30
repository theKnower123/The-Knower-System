<?php

namespace App\Modules\CRM\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('client'));
    }

    public function rules(): array
    {
        // BUG FIX: this used to reference an undefined $client variable,
        // which made every client update request crash with a fatal error.
        $clientId = is_object($this->route('client')) ? $this->route('client')->id : $this->route('client');

        return [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255|unique:clients,email,' . $clientId,
            'phone' => 'nullable|string|max:50',
            'position' => 'nullable|string|max:100',
            'status' => 'sometimes|required|in:active,inactive,prospect',

            // Portal account (optional)
            'create_portal_account' => 'sometimes|boolean',
            'password' => 'nullable|string|min:6',
        ];
    }
}
