<?php

namespace App\Http\Requests\Finance;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('expense'));
    }

    public function rules(): array
    {
        return [

            'category' => 'sometimes|required|string|max:255',
            'title' => 'sometimes|required|string|max:255',
            'amount' => 'sometimes|required|numeric|min:0',
            'payment_method' => 'sometimes|required|in:cash,bank_transfer,card,other',
            'notes' => 'nullable|string',
        
        ];
    }
}
