<?php

namespace App\Modules\Finance\Models;

use App\Modules\CRM\Models\Client;
use App\Modules\Projects\Models\Project;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class Invoice extends Model
{
    use HandlesTrash;
    use SoftDeletes;
    use HasWorkspace, LogsActivity;

    protected $fillable = [
        'client_id', 'project_id', 'invoice_number', 'amount', 'paid_amount', 'currency', 'status', 'due_date', 'notes',
    ];

    protected $casts = [
        'due_date' => 'date',
        'amount' => 'decimal:2',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    
}

    public function project()
    {
        return $this->belongsTo(Project::class);
    
}

    public function payments()
    {
        return $this->hasMany(Payment::class);
    
}


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
