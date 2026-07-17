<?php

namespace App\Http\Requests\Finance;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('payment'));
    }

    public function rules(): array
    {
        return [
            // TODO: Add rules

        ];
    }
}
