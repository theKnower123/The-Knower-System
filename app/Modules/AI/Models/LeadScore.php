<?php

namespace App\Modules\AI\Models;

use Illuminate\Database\Eloquent\Model;

class LeadScore extends Model
{
    protected $fillable = ['lead_id', 'score', 'factors_json', 'calculated_at'];

    protected $casts = [
        'factors_json' => 'array',
        'calculated_at' => 'datetime',
    ];
}
