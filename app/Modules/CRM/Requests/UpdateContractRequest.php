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
        $contractId = $this->route('contract') ? $this->route('contract')->id : null;
        $fileRule = 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png,xlsx,xls,csv,pptx,ppt,webp,svg|max:102400';
        return [
            'client_id' => 'sometimes|required|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'type' => 'nullable|string',
            'quotation_id' => 'nullable|exists:quotations,id',
            'contract_number' => 'sometimes|required|string|max:100|unique:contracts,contract_number,' . $contractId,
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'sometimes|required|in:draft,active,completed,terminated',
            'amount' => 'nullable|numeric|min:0',
            'file' => $this->hasFile('file') ? $fileRule : 'nullable|string|max:255',
            'document' => $this->hasFile('document') ? $fileRule : 'nullable|string|max:255',
        ];
    }
}
