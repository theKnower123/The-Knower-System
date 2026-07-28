<?php

namespace App\Modules\CMS\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\HasWorkspace;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class MarketingPlan extends Model
{
    use HandlesTrash;
    use SoftDeletes;
    use HasWorkspace, LogsActivity;

    protected $guarded = [];

    protected $casts = [
        'features' => 'array',
        'highlight' => 'boolean',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
