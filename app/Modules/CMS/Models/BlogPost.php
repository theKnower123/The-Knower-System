<?php

namespace App\Modules\CMS\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\HasWorkspace;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class BlogPost extends Model
{
    use HandlesTrash;
    use SoftDeletes;
    use HasWorkspace, LogsActivity;

    protected $guarded = [];

    protected $appends = ['image_url', 'featured_image_url'];

    public function getImageUrlAttribute(): ?string
    {
        return \App\Support\StorageUrlHelper::url($this->attributes['image'] ?? $this->attributes['featured_image'] ?? null);
    }

    public function getFeaturedImageUrlAttribute(): ?string
    {
        return \App\Support\StorageUrlHelper::url($this->attributes['featured_image'] ?? $this->attributes['image'] ?? null);
    }

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'date',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
