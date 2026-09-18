// Real-backend replacement for @/mocks/marketing-ops.
//
// Every export here has the SAME NAME AND SIGNATURE as the mock store
// version, so switching a page over is a one-line import change:
//
//   - import { useMarketing, addAccount, ... } from "@/mocks/marketing-ops";
//   + import { useMarketing, addAccount, ... } from "@/lib/marketing-api";
//
// No other line in any page needs to change. Field names returned by the
// API (camelCase) match the TS interfaces from marketing-ops.ts exactly.

import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  SocialAccount, TeamMember, Post, Campaign, CampaignMetric,
  PortfolioEntry, Testimonial, LandingSection, FollowUp,
  LeadAttribution, ActivityLog, Platform, PostStatus, CampaignObjective,
  ID,
} from "@/mocks/marketing-ops";

export type {
  SocialAccount, TeamMember, Post, Campaign, CampaignMetric,
  PortfolioEntry, Testimonial, LandingSection, FollowUp,
  LeadAttribution, ActivityLog, Platform, PostStatus, CampaignObjective, ID,
};
export { PLATFORM_LABELS, ALL_PLATFORMS } from "@/mocks/marketing-ops";

interface Bootstrap {
  team: TeamMember[]; socialAccounts: SocialAccount[]; posts: Post[];
  campaigns: Campaign[]; campaignMetrics: CampaignMetric[];
  portfolioEntries: PortfolioEntry[]; testimonials: Testimonial[];
  landingSections: LandingSection[]; followUps: FollowUp[];
  leadAttribution: LeadAttribution[]; activityLogs: ActivityLog[];
}

const BOOTSTRAP_KEY = ["marketing-ops", "bootstrap"];

function useBootstrap() {
  return useQuery<Bootstrap>({
    queryKey: BOOTSTRAP_KEY,
    queryFn: async () => (await axios.get("/api/v1/marketing-ops/bootstrap")).data,
    staleTime: 10_000,
  });
}

// Drop-in replacement for useMarketing(key) -- same call shape as before.
export function useMarketing<K extends keyof Bootstrap>(key: K): Bootstrap[K] {
  const { data } = useBootstrap();
  return (data?.[key] ?? []) as Bootstrap[K];
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: BOOTSTRAP_KEY });
}

// NOTE: these mutation helpers are plain async functions (matching the old
// synchronous-looking store API), but they're now real network calls. Each
// page already calls them inside onClick/onSubmit handlers, which works
// fine with async functions in React -- no page changes needed there.
// Cache invalidation on each call is handled via a module-level query
// client reference set by <MarketingApiProvider> (see bottom of file).

let _qc: ReturnType<typeof useQueryClient> | null = null;
export function MarketingApiProvider({ children }: { children: React.ReactNode }) {
  _qc = useQueryClient();
  return children as React.ReactElement;
}
function invalidate() {
  _qc?.invalidateQueries({ queryKey: BOOTSTRAP_KEY });
}

// ---------- Accounts ----------
export async function addAccount(a: { platform: Platform; handle: string }) {
  await axios.post("/api/v1/marketing-ops/accounts", a);
  invalidate();
}
export async function setAccountStatus(id: ID, status: "active" | "disconnected") {
  await axios.patch(`/api/v1/marketing-ops/accounts/${id}/status`, { status });
  invalidate();
}
export async function setAccountTeam(id: ID, userIds: ID[]) {
  await axios.patch(`/api/v1/marketing-ops/accounts/${id}/team`, { user_ids: userIds });
  invalidate();
}

// ---------- Posts ----------
export async function addPost(p: {
  content: string; mediaLabel?: string; status: "draft" | "pending_approval" | "scheduled";
  scheduledAt: string; accountIds: ID[];
}) {
  await axios.post("/api/v1/marketing-ops/posts", p);
  invalidate();
}
export async function setPostStatus(id: ID, status: PostStatus, _actor?: string, note?: string) {
  await axios.patch(`/api/v1/marketing-ops/posts/${id}/status`, { status, note });
  invalidate();
}

// ---------- Campaigns ----------
export async function addCampaign(c: {
  name: string; platform: Platform; objective: CampaignObjective; budget: number;
  startDate: string; endDate: string; landingSectionKey?: string;
}) {
  await axios.post("/api/v1/marketing-ops/campaigns", c);
  invalidate();
}
export async function updateCampaign(id: ID, patch: Partial<Campaign>) {
  await axios.patch(`/api/v1/marketing-ops/campaigns/${id}`, patch);
  invalidate();
}
export async function fetchCampaignAnalytics(id: ID) {
  return (await axios.get(`/api/v1/marketing-ops/campaigns/${id}/analytics`)).data;
}

