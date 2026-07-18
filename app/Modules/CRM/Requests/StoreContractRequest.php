<?php

namespace App\Modules\CRM\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContractRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_id' => 'required|exists:clients,id',
            'quotation_id' => 'nullable|exists:quotations,id',
            'contract_number' => 'nullable|string|max:100|unique:contracts,contract_number',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'required|in:draft,active,completed,terminated',
            'amount' => 'nullable|numeric|min:0',
            'file' => 'nullable|string|max:255',
        ];
    }
}
