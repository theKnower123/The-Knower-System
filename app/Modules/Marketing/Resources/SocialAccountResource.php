<?php
namespace App\Modules\Marketing\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SocialAccountResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => (string) $this->id,
            'platform' => $this->platform,
            'handle' => $this->handle,
            'connectedBy' => $this->connectedBy?->name ?? '',
            'status' => $this->status,
            'followers' => (int) $this->followers,
            'connectedAt' => $this->created_at?->toIso8601String(),
            'assignedTeam' => $this->assignedUsers->pluck('id')->map(fn ($id) => (string) $id)->values(),
        ];
    }
}
