<?php

namespace App\Modules\CRM\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class Contract extends Model
{
    use \App\Traits\IsolatesClientData;
    use HandlesTrash;
    use SoftDeletes;
    use HasWorkspace, LogsActivity;

    protected $fillable = [
        'client_id', 'project_id', 'type', 'quotation_id', 'contract_number', 'start_date', 'end_date', 'status', 'file', 'amount'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function project()
    {
        return $this->belongsTo(\App\Modules\Projects\Models\Project::class);
    }

    public function quotation()
    {
        return $this->belongsTo(Quotation::class);
    }


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
