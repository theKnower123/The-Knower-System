<?php

namespace App\Modules\Hosting\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class SslCertificate extends Model
{
    use \App\Traits\IsolatesClientData;
    use HandlesTrash;
    use SoftDeletes;
    use HasWorkspace, LogsActivity;

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
