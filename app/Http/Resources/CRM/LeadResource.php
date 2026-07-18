<?php
namespace App\Http\Resources\CRM;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeadResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name ?? $this->title,
            'email' => $this->email,
            'phone' => $this->phone,
            'source' => $this->lead_source ? (is_string($this->lead_source) ? $this->lead_source : $this->lead_source->value) : 'Website',
            'budget' => (float) $this->lead_value,
            'status' => $this->pipeline_stage ? (is_string($this->pipeline_stage) ? $this->pipeline_stage : $this->pipeline_stage->value) : 'new',
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
            
            // Raw values
            'title' => $this->title,
        ];
    }
}
