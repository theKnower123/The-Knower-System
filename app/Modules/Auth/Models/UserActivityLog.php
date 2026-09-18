<?php

namespace App\Modules\Auth\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Modules\Auth\Models\User;

class UserActivityLog extends Model
{
    use HasFactory;

    protected $table = 'user_activity_logs';

    protected $fillable = [
        'user_id',
        'causer_id',
        'causer_name',
        'causer_role',
        'action',
        'category',
        'module',
        'action_type',
        'target_entity',
        'description',
        'properties',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'properties' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $appends = ['formatted_date_time'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id')->withTrashed();
    }

    public function causer()
    {
        return $this->belongsTo(User::class, 'causer_id')->withTrashed();
    }

    /**
     * Format timestamp as required: "Monday, August 10, 2026 — 06:25:43 AM"
     */
    public function getFormattedDateTimeAttribute(): string
    {
        if (!$this->created_at) return '';
        return $this->created_at->format('l, F j, Y — h:i:s A');
    }
}
