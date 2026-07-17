<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

class Server extends Model
{
    protected $fillable = [
        'name', 'provider', 'ip', 'location', 'os', 'status', 'notes',
    ];

    public function hostingAccounts()
    {
        return $this->hasMany(HostingAccount::class);
    
}


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
