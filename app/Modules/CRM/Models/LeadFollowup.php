<?php

namespace App\Modules\CRM\Models;

use App\Modules\Auth\Models\User;
use App\Traits\HandlesTrash;
use App\Traits\HasWorkspace;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class LeadFollowup extends Model
{
    use HasFactory, HasWorkspace, HandlesTrash, SoftDeletes, LogsActivity;

    protected $fillable = [
        'workspace_id',
        'lead_id',
        'channel',
        'notes',
        'outcome',
        'follow_up_date',
        'next_follow_up_date',
        'created_by',
    ];

    protected $casts = [
        'follow_up_date' => 'date',
        'next_follow_up_date' => 'date',
    ];

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
