<?php

namespace App\Modules\Finance\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Modules\Finance\Models\Payment::class);
    }

    public function rules(): array
    {
        $rules = [
            'invoice_id' => 'required|exists:invoices,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'nullable|string',
            'method' => 'nullable|string',
            'payment_date' => 'nullable|date',
            'paid_at' => 'nullable|date',
            'reference' => 'nullable|string',
            'notes' => 'nullable|string',
        ];

        if ($this->hasFile('transfer_proof')) {
            $rules['transfer_proof'] = 'file|mimes:jpg,jpeg,png,pdf,svg,webp|max:20480';
        } else {
            $rules['transfer_proof'] = 'nullable';
        }

        return $rules;
    }
}
