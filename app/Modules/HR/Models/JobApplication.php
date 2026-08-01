<?php

namespace App\Modules\HR\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\HandlesTrash;
use App\Traits\HasWorkspace;
use Spatie\Activitylog\Traits\LogsActivity;

class JobApplication extends Model
{
    use HandlesTrash;
    use SoftDeletes;
    use HasWorkspace, LogsActivity;

    protected $fillable = [
        'job_posting_id', 'first_name', 'last_name', 'email', 'phone', 
        'resume_path', 'cover_letter', 'portfolio_url', 'status', 'notes'
    ];

    protected $appends = ['resume_url'];

    public function getResumeUrlAttribute(): ?string
    {
        return \App\Support\StorageUrlHelper::url($this->resume_path);
    }

    public function jobPosting(): BelongsTo
    {
        return $this->belongsTo(JobPosting::class);
    }

    public function getActivitylogOptions(): \Spatie\Activitylog\LogOptions
    {
        return \Spatie\Activitylog\LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
