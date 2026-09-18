<?php

namespace App\Modules\Marketing\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Models\User;
use App\Modules\CRM\Models\Lead;
use App\Modules\CMS\Models\PortfolioEntry;
use App\Modules\CMS\Models\LandingSection;
use App\Modules\CMS\Models\Testimonial;
use App\Modules\Marketing\Models\Campaign;
use App\Modules\Marketing\Models\CampaignMetric;
use App\Modules\Marketing\Models\FollowUp;
use App\Modules\Marketing\Models\LeadAttribution;
use App\Modules\Marketing\Models\MarketingActivityLog;
use App\Modules\Marketing\Models\Post;
use App\Modules\Marketing\Models\SocialAccount;
use App\Modules\Marketing\Resources\ActivityLogResource;
use App\Modules\Marketing\Resources\CampaignMetricResource;
use App\Modules\Marketing\Resources\CampaignResource;
use App\Modules\Marketing\Resources\FollowUpResource;
use App\Modules\Marketing\Resources\LandingSectionResource;
use App\Modules\Marketing\Resources\LeadAttributionResource;
use App\Modules\Marketing\Resources\PortfolioEntryResource;
use App\Modules\Marketing\Resources\PostResource;
use App\Modules\Marketing\Resources\SocialAccountResource;
use App\Modules\Marketing\Resources\TeamMemberResource;
use App\Modules\Marketing\Resources\TestimonialResource;
use Illuminate\Http\Request;

/**
 * Single controller backing the "marketing-ops" store the frontend was
 * built against. One bootstrap() call replaces the whole in-memory mock
 * state object; every mutation method mirrors a store function 1:1
 * (addAccount -> storeAccount, setAccountStatus -> setAccountStatus, etc.)
 * so the frontend pages barely need to change -- only the adapter file
 * (resources/js/lib/marketing-api.ts) talks to these routes.
 */
class MarketingOpsController extends Controller
{
    const MARKETING_ROLES = ['marketing_admin', 'social_manager', 'ads_specialist', 'content_creator'];

    public function bootstrap()
    {
        return response()->json([
            'team' => TeamMemberResource::collection(
                User::whereIn('role', self::MARKETING_ROLES)->get()
            ),
            'socialAccounts' => SocialAccountResource::collection(
                SocialAccount::with(['connectedBy', 'assignedUsers'])->get()
            ),
            'posts' => PostResource::collection(
                Post::with(['creator', 'approver', 'accounts'])->latest()->get()
            ),
            'campaigns' => CampaignResource::collection(
                Campaign::with('creator')->latest()->get()
            ),
            'campaignMetrics' => CampaignMetricResource::collection(
                CampaignMetric::orderBy('date')->get()
            ),
            'portfolioEntries' => PortfolioEntryResource::collection(
                PortfolioEntry::with('project.client')->get()
            ),
            'testimonials' => TestimonialResource::collection(
                Testimonial::with('client')->latest()->get()
            ),
            'landingSections' => LandingSectionResource::collection(
                LandingSection::with('updatedBy')->orderBy('sort_order')->get()
            ),
            'followUps' => FollowUpResource::collection(
                FollowUp::with('creator')->latest('date')->get()
            ),
            'leadAttribution' => LeadAttributionResource::collection(
                LeadAttribution::all()
            ),
            'activityLogs' => ActivityLogResource::collection(
                MarketingActivityLog::latest('at')->limit(200)->get()
            ),
        ]);
    }

    // ---------- Accounts ----------

    public function storeAccount(Request $request)
    {
        $data = $request->validate([
            'platform' => ['required', 'string'],
            'handle' => ['required', 'string', 'max:255'],
        ]);

        $account = SocialAccount::create([
            'platform' => $data['platform'],
            'handle' => $data['handle'],
            'connected_by' => $request->user()->id,
            'status' => 'active',
            'followers' => 0,
        ]);

        MarketingActivityLog::record($request->user()->name, 'Connected account', "{$data['platform']} {$data['handle']}");

        return new SocialAccountResource($account->load(['connectedBy', 'assignedUsers']));
    }

    public function setAccountStatus(Request $request, SocialAccount $account)
    {
        $data = $request->validate(['status' => ['required', 'in:active,disconnected']]);
        $account->update(['status' => $data['status']]);

        MarketingActivityLog::record(
            $request->user()->name,
            $data['status'] === 'active' ? 'Reconnected account' : 'Disconnected account',
            $account->handle
        );

        return new SocialAccountResource($account->load(['connectedBy', 'assignedUsers']));
    }

