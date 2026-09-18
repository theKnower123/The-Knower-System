<?php

namespace App\Modules\Finance\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Modules\Finance\Models\Expense::class);
    }

    public function rules(): array
    {
        $rules = [
            'project_id' => 'nullable|exists:projects,id',
            'category' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'amount' => 'nullable|numeric|min:0',
            'unit_price' => 'nullable|numeric|min:0',
            'quantity' => 'nullable|numeric|min:0',
            'payment_method' => 'nullable|string',
            'method' => 'nullable|string',
            'date' => 'nullable|date',
            'expense_date' => 'nullable|date',
            'description' => 'nullable|string',
            'notes' => 'nullable|string',
        ];

        if ($this->hasFile('transfer_proof')) {
            $rules['transfer_proof'] = 'file|mimes:jpg,jpeg,png,pdf,svg,webp|max:20480';
        } else {
            $rules['transfer_proof'] = 'nullable';
        }

        if ($this->hasFile('receipt_path')) {
            $rules['receipt_path'] = 'file|mimes:jpg,jpeg,png,pdf,svg,webp|max:20480';
        } else {
            $rules['receipt_path'] = 'nullable';
        }

        if ($this->hasFile('invoice_proof')) {
            $rules['invoice_proof'] = 'file|mimes:jpg,jpeg,png,pdf,svg,webp|max:20480';
        } else {
            $rules['invoice_proof'] = 'nullable';
        }

        return $rules;
    }
}
