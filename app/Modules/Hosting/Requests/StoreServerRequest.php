<?php

namespace App\Modules\Hosting\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Modules\Hosting\Models\Server::class);
    }

    public function rules(): array
    { return []; }
}
