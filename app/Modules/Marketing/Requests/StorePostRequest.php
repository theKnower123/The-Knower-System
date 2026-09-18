<?php

namespace App\Modules\Marketing\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        if (!$user) return false;
        return true;
    }

    public function rules(): array
    {
        return [
            'content' => ['required', 'string'],
            'media_path' => ['nullable', 'string'],
            'media' => ['nullable', 'file', 'max:20480'], // max 20MB
            'scheduled_at' => ['nullable', 'date'],
            'account_ids' => ['required', 'array', 'min:1'],
            'account_ids.*' => ['exists:social_accounts,id'],
            'status' => ['nullable', 'string', 'in:draft,pending_approval'],
        ];
    }
}
