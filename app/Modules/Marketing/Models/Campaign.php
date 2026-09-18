<?php

namespace App\Modules\Marketing\Models;

use App\Modules\Auth\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Campaign extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'workspace_tenancy_id', 'name', 'platform', 'objective',
        'budget', 'spent', 'status', 'landing_section_key',
        'start_date', 'end_date', 'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'budget' => 'decimal:2',
        'spent' => 'decimal:2',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function metrics()
    {
        return $this->hasMany(CampaignMetric::class);
    }

    // Matches the frontend's campaignTotals() exactly -- same shape,
    // same field names, so the API resource can return this as-is.
    public function totals(): array
    {
        $rows = $this->metrics;
        $reach = (int) $rows->sum('reach');
        $clicks = (int) $rows->sum('clicks');
        $cost = (float) $rows->sum('cost');
        $leads = (int) $rows->sum('leads_generated');
        $conversions = (int) $rows->sum('conversions');

        return [
            'reach' => $reach,
            'clicks' => $clicks,
            'cost' => $cost,
            'leads' => $leads,
            'conversions' => $conversions,
            'cpl' => $leads ? (int) round($cost / $leads) : 0,
        ];
    }

    public function costPerLead(): float
    {
        return $this->totals()['cpl'];
    }
}
