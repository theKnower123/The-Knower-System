<?php

namespace App\Modules\CRM\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

class Contract extends Model
{
    protected $fillable = [
        'client_id', 'quotation_id', 'contract_number', 'start_date', 'end_date', 'status', 'file', 'amount'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    
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
