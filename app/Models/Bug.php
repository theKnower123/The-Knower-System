<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

class Bug extends Model
{
    protected $fillable = [
        'project_id', 'task_id', 'reported_by', 'assigned_to', 'severity', 'status', 'description', 'steps_to_reproduce',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    
}

    public function task()
    {
        return $this->belongsTo(Task::class);
    
}

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reported_by');
    
}

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    
}


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
