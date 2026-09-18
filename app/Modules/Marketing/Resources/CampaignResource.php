<?php
namespace App\Modules\Marketing\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CampaignResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'platform' => $this->platform,
            'objective' => $this->objective,
            'budget' => (float) $this->budget,
            'spent' => (float) $this->spent,
            'startDate' => optional($this->start_date)->toIso8601String(),
            'endDate' => optional($this->end_date)->toIso8601String(),
            'createdBy' => $this->creator?->name ?? '',
            'status' => $this->status,
            'landingSectionKey' => $this->landing_section_key,
        ];
    }
}
