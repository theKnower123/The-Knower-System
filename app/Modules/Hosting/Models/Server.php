<?php

namespace App\Modules\Hosting\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class Server extends Model
{
    use \App\Traits\IsolatesClientData;
    use HandlesTrash;
    use SoftDeletes;
    use HasWorkspace, LogsActivity;

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
