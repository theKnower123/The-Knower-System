<?php

namespace App\Modules\HR\Models;

use App\Modules\Auth\Models\User;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

class Employee extends Model
{
    protected $fillable = [
        'user_id', 'department', 'position', 'salary', 'hire_date', 'status',
        'address', 'id_number', 'id_photo'
    ];

    protected $casts = [
        'hire_date' => 'date',
        'salary' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    
}

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    
}

    public function leaves()
    {
        return $this->hasMany(Leave::class);
    
}


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
