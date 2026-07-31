<?php
namespace App\Modules\Marketing\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TestimonialResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => (string) $this->id,
            'clientName' => $this->anonymous ? 'Anonymous' : ($this->client_name ?? $this->client?->name ?? 'Client'),
            'anonymous' => (bool) $this->anonymous,
            'quote' => $this->quote,
            'rating' => (int) $this->rating,
            'projectId' => $this->project_id ? (string) $this->project_id : null,
            'isApproved' => (bool) $this->is_approved,
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
