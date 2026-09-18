<?php

namespace App\Http\Resources\CRM;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContractResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'clientId' => (string) $this->client_id,
            'client_id' => (string) $this->client_id,
            'client' => $this->whenLoaded('client'),
            'projectId' => $this->project_id ? (string) $this->project_id : null,
            'project_id' => $this->project_id ? (string) $this->project_id : null,
            'project' => $this->whenLoaded('project'),
            'number' => $this->contract_number ?? $this->number,
            'contract_number' => $this->contract_number ?? $this->number,
            'type' => $this->type,
            'amount' => (float) $this->amount,
            'status' => $this->status,
            'file' => $this->file ?? $this->document,
            'document' => $this->document ?? $this->file,
            'startDate' => $this->start_date ? $this->start_date->toISOString() : null,
            'endDate' => $this->end_date ? $this->end_date->toISOString() : null,
            'createdAt' => $this->created_at ? $this->created_at->toISOString() : null,
            'updatedAt' => $this->updated_at ? $this->updated_at->toISOString() : null,
        ];
    }
}
