<?php

namespace App\Http\Requests\HR;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('attendance'));
    }

    public function rules(): array
    {
        return [
            // TODO: Add rules

        ];
    }
}
