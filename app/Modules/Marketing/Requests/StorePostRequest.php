<?php

namespace App\Modules\Marketing\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('marketing.posts.create');
    }

    public function rules(): array
    {
        return [
            'content' => ['required', 'string'],
            'media_path' => ['nullable', 'string'],
            'scheduled_at' => ['nullable', 'date'],
            'account_ids' => ['required', 'array', 'min:1'],
            'account_ids.*' => ['exists:social_accounts,id'],
        ];
    }
}
