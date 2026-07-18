<?php

namespace App\Modules\CRM\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateContractRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('contract'));
    }

    public function rules(): array
    {
        return [

            'client_id' => 'sometimes|required|exists:clients,id',
            'quotation_id' => 'nullable|exists:quotations,id',
            'contract_number' => 'sometimes|required|string|max:100|unique:contracts,contract_number,' . $contract->id,
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'sometimes|required|in:draft,active,completed,terminated',
            'amount' => 'nullable|numeric|min:0',
            'file' => 'nullable|string|max:255',
        ];
    }
}
