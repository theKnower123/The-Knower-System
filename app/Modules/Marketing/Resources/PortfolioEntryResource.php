<?php
namespace App\Modules\Marketing\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PortfolioEntryResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => (string) $this->id,
            'projectId' => (string) $this->project_id,
            'title' => $this->title ?? $this->project?->name,
            'clientApproved' => (bool) $this->client_approved,
            'isVisible' => (bool) $this->is_visible,
            'coverImage' => $this->cover_image,
            'description' => $this->description,
            'tags' => $this->tags ?? [],
            'showClientName' => (bool) $this->show_client_name,
            'clientLabel' => $this->show_client_name
                ? ($this->client_label ?? $this->project?->client?->name ?? 'Client')
                : 'Confidential Client',
        ];
    }
}
