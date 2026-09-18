<?php

namespace App\Modules\CRM\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CRM\Models\Lead;
use App\Modules\CRM\Models\LeadFollowup;
use App\Modules\Marketing\Models\Campaign;
use App\Modules\Marketing\Models\CampaignMetric;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeadFollowupController extends Controller
{
    public function index(Request $request)
    {
        // Leads due soon or overdue
        $leadsDueSoon = Lead::with(['followups.creator', 'assignedAgent'])
            ->where(function ($query) {
                $query->whereNull('follow_up_date')
                    ->orWhere('follow_up_date', '<=', now()->addDays(7)->toDateString());
            })
            ->orderBy('follow_up_date', 'asc')
            ->get();

        $allLeads = Lead::with('followups')->latest()->paginate(25);

        $recentFollowups = LeadFollowup::with(['lead', 'creator'])
            ->latest()
            ->limit(30)
            ->get();

        return Inertia::render('Crm/SalesPipelineScheduler', [
            'leadsDueSoon' => $leadsDueSoon,
            'allLeads' => $allLeads,
            'recentFollowups' => $recentFollowups,
        ]);
    }

    public function store(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'channel' => ['required', 'string', 'in:call,email,whatsapp,meeting'],
            'notes' => ['required', 'string'],
            'outcome' => ['required', 'string', 'in:interested,callback_requested,proposal_sent,converted,not_interested'],
            'follow_up_date' => ['nullable', 'date'],
            'next_follow_up_date' => ['nullable', 'date'],
        ]);

        $followup = LeadFollowup::create([
            'lead_id' => $lead->id,
            'channel' => $validated['channel'],
            'notes' => $validated['notes'],
            'outcome' => $validated['outcome'],
            'follow_up_date' => $validated['follow_up_date'] ?? now()->toDateString(),
            'next_follow_up_date' => $validated['next_follow_up_date'] ?? null,
            'created_by' => $request->user()->id,
        ]);

        // Update lead status and follow_up_date
        $leadData = [
            'follow_up_date' => $validated['next_follow_up_date'] ?? $validated['follow_up_date'] ?? now()->toDateString(),
        ];

        if ($validated['outcome'] === 'converted') {
            $leadData['status'] = 'won';
        } elseif ($validated['outcome'] === 'proposal_sent') {
            $leadData['status'] = 'proposal';
        } elseif ($validated['outcome'] === 'not_interested') {
            $leadData['status'] = 'lost';
        } elseif ($validated['outcome'] === 'interested') {
            $leadData['status'] = 'contacted';
        }

        $lead->update($leadData);

        // Auto-create reminder notification for sales rep
        if (!empty($validated['next_follow_up_date'])) {
            \App\Modules\Core\Models\Notification::create([
                'user_id' => $request->user()->id,
                'title' => "Follow-up Reminder: {$lead->name}",
                'message' => "Scheduled follow-up for lead {$lead->name} via {$validated['channel']}.",
                'type' => 'reminder',
                'link' => '/crm/leads/followups',
            ]);
        }

        activity()
            ->causedBy($request->user())
            ->performedOn($lead)
            ->log("Logged {$validated['channel']} follow-up for lead {$lead->name} (Outcome: {$validated['outcome']})");

        return back()->with('success', 'Follow-up logged successfully.');
    }

    public function salesReports(Request $request)
    {
        // Leads by source breakdown
        $leadsBySource = Lead::selectRaw('COALESCE(source, "Direct / Contact Form") as source_name, COUNT(*) as total_leads')
            ->groupBy('source_name')
            ->get();

        // Lead conversion rates
        $totalLeads = Lead::count();
        $convertedLeads = Lead::where('status', 'won')->count();
        $conversionRate = $totalLeads > 0 ? round(($convertedLeads / $totalLeads) * 100, 2) : 0;

        // CPL per platform
        $cplPerPlatform = CampaignMetric::selectRaw('campaigns.platform, SUM(campaign_metrics.cost) as total_cost, SUM(campaign_metrics.leads_generated) as total_leads')
            ->join('campaigns', 'campaign_metrics.campaign_id', '=', 'campaigns.id')
            ->groupBy('campaigns.platform')
            ->get()
            ->map(function ($row) {
                $row->cpl = $row->total_leads > 0 ? round($row->total_cost / $row->total_leads, 2) : 0;
                return $row;
            });

        // Top performing campaign
        $topCampaign = Campaign::withSum('metrics as total_leads', 'leads_generated')
            ->orderBy('total_leads', 'desc')
            ->first();

        return response()->json([
            'success' => true,
            'leads_by_source' => $leadsBySource,
            'conversion_rate' => $conversionRate,
            'total_leads' => $totalLeads,
            'converted_leads' => $convertedLeads,
            'cpl_per_platform' => $cplPerPlatform,
            'top_campaign' => $topCampaign,
        ]);
    }
}
