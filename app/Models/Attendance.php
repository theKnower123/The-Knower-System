<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

class Attendance extends Model
{
    protected $table = 'attendance';

    protected $fillable = [
        'employee_id', 'date', 'check_in', 'check_out', 'status',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public $timestamps = false;

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    
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
