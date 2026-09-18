<?php

namespace App\Modules\CMS\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasWorkspace;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\HandlesTrash;

class Service extends Model
{
    use HandlesTrash;
    use SoftDeletes;
    use HasWorkspace, LogsActivity;

    protected $guarded = [];

    protected $casts = [
        'is_published'  => 'boolean',
        'is_active'     => 'boolean',
        'deliverables'  => 'array',
        'features'      => 'array',
        'benefits'      => 'array',
        'highlights'    => 'array',
        'tech_stack'    => 'array',
        'process_steps' => 'array',
        'faqs'          => 'array',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
