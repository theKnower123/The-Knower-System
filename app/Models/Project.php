<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

class Project extends Model
{
    protected $fillable = [
        'client_id', 'name', 'description', 'type', 'status',
        'priority', 'start_date', 'deadline', 'budget', 'progress', 'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'deadline'   => 'date',
        'budget'     => 'decimal:2',
    ];

    public function client()        { return $this->belongsTo(Client::class); 
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
    public function creator()       { return $this->belongsTo(User::class, 'created_by'); 
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
    public function milestones()    { return $this->hasMany(Milestone::class); 
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
    public function tasks()         { return $this->hasMany(Task::class); 
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
    public function bugs()          { return $this->hasMany(Bug::class); 
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
    public function files()         { return $this->hasMany(File::class); 
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
    public function invoices()      { return $this->hasMany(Invoice::class); 
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
    public function tickets()       { return $this->hasMany(Ticket::class); 
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
    public function domains()       { return $this->hasMany(Domain::class); 
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
    public function hostingAccounts() { return $this->hasMany(HostingAccount::class); 
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}

    public function getProgressPercentAttribute(): int
    {
        $total = $this->tasks()->count();
        if ($total === 0) return 0;
        $done = $this->tasks()->where('status', 'done')->count();
        return (int) round(($done / $total) * 100);
    
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
