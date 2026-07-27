<?php

namespace App\Modules\CMS\Models;

use App\Modules\Projects\Models\Project;
use Illuminate\Database\Eloquent\Model;

class PortfolioEntry extends Model
{
    protected $fillable = [
        'project_id', 'client_approved', 'is_visible', 'cover_image',
        'description', 'tags', 'show_client_name',
    ];

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
    public function makeVisible(): void
    {
        if (! $this->client_approved) {
            throw new \RuntimeException('Cannot show a project publicly before client approval.');
        }

        $this->update(['is_visible' => true]);
    }
}
