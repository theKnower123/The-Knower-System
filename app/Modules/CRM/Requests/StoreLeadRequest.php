<?php
namespace App\Modules\CRM\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\LeadPipelineStage;
use App\Enums\LeadSource;
use Illuminate\Validation\Rules\Enum;

class StoreLeadRequest extends FormRequest
{
    public function authorize() { return true; }
    public function rules() {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:255',
            'source' => 'nullable|string',
            'budget' => 'nullable|numeric|min:0',
            'status' => 'required|string|in:new,contacted,qualified,won,lost',
            
            // Allow backend mapping
            'title' => 'nullable|string|max:255',
            'pipeline_stage' => 'nullable|string',
            'lead_value' => 'nullable|numeric|min:0',
            'lead_source' => 'nullable|string',
        ];
    }
}
