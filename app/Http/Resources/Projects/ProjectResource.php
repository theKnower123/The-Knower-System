<?php

namespace App\Http\Resources\Projects;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    protected function canSeeCommercialDetails(?\App\Modules\Auth\Models\User $user): bool
    {
        if (!$user) {
            return false;
        }

        if (in_array($user->role, ['super_admin', 'ceo', 'project_manager', 'team_leader', 'accountant'], true)) {
            return true;
        }

        return $user->hasPermissionTo('project.manage') || $user->hasPermissionTo('finance.view');
    }

    public function toArray(Request $request): array
    {
        $user = $request->user();
        $canSeeCommercial = $this->canSeeCommercialDetails($user);

        return [
            'id' => (string) $this->id,
            'clientId' => (string) $this->client_id,
            'name' => $this->name,
            'description' => $this->description,
            'type' => $this->type,
            'status' => $this->status,
            'priority' => $this->priority,
            'startDate' => $this->start_date ? $this->start_date->toISOString() : null,
            'deadline' => $canSeeCommercial && $this->deadline ? $this->deadline->toISOString() : null,
            'budget' => $canSeeCommercial ? (float) $this->budget : null,
            'progress' => (int) $this->progress,
            'techStack' => $this->tech_stack,
            'language' => $this->language,
            'githubLink' => $this->github_link,
            'assetsLink' => $this->assets_link,
            'images' => $this->images ?? [],
            'isPublic' => (bool) ($this->is_public ?? $this->show_in_portfolio ?? true),
            'showInPortfolio' => (bool) ($this->show_in_portfolio ?? $this->is_public ?? true),
            'createdBy' => (string) $this->created_by,
            'users' => $this->relationLoaded('users') ? $this->users->pluck('id')->map(fn ($id) => (string) $id) : [],
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
            'deletedAt' => $this->deleted_at ? $this->deleted_at->toISOString() : null,
        ];
    }
}
