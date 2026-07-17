<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

class Payment extends Model
{
    protected $fillable = [
        'invoice_id', 'method', 'amount', 'paid_at', 'reference',
    ];

    protected $casts = [
        'paid_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    public $timestamps = false;

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    
}


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
