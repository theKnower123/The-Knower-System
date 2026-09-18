<?php
namespace App\Modules\Marketing\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LeadAttributionResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => (string) $this->id,
            'leadId' => (string) $this->lead_id,
            'source' => $this->source,
            'utmSource' => $this->utm_source,
            'utmCampaign' => $this->utm_campaign,
            'utmMedium' => $this->utm_medium,
        ];
    }
}
