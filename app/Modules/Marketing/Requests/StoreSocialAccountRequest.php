<?php

namespace App\Modules\Marketing\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSocialAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        if (!$user) return false;
        return $user->hasRole(['super_admin', 'administrator', 'admin', 'marketing']) || 
               $user->hasPermissionTo('marketing.manage') || 
               $user->hasPermissionTo('marketing.view');
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
