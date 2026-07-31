<?php
namespace App\Modules\Marketing\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

// Wraps a real User (role: marketing_admin/social_manager/ads_specialist/
// content_creator) so the frontend's TeamMember shape keeps working
// unchanged: { id, name, role, avatarColor }.
class TeamMemberResource extends JsonResource
{
    const COLOR_MAP = [
        'marketing_admin' => 'bg-primary/15 text-primary',
        'social_manager' => 'bg-emerald-500/15 text-emerald-500',
        'ads_specialist' => 'bg-amber-500/15 text-amber-500',
        'content_creator' => 'bg-fuchsia-500/15 text-fuchsia-500',
    ];

    const LABEL_MAP = [
        'marketing_admin' => 'Marketing Admin',
        'social_manager' => 'Social Media Manager',
        'ads_specialist' => 'Ads Specialist',
        'content_creator' => 'Content Writer/Designer',
    ];

    public function toArray($request): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'role' => self::LABEL_MAP[$this->role] ?? $this->role,
            'avatarColor' => self::COLOR_MAP[$this->role] ?? 'bg-muted text-muted-foreground',
        ];
    }
}
