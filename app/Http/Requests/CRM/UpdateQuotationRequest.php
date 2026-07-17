<?php

namespace App\Http\Requests\CRM;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuotationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('quotation'));
    }

    public function rules(): array
    {
        return [

            'client_id' => 'sometimes|required|exists:clients,id',
            'quotation_number' => 'sometimes|required|string|max:100|unique:quotations,quotation_number,' . $quotation->id,
            'price' => 'sometimes|required|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'status' => 'sometimes|required|in:draft,sent,accepted,rejected,expired',
            'valid_until' => 'nullable|date',
            'notes' => 'nullable|string',
        
        ];
    }
}
