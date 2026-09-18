<?php

namespace App\Modules\Hosting\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSslCertificateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('sslcertificate'));
    }

    public function rules(): array
    {
        return [

            'domain_id' => 'sometimes|required|exists:domains,id',
            'provider' => 'nullable|string|max:100',
            'expiry_date' => 'nullable|date',
            'status' => 'sometimes|required|in:active,expired,revoked',
        
        ];
    }
}
