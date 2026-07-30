<?php

namespace App\Modules\HR\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\HasWorkspace;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class JobPosting extends Model
{
    use HandlesTrash;
    use SoftDeletes;
    use HasWorkspace, LogsActivity;

    protected $fillable = [
        'title', 'department_id', 'type', 'location', 
        'description', 'requirements', 'status', 'closing_date'
    ];

    protected $casts = [
        'closing_date' => 'date',
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    public function getActivitylogOptions(): \Spatie\Activitylog\LogOptions
    {
        return \Spatie\Activitylog\LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
