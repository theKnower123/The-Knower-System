<?php

namespace App\Http\Resources\HR;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobPostingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'title' => $this->title,
            'departmentId' => $this->department_id ? (string) $this->department_id : null,
            'departmentName' => $this->whenLoaded('department', fn() => $this->department->name),
            'type' => $this->type,
            'location' => $this->location,
            'description' => $this->description,
            'requirements' => $this->requirements,
            'status' => $this->status,
            'closingDate' => $this->closing_date ? $this->closing_date->format('Y-m-d') : null,
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
        ];
    }
}
