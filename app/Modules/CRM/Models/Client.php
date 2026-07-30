<?php

namespace App\Modules\CRM\Models;

use App\Modules\Projects\Models\Project;
use App\Modules\Finance\Models\Invoice;
use App\Modules\Support\Models\Ticket;
use App\Modules\Hosting\Models\Domain;
use App\Modules\Hosting\Models\HostingAccount;
use App\Modules\Auth\Models\User;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\HandlesTrash;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

class Client extends Model
{
    use \App\Traits\IsolatesClientData;
    use HasWorkspace, LogsActivity, SoftDeletes, HandlesTrash;

    protected $fillable = [
        'name', 'email', 'phone', 'position', 'status', 'user_id',
    ];

    public function projects()      { return $this->hasMany(Project::class); }
    public function invoices()      { return $this->hasMany(Invoice::class); }
    public function quotations()    { return $this->hasMany(Quotation::class); }
    public function contracts()     { return $this->hasMany(Contract::class); }
    public function tickets()       { return $this->hasMany(Ticket::class); }
    public function domains()       { return $this->hasMany(Domain::class); }
    public function hostingAccounts() { return $this->hasMany(HostingAccount::class); }

    // The Client Portal login account for this client, if one exists.
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function hasPortalAccess(): bool
    {
        return !is_null($this->user_id);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