    public function setAccountTeam(Request $request, SocialAccount $account)
    {
        $data = $request->validate(['user_ids' => ['array'], 'user_ids.*' => ['exists:users,id']]);
        $account->assignedUsers()->sync($data['user_ids'] ?? []);

        return new SocialAccountResource($account->load(['connectedBy', 'assignedUsers']));
    }

    // ---------- Posts ----------

    public function storePost(Request $request)
    {
        $data = $request->validate([
            'content' => ['required', 'string'],
            'mediaLabel' => ['nullable', 'string'],
            'status' => ['required', 'in:draft,pending_approval,scheduled'],
            'scheduledAt' => ['required', 'date'],
            'accountIds' => ['required', 'array', 'min:1'],
            'accountIds.*' => ['exists:social_accounts,id'],
        ]);

        $post = Post::create([
            'content' => $data['content'],
            'media_label' => $data['mediaLabel'] ?? null,
            'status' => $data['status'],
            'scheduled_at' => $data['scheduledAt'],
            'created_by' => $request->user()->id,
        ]);
        $post->accounts()->sync($data['accountIds']);

        MarketingActivityLog::record($request->user()->name, 'Created post', str($data['content'])->limit(40));

        return new PostResource($post->load(['creator', 'approver', 'accounts']));
    }

    public function setPostStatus(Request $request, Post $post)
    {
        $data = $request->validate([
            'status' => ['required', 'in:draft,pending_approval,changes_requested,scheduled,published'],
            'note' => ['nullable', 'string'],
        ]);

        $patch = ['status' => $data['status'], 'note' => $data['note'] ?? $post->note];
        if (in_array($data['status'], ['scheduled', 'published'])) {
            $patch['approved_by'] = $request->user()->id;
        }
        if ($data['status'] === 'published') {
            $patch['published_at'] = now();
        }
        $post->update($patch);

        MarketingActivityLog::record(
            $request->user()->name,
            'Post → '.str_replace('_', ' ', $data['status']),
            str($post->content)->limit(40)
        );

        return new PostResource($post->load(['creator', 'approver', 'accounts']));
    }

    // ---------- Campaigns ----------

