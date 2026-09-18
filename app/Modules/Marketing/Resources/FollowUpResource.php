<?php
namespace App\Modules\Marketing\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FollowUpResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => (string) $this->id,
            'leadId' => (string) $this->lead_id,
            'date' => $this->date?->toIso8601String(),
            'channel' => $this->channel,
            'notes' => $this->notes,
            'nextFollowUpAt' => optional($this->next_follow_up_at)->toIso8601String(),
            'createdBy' => $this->creator?->name ?? '',
        ];
    }
}
