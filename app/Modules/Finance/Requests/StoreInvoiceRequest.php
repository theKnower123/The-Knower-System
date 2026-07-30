<?php

namespace App\Modules\Finance\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Modules\Finance\Models\Invoice::class);
    }

    public function rules(): array
    {
        return [
            'client_id' => 'required|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'invoice_number' => 'nullable|string|max:100|unique:invoices,invoice_number',
            'amount' => 'required|numeric|min:0',
            'paid_amount' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'status' => 'nullable|string',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ];
    }
}
