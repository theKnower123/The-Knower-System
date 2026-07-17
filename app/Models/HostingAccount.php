<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

class HostingAccount extends Model
{
    protected $table = 'hosting_accounts';

    protected $fillable = [
        'client_id', 'project_id', 'server_id', 'provider', 'plan', 'username', 'expiry_date', 'status', 'auto_renew',
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'auto_renew' => 'boolean',
    ];

    public $timestamps = false;

    public function client()
    {
        return $this->belongsTo(Client::class);
    
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}

    public function project()
    {
        return $this->belongsTo(Project::class);
    
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}

    public function server()
    {
        return $this->belongsTo(Server::class);
    
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
