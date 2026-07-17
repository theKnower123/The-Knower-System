<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

class File extends Model
{
    protected $fillable = [
        'project_id', 'uploaded_by', 'file_name', 'file_path', 'size', 'type',
    ];

    public $timestamps = false; // only custom created_at timestamp in migration

    public function project()
    {
        return $this->belongsTo(Project::class);
    
}

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    
}


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
