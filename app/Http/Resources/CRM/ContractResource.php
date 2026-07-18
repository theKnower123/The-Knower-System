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
            'number' => $this->number,
            'amount' => (float) $this->amount,
            'status' => $this->status,
            'startDate' => $this->start_date ? $this->start_date->toISOString() : null,
            'endDate' => $this->end_date ? $this->end_date->toISOString() : null,
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
        ];
    }
}
