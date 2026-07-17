<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

class Milestone extends Model
{
    protected $fillable = [
        'project_id', 'title', 'deadline', 'progress', 'status',
    ];

    protected $casts = [
        'deadline' => 'date',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    
}

    public function tasks()
    {
        return $this->hasMany(Task::class);
    
}


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
