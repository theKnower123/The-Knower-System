<?php

namespace App\Modules\Marketing\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class Campaign extends Model
{
    use HandlesTrash;
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'workspace_tenancy_id', 'name', 'platform', 'objective',
        'budget', 'start_date', 'end_date', 'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'budget' => 'decimal:2',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function metrics()
    {
        return $this->hasMany(CampaignMetric::class);
    }

    public function costPerLead(): float
    {
        $totalCost = $this->metrics()->sum('cost');
        $totalLeads = $this->metrics()->sum('leads_generated');

        return $totalLeads > 0 ? round($totalCost / $totalLeads, 2) : 0.0;
    }
}
