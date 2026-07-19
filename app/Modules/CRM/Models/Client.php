<?php

namespace App\Modules\CRM\Models;

use App\Modules\Projects\Models\Project;
use App\Modules\Finance\Models\Invoice;
use App\Modules\Support\Models\Ticket;
use App\Modules\Hosting\Models\Domain;
use App\Modules\Hosting\Models\HostingAccount;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

class Client extends Model
{
    protected $fillable = [
        'name', 'email', 'phone', 'position', 'status',
    ];

    public function projects()      { return $this->hasMany(Project::class); 
}
    public function invoices()      { return $this->hasMany(Invoice::class); 
}
    public function quotations()    { return $this->hasMany(Quotation::class); 
}
    public function contracts()     { return $this->hasMany(Contract::class); 
}
    public function tickets()       { return $this->hasMany(Ticket::class); 
}
    public function domains()       { return $this->hasMany(Domain::class); 
}
    public function hostingAccounts() { return $this->hasMany(HostingAccount::class); 
}


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
