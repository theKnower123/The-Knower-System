<?php

namespace App\Modules\Hosting\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHostingAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('hostingaccount'));
    }

    public function rules(): array
    {
        return [

            'client_id' => 'nullable|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'server_id' => 'nullable|exists:servers,id',
            'provider' => 'sometimes|required|string|max:100',
            'plan' => 'nullable|string|max:100',
            'username' => 'nullable|string|max:100',
            'expiry_date' => 'nullable|date',
            'status' => 'sometimes|required|in:active,inactive,suspended,expired',
            'auto_renew' => 'nullable|boolean',
        
        ];
    }
}