    public function storeCampaign(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'platform' => ['required', 'string'],
            'objective' => ['required', 'in:traffic,leads,awareness'],
            'budget' => ['required', 'numeric', 'min:0'],
            'startDate' => ['required', 'date'],
            'endDate' => ['required', 'date', 'after_or_equal:startDate'],
            'landingSectionKey' => ['nullable', 'string'],
        ]);

        $campaign = Campaign::create([
            'name' => $data['name'],
            'platform' => $data['platform'],
            'objective' => $data['objective'],
            'budget' => $data['budget'],
            'spent' => 0,
            'status' => 'draft',
            'start_date' => $data['startDate'],
            'end_date' => $data['endDate'],
            'landing_section_key' => $data['landingSectionKey'] ?? null,
            'created_by' => $request->user()->id,
        ]);

        MarketingActivityLog::record($request->user()->name, 'Created campaign', $campaign->name);

        return new CampaignResource($campaign->load('creator'));
    }

    public function updateCampaign(Request $request, Campaign $campaign)
    {
        $data = $request->validate(['status' => ['sometimes', 'in:draft,active,paused,ended']]);
        $campaign->update($data);

        return new CampaignResource($campaign->load('creator'));
    }

    public function campaignAnalytics(Campaign $campaign)
    {
        return response()->json([
            'campaign' => new CampaignResource($campaign->load('creator')),
            'totals' => $campaign->totals(),
            'metrics' => CampaignMetricResource::collection($campaign->metrics()->orderBy('date')->get()),
        ]);
    }

    // ---------- Landing / Portfolio / Testimonials ----------

    public function togglePortfolioVisible(Request $request, PortfolioEntry $entry)
    {
        if (! $entry->is_visible && ! $entry->client_approved) {
            return response()->json(['message' => 'Client has not approved public display yet.'], 422);
        }

        $entry->update(['is_visible' => ! $entry->is_visible]);

        MarketingActivityLog::record(
            $request->user()->name,
            $entry->is_visible ? 'Showed on landing page' : 'Hid from landing page',
            'Featured Work → '.($entry->title ?? $entry->project?->name)
        );

        return new PortfolioEntryResource($entry->load('project.client'));
    }

    public function updatePortfolioEntry(Request $request, PortfolioEntry $entry)
    {
        $data = $request->validate([
            'coverImage' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'tags' => ['nullable', 'array'],
            'showClientName' => ['boolean'],
        ]);

        $entry->update([
            'cover_image' => $data['coverImage'] ?? $entry->cover_image,
            'description' => $data['description'] ?? $entry->description,
            'tags' => $data['tags'] ?? $entry->tags,
            'show_client_name' => $data['showClientName'] ?? $entry->show_client_name,
        ]);

        MarketingActivityLog::record($request->user()->name, 'Edited showcase entry', $entry->title ?? (string) $entry->id);

        return new PortfolioEntryResource($entry->load('project.client'));
    }

    public function toggleSection(Request $request, LandingSection $section)
    {
        $section->update(['is_visible' => ! $section->is_visible, 'updated_by' => $request->user()->id]);

        MarketingActivityLog::record($request->user()->name, $section->is_visible ? 'Showed section' : 'Hid section', $section->label ?? $section->section_key);

        return new LandingSectionResource($section->load('updatedBy'));
    }

    public function reorderSections(Request $request)
    {
        $data = $request->validate(['order' => ['required', 'array'], 'order.*' => ['exists:landing_sections,id']]);

        foreach ($data['order'] as $i => $id) {
            LandingSection::whereKey($id)->update(['sort_order' => $i + 1, 'updated_by' => $request->user()->id]);
        }

        MarketingActivityLog::record($request->user()->name, 'Reordered sections', '');

        return LandingSectionResource::collection(LandingSection::with('updatedBy')->orderBy('sort_order')->get());
    }

    public function storeTestimonial(Request $request)
    {
        $data = $request->validate([
            'clientName' => ['nullable', 'string', 'max:255'],
            'anonymous' => ['boolean'],
            'quote' => ['required', 'string'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'projectId' => ['nullable', 'exists:projects,id'],
        ]);

        $testimonial = Testimonial::create([
            'client_name' => $data['anonymous'] ?? false ? null : ($data['clientName'] ?? null),
            'anonymous' => $data['anonymous'] ?? false,
            'quote' => $data['quote'],
            'rating' => $data['rating'],
            'project_id' => $data['projectId'] ?? null,
            'is_approved' => false,
        ]);

        return new TestimonialResource($testimonial->load('client'));
    }

    public function toggleTestimonial(Request $request, Testimonial $testimonial)
    {
        $testimonial->update(['is_approved' => ! $testimonial->is_approved]);

        MarketingActivityLog::record(
            $request->user()->name,
            $testimonial->is_approved ? 'Approved testimonial' : 'Unpublished testimonial',
            $testimonial->client_name ?? 'Anonymous'
        );

        return new TestimonialResource($testimonial->load('client'));
    }

    // ---------- Pipeline ----------

    public function storeFollowUp(Request $request)
    {
        $data = $request->validate([
            'leadId' => ['required', 'exists:leads,id'],
            'channel' => ['required', 'in:call,email,whatsapp'],
            'notes' => ['required', 'string'],
            'nextFollowUpAt' => ['nullable', 'date'],
        ]);

        $followUp = FollowUp::create([
            'lead_id' => $data['leadId'],
            'date' => now(),
            'channel' => $data['channel'],
            'notes' => $data['notes'],
            'next_follow_up_at' => $data['nextFollowUpAt'] ?? null,
            'created_by' => $request->user()->id,
        ]);

        return new FollowUpResource($followUp->load('creator'));
    }

    // ---------- Analytics (mirrors marketingKpis() / leadsBySource() in the store) ----------

    public function kpis()
    {
        $campaigns = Campaign::with('metrics')->get();
        $spend = 0; $leads = 0; $conversions = 0;
        foreach ($campaigns as $c) {
            $t = $c->totals();
            $spend += $t['cost']; $leads += $t['leads']; $conversions += $t['conversions'];
        }

        return response()->json([
            'activeAccounts' => SocialAccount::where('status', 'active')->count(),
            'activeCampaigns' => Campaign::where('status', 'active')->count(),
            'pendingApprovals' => Post::where('status', 'pending_approval')->count(),
            'scheduledPosts' => Post::where('status', 'scheduled')->count(),
            'spend' => $spend,
            'leads' => $leads,
            'conversions' => $conversions,
            'cpl' => $leads ? (int) round($spend / $leads) : 0,
            'conversionRate' => $leads ? (int) round(($conversions / $leads) * 100) : 0,
            'visibleShowcase' => PortfolioEntry::where('is_visible', true)->count(),
        ]);
    }

    public function leadsBySource()
    {
        $map = [];
        foreach (LeadAttribution::all() as $a) {
            $map[$a->source] = ($map[$a->source] ?? 0) + 1;
        }
        foreach (Campaign::with('metrics')->get() as $c) {
            $label = ucfirst($c->platform).' Ad';
            $map[$label] = ($map[$label] ?? 0) + $c->totals()['leads'];
        }

        return response()->json(collect($map)->map(fn ($count, $source) => compact('source', 'count'))->values());
    }
}
