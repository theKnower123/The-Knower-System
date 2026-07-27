<?php

namespace App\Modules\Finance\Models;

use App\Models\User;
use App\Modules\Projects\Models\Project;
use Illuminate\Database\Eloquent\Model;

class HourlyRate extends Model
{
    protected $fillable = ['user_id', 'project_id', 'rate_per_hour', 'currency', 'effective_from'];

    protected $casts = [
        'rate_per_hour' => 'decimal:2',
        'effective_from' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
