<?php

namespace App\Modules\Marketing\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Marketing\Models\Campaign;
use App\Modules\Marketing\Models\CampaignMetric;
use App\Modules\Marketing\Requests\StoreCampaignRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CampaignController extends Controller
{
    public function index(Request $request)
    {
        $campaigns = Campaign::with('metrics')
            ->withSum('metrics as total_cost', 'cost')
            ->withSum('metrics as total_leads', 'leads_generated')
            ->withSum('metrics as total_clicks', 'clicks')
            ->withSum('metrics as total_reach', 'reach')
            ->latest()
            ->paginate(20);

        return Inertia::render('Marketing/Campaigns', [
            'campaigns' => $campaigns,
        ]);
    }

    public function store(StoreCampaignRequest $request)
    {
        $campaign = Campaign::create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
        ]);

        // Seed initial campaign metric entry
        CampaignMetric::create([
            'campaign_id' => $campaign->id,
            'date' => now()->toDateString(),
            'reach' => rand(500, 2000),
            'clicks' => rand(50, 200),
            'cost' => rand(20, 100),
            'leads_generated' => rand(2, 10),
        ]);

        activity()
            ->causedBy($request->user())
            ->performedOn($campaign)
            ->log("Created campaign {$campaign->name} on platform {$campaign->platform}");

        return back()->with('success', 'Campaign created.');
    }

    public function show(Campaign $campaign)
    {
        return Inertia::render('Marketing/CampaignDetail', [
            'campaign' => $campaign->load('metrics'),
            'cost_per_lead' => $campaign->costPerLead(),
        ]);
    }

    public function analytics(Request $request)
    {
        $range = $request->query('range', '30d'); // 7d, 30d, 90d, all
        $platform = $request->query('platform', 'all');

        $query = CampaignMetric::query()->with('campaign');

        if ($platform !== 'all') {
            $query->whereHas('campaign', function ($q) use ($platform) {
                $q->where('platform', $platform);
            });
        }

        if ($range === '7d') {
            $query->where('date', '>=', now()->subDays(7)->toDateString());
        } elseif ($range === '30d') {
            $query->where('date', '>=', now()->subDays(30)->toDateString());
        } elseif ($range === '90d') {
            $query->where('date', '>=', now()->subDays(90)->toDateString());
        }

        $metrics = $query->orderBy('date', 'asc')->get();

        $platformBreakdown = CampaignMetric::selectRaw('campaigns.platform, SUM(campaign_metrics.reach) as reach, SUM(campaign_metrics.clicks) as clicks, SUM(campaign_metrics.cost) as cost, SUM(campaign_metrics.leads_generated) as leads')
            ->join('campaigns', 'campaign_metrics.campaign_id', '=', 'campaigns.id')
            ->groupBy('campaigns.platform')
            ->get();

        return response()->json([
            'success' => true,
            'range' => $range,
            'platform' => $platform,
            'metrics' => $metrics,
            'platform_breakdown' => $platformBreakdown,
            'totals' => [
                'total_reach' => $metrics->sum('reach'),
                'total_clicks' => $metrics->sum('clicks'),
                'total_cost' => (float) $metrics->sum('cost'),
                'total_leads' => $metrics->sum('leads_generated'),
                'avg_cpl' => $metrics->sum('leads_generated') > 0 ? round($metrics->sum('cost') / $metrics->sum('leads_generated'), 2) : 0,
            ]
        ]);
    }
}
