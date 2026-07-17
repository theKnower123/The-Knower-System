<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

class Domain extends Model
{
    protected $fillable = [
        'client_id', 'project_id', 'domain', 'registrar', 'expiry_date', 'auto_renew', 'status',
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'auto_renew' => 'boolean',
    ];

    public $timestamps = false;

    public function client()
    {
        return $this->belongsTo(Client::class);
    
}

    public function project()
    {
        return $this->belongsTo(Project::class);
    
}

    public function sslCertificates()
    {
        return $this->hasMany(SslCertificate::class);
    
}


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
