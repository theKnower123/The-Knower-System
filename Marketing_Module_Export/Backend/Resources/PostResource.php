<?php
namespace App\Modules\Marketing\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => (string) $this->id,
            'content' => $this->content,
            'mediaLabel' => $this->media_label,
            'status' => $this->status,
            'scheduledAt' => optional($this->scheduled_at)->toIso8601String(),
            'publishedAt' => optional($this->published_at)->toIso8601String(),
            'createdBy' => $this->creator?->name ?? '',
            'approvedBy' => $this->approver?->name,
            'accountIds' => $this->accounts->pluck('id')->map(fn ($id) => (string) $id)->values(),
            'note' => $this->note,
            'reach' => $this->reach,
            'engagement' => $this->engagement,
        ];
    }
}
