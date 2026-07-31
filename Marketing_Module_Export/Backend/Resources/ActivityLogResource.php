<?php
namespace App\Modules\Marketing\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ActivityLogResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => (string) $this->id,
            'actor' => $this->actor,
            'action' => $this->action,
            'target' => $this->target,
            'at' => $this->at?->toIso8601String(),
        ];
    }
}
