<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

class Expense extends Model
{
    protected $fillable = [
        'category', 'title', 'amount', 'payment_method', 'created_by', 'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public $timestamps = false;

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    
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
