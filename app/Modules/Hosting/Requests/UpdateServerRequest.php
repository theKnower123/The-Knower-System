<?php

namespace App\Modules\Hosting\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('server'));
    }

    public function rules(): array
    {
        return [

            'name' => 'sometimes|required|string|max:255',
            'provider' => 'nullable|string|max:100',
            'ip' => 'nullable|ip|max:45',
            'location' => 'nullable|string|max:100',
            'os' => 'nullable|string|max:100',
            'status' => 'sometimes|required|in:active,inactive,maintenance',
            'notes' => 'nullable|string',
        
        ];
    }
}
