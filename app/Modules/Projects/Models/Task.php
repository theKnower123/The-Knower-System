<?php

namespace App\Modules\Projects\Models;

use App\Modules\Auth\Models\User;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

class Task extends Model
{
    protected $fillable = [
        'project_id', 'milestone_id', 'assigned_to', 'title', 'description',
        'status', 'priority', 'start_date', 'due_date', 'estimated_hours', 'actual_hours',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'due_date'   => 'datetime',
    ];

    public function project()   { return $this->belongsTo(Project::class); 
}
    public function milestone() { return $this->belongsTo(Milestone::class); 
}
    public function assignee()  { return $this->belongsTo(User::class, 'assigned_to'); 
}
    public function comments()  { return $this->hasMany(TaskComment::class); 
}
    public function bugs()      { return $this->hasMany(Bug::class); 
}

    public function isOverdue(): bool
    {
        return $this->due_date && $this->due_date->isPast() && $this->status !== 'done';
    
}


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
