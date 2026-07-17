<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

class Quotation extends Model
{
    protected $fillable = [
        'client_id', 'quotation_number', 'price', 'currency', 'status', 'valid_until', 'notes',
    ];

    protected $casts = [
        'valid_until' => 'date',
        'price' => 'decimal:2',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}

    public function contract()
    {
        return $this->hasOne(Contract::class);
    
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
