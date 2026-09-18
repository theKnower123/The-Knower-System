<?php

namespace App\Modules\CMS\Models;

use App\Modules\Projects\Models\Project;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class PortfolioEntry extends Model
{
    use HandlesTrash;
    use SoftDeletes;
    protected $fillable = [
        'project_id', 'client_approved', 'is_visible', 'cover_image',
        'description', 'tags', 'show_client_name',
    ];

    protected $appends = ['cover_image_url'];

    public function getCoverImageUrlAttribute(): ?string
    {
        return \App\Support\StorageUrlHelper::url($this->cover_image);
    }

    protected $casts = [
        'client_approved' => 'boolean',
        'is_visible' => 'boolean',
        'show_client_name' => 'boolean',
        'tags' => 'array',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // Guard: can only be shown publicly once the client has approved it.
    public function publishEntry(): void
    {
        if (! $this->client_approved) {
            throw new \RuntimeException('Cannot show a project publicly before client approval.');
        }

        $this->update(['is_visible' => true]);
    }
}
