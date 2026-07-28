<?php

namespace App\Modules\AI\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class LeadScore extends Model
{
    use HandlesTrash;
    use SoftDeletes;
    protected $fillable = ['lead_id', 'score', 'factors_json', 'calculated_at'];

    protected $casts = [
        'factors_json' => 'array',
        'calculated_at' => 'datetime',
    ];
}
