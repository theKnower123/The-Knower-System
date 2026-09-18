<?php

namespace App\Modules\Hosting\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHostingAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Modules\Hosting\Models\HostingAccount::class);
    }

    public function rules(): array
    { return []; }
}
