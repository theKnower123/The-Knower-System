<?php

namespace App\Modules\Marketing\Models;

use Illuminate\Database\Eloquent\Model;

class CampaignMetric extends Model
{
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
