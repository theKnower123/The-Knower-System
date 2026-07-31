<?php
namespace App\Modules\Marketing\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LandingSectionResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => (string) $this->id,
            'sectionKey' => $this->section_key,
            'label' => $this->label ?? ucwords(str_replace('_', ' ', $this->section_key)),
            'isVisible' => (bool) $this->is_visible,
            'sortOrder' => (int) $this->sort_order,
            'updatedBy' => $this->updatedBy?->name ?? '',
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
