<?php

namespace App\Http\Resources\Projects;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'clientId' => (string) $this->client_id,
            'name' => $this->name,
            'description' => $this->description,
            'type' => $this->type,
            'status' => $this->status,
            'priority' => $this->priority,
            'startDate' => $this->start_date ? $this->start_date->toISOString() : null,
            'deadline' => $this->deadline ? $this->deadline->toISOString() : null,
            'budget' => (float) $this->budget,
            'progress' => (int) $this->progress,
            'isPublic' => (bool) ($this->is_public ?? $this->show_in_portfolio ?? true),
            'showInPortfolio' => (bool) ($this->show_in_portfolio ?? $this->is_public ?? true),
            'createdBy' => (string) $this->created_by,
            'users' => $this->relationLoaded('users') ? $this->users->pluck('id')->map(fn($id) => (string) $id) : [],
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
            'deletedAt' => $this->deleted_at ? $this->deleted_at->toISOString() : null,
        ];
    }
}
