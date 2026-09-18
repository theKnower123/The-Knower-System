<?php

namespace App\Modules\Finance\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('invoice'));
    }

    public function rules(): array
    {
        $invoiceId = $this->route('invoice') ? (is_object($this->route('invoice')) ? $this->route('invoice')->id : $this->route('invoice')) : null;

        return [
            'client_id' => 'sometimes|required|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'invoice_number' => 'sometimes|required|string|max:100|unique:invoices,invoice_number,' . $invoiceId,
            'amount' => 'sometimes|required|numeric|min:0',
            'paid_amount' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'status' => 'sometimes|required|string',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ];
    }
}