// ---------- Portfolio / Landing / Testimonials ----------
export async function togglePortfolioVisible(id: ID, _actor?: string) {
  await axios.post(`/api/v1/marketing-ops/portfolio/${id}/toggle`);
  invalidate();
}
export async function updatePortfolioEntry(id: ID, patch: Partial<PortfolioEntry>, _actor?: string) {
  await axios.patch(`/api/v1/marketing-ops/portfolio/${id}`, patch);
  invalidate();
}
export async function toggleSection(id: ID, _actor?: string) {
  await axios.post(`/api/v1/marketing-ops/sections/${id}/toggle`);
  invalidate();
}
export async function moveSection(id: ID, dir: -1 | 1, actor: string) {
  // The old store computed the swap client-side; simplest server-safe
  // equivalent is to re-send the whole visible order after a local swap.
  // Pages call this rarely enough that a full reorder call is fine here.
  const qc = _qc;
  const data = qc?.getQueryData<Bootstrap>(BOOTSTRAP_KEY);
  if (!data) return;
  const sorted = [...data.landingSections].sort((a, b) => a.sortOrder - b.sortOrder);
  const idx = sorted.findIndex((s) => s.id === id);
  const swap = idx + dir;
  if (idx < 0 || swap < 0 || swap >= sorted.length) return;
  [sorted[idx], sorted[swap]] = [sorted[swap], sorted[idx]];
  await axios.post("/api/v1/marketing-ops/sections/reorder", { order: sorted.map((s) => s.id) });
  invalidate();
}
export async function addTestimonial(t: {
  clientName: string; anonymous: boolean; quote: string; rating: number; projectId?: ID;
}) {
  await axios.post("/api/v1/marketing-ops/testimonials", t);
  invalidate();
}
export async function toggleTestimonial(id: ID, _actor?: string) {
  await axios.post(`/api/v1/marketing-ops/testimonials/${id}/toggle`);
  invalidate();
}

// ---------- Pipeline ----------
export async function addFollowUp(f: {
  leadId: ID; channel: "call" | "email" | "whatsapp"; notes: string; nextFollowUpAt?: string;
}) {
  await axios.post("/api/v1/marketing-ops/follow-ups", f);
  invalidate();
}

// ---------- Analytics ----------
export function useMarketingKpis() {
  const { data } = useQuery({
    queryKey: ["marketing-ops", "kpis"],
    queryFn: async () => (await axios.get("/api/v1/marketing-ops/kpis")).data,
  });
  return data ?? {
    activeAccounts: 0, activeCampaigns: 0, pendingApprovals: 0, scheduledPosts: 0,
    spend: 0, leads: 0, conversions: 0, cpl: 0, conversionRate: 0, visibleShowcase: 0,
  };
}
export function useLeadsBySource() {
  const { data } = useQuery({
    queryKey: ["marketing-ops", "leads-by-source"],
    queryFn: async () => (await axios.get("/api/v1/marketing-ops/leads-by-source")).data,
  });
  return data ?? [];
}

// campaignTotals(id) was synchronous in the mock store (computed from
// in-memory campaignMetrics). Kept synchronous here too, computed from
// whatever campaignMetrics the bootstrap query already has cached --
// no extra request needed since bootstrap() already returns all metrics.
export function campaignTotals(campaignId: ID) {
  const data = _qc?.getQueryData<Bootstrap>(BOOTSTRAP_KEY);
  const rows = (data?.campaignMetrics ?? []).filter((m) => m.campaignId === campaignId);
  const reach = rows.reduce((s, r) => s + r.reach, 0);
  const clicks = rows.reduce((s, r) => s + r.clicks, 0);
  const cost = rows.reduce((s, r) => s + r.cost, 0);
  const leads = rows.reduce((s, r) => s + r.leadsGenerated, 0);
  const conversions = rows.reduce((s, r) => s + r.conversions, 0);
  return { reach, clicks, cost, leads, conversions, cpl: leads ? Math.round(cost / leads) : 0 };
}

// marketingKpis()/leadsBySource() were synchronous in the mock store.
// Prefer useMarketingKpis()/useLeadsBySource() hooks above in new code;
// these sync fallbacks are kept only so existing page code that calls
// them directly (outside a hook) doesn't hard-crash -- they read from
// whatever's already cached rather than fetching.
export function marketingKpis() {
  const data = _qc?.getQueryData<Bootstrap>(BOOTSTRAP_KEY);
  const campaigns = data?.campaigns ?? [];
  let spend = 0, leads = 0, conversions = 0;
  for (const c of campaigns) {
    const t = campaignTotals(c.id);
    spend += t.cost; leads += t.leads; conversions += t.conversions;
  }
  return {
    activeAccounts: (data?.socialAccounts ?? []).filter((a) => a.status === "active").length,
    activeCampaigns: campaigns.filter((c) => c.status === "active").length,
    pendingApprovals: (data?.posts ?? []).filter((p) => p.status === "pending_approval").length,
    scheduledPosts: (data?.posts ?? []).filter((p) => p.status === "scheduled").length,
    spend, leads, conversions,
    cpl: leads ? Math.round(spend / leads) : 0,
    conversionRate: leads ? Math.round((conversions / leads) * 100) : 0,
    visibleShowcase: (data?.portfolioEntries ?? []).filter((p) => p.isVisible).length,
  };
}
export function leadsBySource() {
  const data = _qc?.getQueryData<Bootstrap>(BOOTSTRAP_KEY);
  const map = new Map<string, number>();
  for (const a of data?.leadAttribution ?? []) map.set(a.source, (map.get(a.source) ?? 0) + 1);
  for (const c of data?.campaigns ?? []) {
    const t = campaignTotals(c.id);
    const label = c.platform + " Ad";
    map.set(label, (map.get(label) ?? 0) + t.leads);
  }
  return [...map.entries()].map(([source, count]) => ({ source, count }));
}
