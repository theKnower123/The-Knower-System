<?php

namespace App\Modules\Projects\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;
use App\Modules\CRM\Models\Client;
use App\Modules\Auth\Models\User;
use App\Modules\Finance\Models\Invoice;
use App\Modules\Support\Models\Ticket;
use App\Modules\Hosting\Models\Domain;
use App\Modules\Hosting\Models\HostingAccount;

class Project extends Model
{
    use HasWorkspace, LogsActivity;

    protected $fillable = [
        'client_id', 'name', 'description', 'type', 'status',
        'priority', 'start_date', 'deadline', 'budget', 'progress', 'created_by',
        'tech_stack', 'language', 'github_link', 'assets_link'
    ];

    protected $casts = [
        'start_date' => 'date',
        'deadline'   => 'date',
        'budget'     => 'decimal:2',
        'is_public'  => 'boolean',
        'public_stack' => 'array',
    ];

    public function client()        { return $this->belongsTo(Client::class); 
}
    public function creator()       { return $this->belongsTo(User::class, 'created_by'); 
}
    public function users()         { return $this->belongsToMany(User::class); 
}
    public function milestones()    { return $this->hasMany(Milestone::class); 
}
    public function tasks()         { return $this->hasMany(Task::class); 
}
    public function bugs()          { return $this->hasMany(Bug::class); 
}
    public function files()         { return $this->hasMany(File::class); 
}
    public function invoices()      { return $this->hasMany(Invoice::class); 
}
    public function tickets()       { return $this->hasMany(Ticket::class); 
}
    public function domains()       { return $this->hasMany(Domain::class); 
}
    public function hostingAccounts() { return $this->hasMany(HostingAccount::class); 
}

    public function getProgressPercentAttribute(): int
    {
        $total = $this->tasks()->count();
        if ($total === 0) return 0;
        $done = $this->tasks()->where('status', 'done')->count();
        return (int) round(($done / $total) * 100);
    
}


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
