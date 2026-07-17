<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

class SslCertificate extends Model
{
    protected $table = 'ssl_certificates';

    protected $fillable = [
        'domain_id', 'provider', 'expiry_date', 'status',
    ];

    protected $casts = [
        'expiry_date' => 'date',
    ];

    public $timestamps = false;

    public function domain()
    {
        return $this->belongsTo(Domain::class);
    
}


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
