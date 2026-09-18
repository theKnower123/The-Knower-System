<?php

namespace App\Modules\Projects\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('taskcomment'));
    }

    public function rules(): array
    {
        return [
            // TODO: Add rules

        ];
    }
}
