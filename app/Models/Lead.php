<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

class Lead extends Model
{
    protected $fillable = [
        'name', 'email', 'phone', 'source', 'budget', 'status', 'assigned_to', 'notes',
    ];

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
