<?php

namespace App\Modules\Marketing\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class CampaignMetric extends Model
{
    use HandlesTrash;
    use SoftDeletes;
    protected $fillable = [
        'campaign_id', 'date', 'reach', 'clicks', 'cost', 'leads_generated',
    ];

    protected $casts = [
        'date' => 'date',
        'cost' => 'decimal:2',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }
}
