<?php
namespace App\Modules\CRM\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\QuotationStatus;
use Illuminate\Validation\Rules\Enum;

class UpdateQuotationRequest extends FormRequest
{
    public function authorize(): bool
    {
        $q = $this->route('quotation') ?? $this->route('id');
        if (is_numeric($q) || is_string($q)) {
            $q = \App\Modules\CRM\Models\Quotation::find($q);
        }
        if ($q) {
            return $this->user()->can('update', $q);
        }
        return $this->user()->hasPermissionTo('crm.view') || $this->user()->hasPermissionTo('crm.manage') || $this->user()->hasPermissionTo('quotation.manage');
    }
    public function rules() {
        return [
            'quotation_number' => 'nullable|string|max:50',
            'client_id' => 'nullable|exists:clients,id',
            'lead_id' => 'nullable|exists:leads,id',
            'parent_id' => 'nullable|exists:quotations,id',
            'version' => 'integer|min:1',
            'status' => ['nullable', new Enum(QuotationStatus::class)],
            'issue_date' => 'sometimes|required|date',
            'valid_until' => 'sometimes|required|date|after_or_equal:issue_date',
            'subtotal' => 'nullable|numeric|min:0',
            'tax_amount' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'total_amount' => 'sometimes|required|numeric|min:0',
            'currency' => 'string|size:3',
            'terms_and_conditions' => 'nullable|string',
            'notes' => 'nullable|string',
        ];
    }
}
