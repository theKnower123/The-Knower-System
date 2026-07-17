<?php
namespace App\Http\Requests\CRM;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\QuotationStatus;
use Illuminate\Validation\Rules\Enum;

class UpdateQuotationRequest extends FormRequest
{
    public function authorize() { return true; }
    public function rules() {
        return [
            'quotation_number' => 'required|string|max:50|unique:quotations,quotation_number,$this->quotation->id',
            'company_id' => 'required|exists:companies,id',
            'contact_id' => 'nullable|exists:contacts,id',
            'lead_id' => 'nullable|exists:leads,id',
            'parent_id' => 'nullable|exists:quotations,id',
            'version' => 'integer|min:1',
            'status' => ['nullable', new Enum(QuotationStatus::class)],
            'issue_date' => 'required|date',
            'valid_until' => 'required|date|after_or_equal:issue_date',
            'subtotal' => 'required|numeric|min:0',
            'tax_amount' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'currency' => 'string|size:3',
            'terms_and_conditions' => 'nullable|string',
            'notes' => 'nullable|string',
        ];
    }
}
