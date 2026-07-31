<?php
namespace App\Modules\Marketing\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CampaignMetricResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => (string) $this->id,
            'campaignId' => (string) $this->campaign_id,
            'date' => $this->date?->format('Y-m-d'),
            'reach' => (int) $this->reach,
            'clicks' => (int) $this->clicks,
            'cost' => (float) $this->cost,
            'leadsGenerated' => (int) $this->leads_generated,
            'conversions' => (int) $this->conversions,
        ];
    }
}
