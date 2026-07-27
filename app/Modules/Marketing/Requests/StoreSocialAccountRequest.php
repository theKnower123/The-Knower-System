<?php

namespace App\Modules\Marketing\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSocialAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('marketing.accounts.manage');
    }

    public function rules(): array
    {
        return [
            'platform' => ['required', 'string', 'in:facebook,instagram,tiktok,linkedin,x,youtube,whatsapp'],
            'handle' => ['required', 'string', 'max:255'],
            'access_token_encrypted' => ['nullable', 'string'],
        ];
    }
}
