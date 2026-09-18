<?php

namespace App\Modules\Hosting\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSslCertificateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Modules\Hosting\Models\SslCertificate::class);
    }

    public function rules(): array
    { return []; }
}
