<?php

namespace App\Http\Requests\Finance;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('invoice'));
    }

    public function rules(): array
    {
        return [

            'client_id' => 'sometimes|required|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'invoice_number' => 'sometimes|required|string|max:100|unique:invoices,invoice_number,' . $invoice->id,
            'amount' => 'sometimes|required|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'status' => 'sometimes|required|in:draft,sent,paid,overdue,cancelled',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
        
        ];
    }
}
