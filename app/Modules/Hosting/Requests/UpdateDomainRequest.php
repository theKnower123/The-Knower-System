<?php

namespace App\Modules\Hosting\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDomainRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('domain'));
    }

    public function rules(): array
    {
        return [

            'client_id' => 'nullable|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'domain' => 'sometimes|required|string|max:255|unique:domains,domain,' . $domain->id,
            'registrar' => 'nullable|string|max:100',
            'expiry_date' => 'nullable|date',
            'auto_renew' => 'nullable|boolean',
            'status' => 'sometimes|required|in:active,expired,transferred,pending',
        
        ];
    }
}
