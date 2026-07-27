<?php

namespace App\Modules\Marketing\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Marketing\Models\Campaign;
use App\Modules\Marketing\Requests\StoreCampaignRequest;
use Inertia\Inertia;

class CampaignController extends Controller
{
    public function index()
    {
        $campaigns = Campaign::with('metrics')
            ->withSum('metrics as total_cost', 'cost')
            ->withSum('metrics as total_leads', 'leads_generated')
            ->latest()
            ->paginate(20);

        return Inertia::render('Marketing/Campaigns', [
            'campaigns' => $campaigns,
        ]);
    }

    public function store(StoreCampaignRequest $request)
    {
        Campaign::create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
        ]);

        return back()->with('success', 'Campaign created.');
    }

    public function show(Campaign $campaign)
    {
        return Inertia::render('Marketing/CampaignDetail', [
            'campaign' => $campaign->load('metrics'),
            'cost_per_lead' => $campaign->costPerLead(),
        ]);
    }
}
