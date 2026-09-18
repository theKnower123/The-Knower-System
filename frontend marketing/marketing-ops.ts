// Sales & Digital Marketing module — mock data + reactive in-memory store
import { useSyncExternalStore } from "react";

export type ID = string;
const uid = (p: string) => `${p}_${Math.random().toString(36).slice(2, 9)}`;
const iso = (days = 0, hours = 0) =>
  new Date(Date.now() + days * 86_400_000 + hours * 3_600_000).toISOString();

export type Platform =
  | "facebook" | "instagram" | "tiktok" | "linkedin" | "x" | "youtube" | "whatsapp";
export type AccountStatus = "active" | "disconnected";
export type PostStatus = "draft" | "pending_approval" | "changes_requested" | "scheduled" | "published";
export type CampaignObjective = "traffic" | "leads" | "awareness";
export type ShowcaseTag = "Web" | "Mobile" | "Desktop" | "System";

export interface SocialAccount {
  id: ID; platform: Platform; handle: string; connectedBy: string;
  status: AccountStatus; followers: number; connectedAt: string;
  assignedTeam: ID[];
}
export interface TeamMember { id: ID; name: string; role: string; avatarColor: string; }
export interface Post {
  id: ID; content: string; mediaLabel?: string; status: PostStatus;
  scheduledAt: string; publishedAt?: string; createdBy: string;
  approvedBy?: string; accountIds: ID[]; note?: string;
  reach?: number; engagement?: number;
}
export interface Campaign {
  id: ID; name: string; platform: Platform; objective: CampaignObjective;
  budget: number; spent: number; startDate: string; endDate: string;
  createdBy: string; status: "draft" | "active" | "paused" | "ended";
  landingSectionKey?: string;
}
export interface CampaignMetric {
  id: ID; campaignId: ID; date: string; reach: number; clicks: number;
  cost: number; leadsGenerated: number; conversions: number;
}
export interface PortfolioEntry {
  id: ID; projectId: ID; title: string; clientApproved: boolean; isVisible: boolean;
  coverImage: string; description: string; tags: ShowcaseTag[]; showClientName: boolean;
  clientLabel: string;
}
export interface Testimonial {
  id: ID; clientName: string; anonymous: boolean; quote: string; rating: number;
  projectId?: ID; isApproved: boolean; createdAt: string;
}
export interface LandingSection {
  id: ID; sectionKey: string; label: string; isVisible: boolean; sortOrder: number;
  updatedBy: string; updatedAt: string;
}
export interface FollowUp {
  id: ID; leadId: ID; date: string; channel: "call" | "email" | "whatsapp";
  notes: string; nextFollowUpAt?: string; createdBy: string;
}
export interface LeadAttribution {
  id: ID; leadId: ID; source: string; utmSource?: string; utmCampaign?: string; utmMedium?: string;
}
export interface ActivityLog {
  id: ID; actor: string; action: string; target: string; at: string;
}

// ---------- Seeds ----------
export const team: TeamMember[] = [
  { id: "tm_1", name: "Mariam Fouad", role: "Marketing Admin", avatarColor: "bg-primary/15 text-primary" },
  { id: "tm_2", name: "Tarek Nabil", role: "Social Media Manager", avatarColor: "bg-emerald-500/15 text-emerald-500" },
  { id: "tm_3", name: "Dina Kamal", role: "Social Media Manager", avatarColor: "bg-sky-500/15 text-sky-500" },
  { id: "tm_4", name: "Yousef Rami", role: "Ads Specialist", avatarColor: "bg-amber-500/15 text-amber-500" },
  { id: "tm_5", name: "Hana Zaki", role: "Content Writer/Designer", avatarColor: "bg-fuchsia-500/15 text-fuchsia-500" },
];

export const socialAccounts: SocialAccount[] = [
  { id: "sa_fb", platform: "facebook", handle: "@theknower", connectedBy: "Mariam Fouad", status: "active", followers: 48200, connectedAt: iso(-220), assignedTeam: ["tm_2"] },
  { id: "sa_ig", platform: "instagram", handle: "@theknower.io", connectedBy: "Mariam Fouad", status: "active", followers: 31400, connectedAt: iso(-210), assignedTeam: ["tm_2", "tm_3"] },
  { id: "sa_li", platform: "linkedin", handle: "the-knower", connectedBy: "Mariam Fouad", status: "active", followers: 18900, connectedAt: iso(-180), assignedTeam: ["tm_3"] },
  { id: "sa_tt", platform: "tiktok", handle: "@knowerlabs", connectedBy: "Tarek Nabil", status: "active", followers: 12750, connectedAt: iso(-95), assignedTeam: ["tm_2"] },
  { id: "sa_x", platform: "x", handle: "@knower_os", connectedBy: "Tarek Nabil", status: "disconnected", followers: 9400, connectedAt: iso(-300), assignedTeam: [] },
  { id: "sa_yt", platform: "youtube", handle: "The Knower", connectedBy: "Mariam Fouad", status: "active", followers: 6300, connectedAt: iso(-150), assignedTeam: ["tm_5"] },
  { id: "sa_wa", platform: "whatsapp", handle: "+20 100 555 7788", connectedBy: "Mariam Fouad", status: "active", followers: 0, connectedAt: iso(-60), assignedTeam: ["tm_3"] },
];

export const posts: Post[] = [
  { id: "po_1", content: "Case study drop: how Nile Pharma cut order processing time by 63% with The Knower OS.", mediaLabel: "case-study-cover.png", status: "published", scheduledAt: iso(-6), publishedAt: iso(-6), createdBy: "Hana Zaki", approvedBy: "Mariam Fouad", accountIds: ["sa_li", "sa_fb"], reach: 22400, engagement: 1840 },
  { id: "po_2", content: "AI routing inside your ERP — 90 seconds, no slides. 🎬", mediaLabel: "ai-router.mp4", status: "published", scheduledAt: iso(-3), publishedAt: iso(-3), createdBy: "Hana Zaki", approvedBy: "Tarek Nabil", accountIds: ["sa_ig", "sa_tt"], reach: 51200, engagement: 4390 },
  { id: "po_3", content: "We're hiring 3 senior React engineers in Cairo. Remote-friendly.", status: "scheduled", scheduledAt: iso(1, 3), createdBy: "Dina Kamal", approvedBy: "Mariam Fouad", accountIds: ["sa_li"] },
  { id: "po_4", content: "5 signs your agency has outgrown spreadsheets 🧵", mediaLabel: "thread-cover.png", status: "pending_approval", scheduledAt: iso(2, 5), createdBy: "Hana Zaki", accountIds: ["sa_fb", "sa_ig"] },
  { id: "po_5", content: "Behind the scenes of our design sprint week.", mediaLabel: "bts-carousel.zip", status: "pending_approval", scheduledAt: iso(3), createdBy: "Hana Zaki", accountIds: ["sa_ig"] },
  { id: "po_6", content: "Hosting bundle promo — 20% off annual plans until Friday.", status: "draft", scheduledAt: iso(4, 2), createdBy: "Tarek Nabil", accountIds: ["sa_fb", "sa_li", "sa_ig"] },
  { id: "po_7", content: "Ramadan working hours announcement.", status: "changes_requested", scheduledAt: iso(5), createdBy: "Hana Zaki", accountIds: ["sa_fb"], note: "Add Arabic version and brand template." },
  { id: "po_8", content: "Customer love: 4.9/5 average CSAT this quarter. Thank you 💙", status: "scheduled", scheduledAt: iso(6, 1), createdBy: "Dina Kamal", approvedBy: "Mariam Fouad", accountIds: ["sa_ig", "sa_fb", "sa_li"] },
];

export const campaigns: Campaign[] = [
  { id: "cp_1", name: "ERP Demo — Lead Gen Q3", platform: "facebook", objective: "leads", budget: 12000, spent: 8420, startDate: iso(-30), endDate: iso(15), createdBy: "Yousef Rami", status: "active", landingSectionKey: "hero" },
  { id: "cp_2", name: "Hosting Awareness — MENA", platform: "instagram", objective: "awareness", budget: 6000, spent: 5210, startDate: iso(-45), endDate: iso(5), createdBy: "Yousef Rami", status: "active", landingSectionKey: "services" },
  { id: "cp_3", name: "Case Studies Traffic Push", platform: "linkedin", objective: "traffic", budget: 9000, spent: 3120, startDate: iso(-12), endDate: iso(30), createdBy: "Yousef Rami", status: "active", landingSectionKey: "featured_work" },
  { id: "cp_4", name: "Careers Employer Brand", platform: "tiktok", objective: "awareness", budget: 3000, spent: 2980, startDate: iso(-70), endDate: iso(-10), createdBy: "Mariam Fouad", status: "ended" },
  { id: "cp_5", name: "Retargeting — Pricing Page", platform: "x", objective: "leads", budget: 4000, spent: 0, startDate: iso(3), endDate: iso(40), createdBy: "Yousef Rami", status: "draft", landingSectionKey: "pricing" },
];

export const campaignMetrics: CampaignMetric[] = campaigns.flatMap((c, ci) =>
  Array.from({ length: 7 }, (_, i) => {
    const reach = 4000 + ((ci + 1) * 900) + i * 320;
    const clicks = Math.round(reach * (0.03 + ci * 0.004));
    const leads = Math.max(1, Math.round(clicks * (0.09 + ci * 0.01)));
    return {
      id: `cm_${c.id}_${i}`,
      campaignId: c.id,
      date: iso(-6 + i).slice(0, 10),
      reach,
      clicks,
      cost: Math.round((c.spent / 7) * (0.85 + i * 0.05)),
      leadsGenerated: leads,
      conversions: Math.max(0, Math.round(leads * 0.22)),
    };
  }),
);

export const portfolioEntries: PortfolioEntry[] = [
  { id: "pe_1", projectId: "pr_4", title: "Kairo Onboarding", clientApproved: true, isVisible: true, coverImage: "kairo-cover.jpg", description: "Digital KYC and onboarding for a regional bank, launched in 4 months.", tags: ["Mobile", "System"], showClientName: true, clientLabel: "Kairo Bank" },
  { id: "pe_2", projectId: "pr_1", title: "Pharma ERP", clientApproved: true, isVisible: true, coverImage: "pharma-cover.jpg", description: "End-to-end ERP for pharmaceutical distribution across 3 countries.", tags: ["Web", "System"], showClientName: false, clientLabel: "Confidential Client" },
  { id: "pe_3", projectId: "pr_3", title: "Atlas Fleet Tracker", clientApproved: false, isVisible: false, coverImage: "atlas-cover.jpg", description: "Realtime fleet telemetry dashboard with predictive maintenance.", tags: ["Web"], showClientName: false, clientLabel: "Confidential Client" },
  { id: "pe_4", projectId: "pr_2", title: "Cedar Storefront", clientApproved: true, isVisible: false, coverImage: "cedar-cover.jpg", description: "Headless commerce platform with a native companion app.", tags: ["Web", "Mobile"], showClientName: true, clientLabel: "Cedar Retail" },
];

export const testimonials: Testimonial[] = [
  { id: "ts_1", clientName: "Salma Fahmy — Nile Pharma", anonymous: false, quote: "The Knower team replaced five disconnected tools with one system our staff actually enjoys using.", rating: 5, projectId: "pr_1", isApproved: true, createdAt: iso(-40) },
  { id: "ts_2", clientName: "Anonymous", anonymous: true, quote: "Delivery was on time and the handover documentation was the best we've received from any vendor.", rating: 5, projectId: "pr_4", isApproved: true, createdAt: iso(-22) },
  { id: "ts_3", clientName: "Youssef Amrani — Atlas Logistics", anonymous: false, quote: "Realtime visibility across our fleet paid for the project within two quarters.", rating: 4, projectId: "pr_3", isApproved: false, createdAt: iso(-6) },
];

export const landingSections: LandingSection[] = [
  { id: "ls_1", sectionKey: "hero", label: "Hero", isVisible: true, sortOrder: 1, updatedBy: "Mariam Fouad", updatedAt: iso(-12) },
  { id: "ls_2", sectionKey: "services", label: "Services", isVisible: true, sortOrder: 2, updatedBy: "Mariam Fouad", updatedAt: iso(-12) },
  { id: "ls_3", sectionKey: "featured_work", label: "Featured Work", isVisible: true, sortOrder: 3, updatedBy: "Tarek Nabil", updatedAt: iso(-5) },
  { id: "ls_4", sectionKey: "testimonials", label: "Testimonials", isVisible: true, sortOrder: 4, updatedBy: "Mariam Fouad", updatedAt: iso(-30) },
  { id: "ls_5", sectionKey: "pricing", label: "Pricing", isVisible: true, sortOrder: 5, updatedBy: "Mariam Fouad", updatedAt: iso(-30) },
  { id: "ls_6", sectionKey: "cta", label: "CTA", isVisible: false, sortOrder: 6, updatedBy: "Dina Kamal", updatedAt: iso(-2) },
];

export const followUps: FollowUp[] = [
  { id: "fu_1", leadId: "ld_1", date: iso(-3), channel: "call", notes: "Walked through pricing tiers, sending a proposal.", nextFollowUpAt: iso(2), createdBy: "Sales Rep" },
  { id: "fu_2", leadId: "ld_2", date: iso(-1), channel: "whatsapp", notes: "Asked for a hosting add-on quote.", nextFollowUpAt: iso(1), createdBy: "Sales Rep" },
];

export const leadAttribution: LeadAttribution[] = [
  { id: "la_1", leadId: "ld_1", source: "Facebook Ad", utmSource: "facebook", utmCampaign: "erp-demo-q3", utmMedium: "cpc" },
  { id: "la_2", leadId: "ld_2", source: "Referral" },
  { id: "la_3", leadId: "ld_3", source: "LinkedIn", utmSource: "linkedin", utmCampaign: "case-studies-traffic", utmMedium: "cpc" },
];

export const activityLogs: ActivityLog[] = [
  { id: "al_1", actor: "Tarek Nabil", action: "Showed on landing page", target: "Featured Work → Kairo Onboarding", at: iso(-5) },
  { id: "al_2", actor: "Mariam Fouad", action: "Hid section", target: "CTA", at: iso(-2) },
  { id: "al_3", actor: "Mariam Fouad", action: "Approved post", target: "Case study drop — Nile Pharma", at: iso(-6) },
];

// ---------- Store ----------
type State = {
  team: TeamMember[]; socialAccounts: SocialAccount[]; posts: Post[];
  campaigns: Campaign[]; campaignMetrics: CampaignMetric[];
  portfolioEntries: PortfolioEntry[]; testimonials: Testimonial[];
  landingSections: LandingSection[]; followUps: FollowUp[];
  leadAttribution: LeadAttribution[]; activityLogs: ActivityLog[];
};

const state: State = {
  team: [...team], socialAccounts: [...socialAccounts], posts: [...posts],
  campaigns: [...campaigns], campaignMetrics: [...campaignMetrics],
  portfolioEntries: [...portfolioEntries], testimonials: [...testimonials],
  landingSections: [...landingSections], followUps: [...followUps],
  leadAttribution: [...leadAttribution], activityLogs: [...activityLogs],
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };

export function useMarketing<K extends keyof State>(key: K): State[K] {
  return useSyncExternalStore(subscribe, () => state[key], () => state[key]);
}
export function getMarketingState() { return state; }
export const makeMarketingId = uid;

export function logActivity(actor: string, action: string, target: string) {
  state.activityLogs = [
    { id: uid("al"), actor, action, target, at: new Date().toISOString() },
    ...state.activityLogs,
  ];
}

// Accounts
export function addAccount(a: Omit<SocialAccount, "id">) {
  state.socialAccounts = [{ ...a, id: uid("sa") }, ...state.socialAccounts];
  logActivity(a.connectedBy, "Connected account", `${a.platform} ${a.handle}`);
  emit();
}
export function setAccountStatus(id: ID, status: AccountStatus, actor: string) {
  const acc = state.socialAccounts.find((a) => a.id === id);
  state.socialAccounts = state.socialAccounts.map((a) => (a.id === id ? { ...a, status } : a));
  logActivity(actor, status === "active" ? "Reconnected account" : "Disconnected account", acc?.handle ?? id);
  emit();
}
export function setAccountTeam(id: ID, assignedTeam: ID[]) {
  state.socialAccounts = state.socialAccounts.map((a) => (a.id === id ? { ...a, assignedTeam } : a));
  emit();
}

// Posts
export function addPost(p: Omit<Post, "id">) {
  state.posts = [{ ...p, id: uid("po") }, ...state.posts];
  logActivity(p.createdBy, "Created post", p.content.slice(0, 40));
  emit();
}
export function updatePost(id: ID, patch: Partial<Post>) {
  state.posts = state.posts.map((p) => (p.id === id ? { ...p, ...patch } : p));
  emit();
}
export function setPostStatus(id: ID, status: PostStatus, actor: string, note?: string) {
  const post = state.posts.find((p) => p.id === id);
  state.posts = state.posts.map((p) =>
    p.id === id
      ? {
          ...p, status, note: note ?? p.note,
          approvedBy: status === "scheduled" || status === "published" ? actor : p.approvedBy,
          publishedAt: status === "published" ? new Date().toISOString() : p.publishedAt,
        }
      : p,
  );
  logActivity(actor, `Post → ${status.replace("_", " ")}`, post?.content.slice(0, 40) ?? id);
  emit();
}

// Campaigns
export function addCampaign(c: Omit<Campaign, "id">) {
  state.campaigns = [{ ...c, id: uid("cp") }, ...state.campaigns];
  logActivity(c.createdBy, "Created campaign", c.name);
  emit();
}
export function updateCampaign(id: ID, patch: Partial<Campaign>) {
  state.campaigns = state.campaigns.map((c) => (c.id === id ? { ...c, ...patch } : c));
  emit();
}

// Portfolio / landing
export function togglePortfolioVisible(id: ID, actor: string) {
  const e = state.portfolioEntries.find((p) => p.id === id);
  if (!e || !e.clientApproved) return;
  state.portfolioEntries = state.portfolioEntries.map((p) =>
    p.id === id ? { ...p, isVisible: !p.isVisible } : p,
  );
  logActivity(actor, e.isVisible ? "Hid from landing page" : "Showed on landing page", `Featured Work → ${e.title}`);
  emit();
}
export function updatePortfolioEntry(id: ID, patch: Partial<PortfolioEntry>, actor: string) {
  state.portfolioEntries = state.portfolioEntries.map((p) => (p.id === id ? { ...p, ...patch } : p));
  logActivity(actor, "Edited showcase entry", state.portfolioEntries.find((p) => p.id === id)?.title ?? id);
  emit();
}
export function toggleSection(id: ID, actor: string) {
  const s = state.landingSections.find((x) => x.id === id);
  state.landingSections = state.landingSections.map((x) =>
    x.id === id ? { ...x, isVisible: !x.isVisible, updatedBy: actor, updatedAt: new Date().toISOString() } : x,
  );
  logActivity(actor, s?.isVisible ? "Hid section" : "Showed section", s?.label ?? id);
  emit();
}
export function moveSection(id: ID, dir: -1 | 1, actor: string) {
  const sorted = [...state.landingSections].sort((a, b) => a.sortOrder - b.sortOrder);
  const idx = sorted.findIndex((s) => s.id === id);
  const swap = idx + dir;
  if (idx < 0 || swap < 0 || swap >= sorted.length) return;
  const a = sorted[idx], b = sorted[swap];
  state.landingSections = state.landingSections.map((s) =>
    s.id === a.id ? { ...s, sortOrder: b.sortOrder, updatedBy: actor, updatedAt: new Date().toISOString() }
      : s.id === b.id ? { ...s, sortOrder: a.sortOrder } : s,
  );
  logActivity(actor, "Reordered section", `${a.label} ${dir === -1 ? "up" : "down"}`);
  emit();
}

// Testimonials
export function addTestimonial(t: Omit<Testimonial, "id">) {
  state.testimonials = [{ ...t, id: uid("ts") }, ...state.testimonials];
  emit();
}
export function toggleTestimonial(id: ID, actor: string) {
  const t = state.testimonials.find((x) => x.id === id);
  state.testimonials = state.testimonials.map((x) => (x.id === id ? { ...x, isApproved: !x.isApproved } : x));
  logActivity(actor, t?.isApproved ? "Unpublished testimonial" : "Approved testimonial", t?.clientName ?? id);
  emit();
}

// Pipeline
export function addFollowUp(f: Omit<FollowUp, "id">) {
  state.followUps = [{ ...f, id: uid("fu") }, ...state.followUps];
  emit();
}

// ---------- Analytics ----------
export function campaignTotals(campaignId: ID) {
  const rows = state.campaignMetrics.filter((m) => m.campaignId === campaignId);
  const reach = rows.reduce((s, r) => s + r.reach, 0);
  const clicks = rows.reduce((s, r) => s + r.clicks, 0);
  const cost = rows.reduce((s, r) => s + r.cost, 0);
  const leads = rows.reduce((s, r) => s + r.leadsGenerated, 0);
  const conversions = rows.reduce((s, r) => s + r.conversions, 0);
  return { reach, clicks, cost, leads, conversions, cpl: leads ? Math.round(cost / leads) : 0 };
}

export function marketingKpis() {
  const totals = state.campaigns.map((c) => campaignTotals(c.id));
  const spend = totals.reduce((s, t) => s + t.cost, 0);
  const leads = totals.reduce((s, t) => s + t.leads, 0);
  const conversions = totals.reduce((s, t) => s + t.conversions, 0);
  return {
    activeAccounts: state.socialAccounts.filter((a) => a.status === "active").length,
    activeCampaigns: state.campaigns.filter((c) => c.status === "active").length,
    pendingApprovals: state.posts.filter((p) => p.status === "pending_approval").length,
    scheduledPosts: state.posts.filter((p) => p.status === "scheduled").length,
    spend, leads, conversions,
    cpl: leads ? Math.round(spend / leads) : 0,
    conversionRate: leads ? Math.round((conversions / leads) * 100) : 0,
    visibleShowcase: state.portfolioEntries.filter((p) => p.isVisible).length,
  };
}

export function leadsBySource() {
  const map = new Map<string, number>();
  for (const a of state.leadAttribution) map.set(a.source, (map.get(a.source) ?? 0) + 1);
  // enrich with campaign-generated leads for a fuller chart
  for (const c of state.campaigns) {
    const t = campaignTotals(c.id);
    const label = PLATFORM_LABELS[c.platform] + " Ad";
    map.set(label, (map.get(label) ?? 0) + t.leads);
  }
  return [...map.entries()].map(([source, count]) => ({ source, count }));
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok",
  linkedin: "LinkedIn", x: "X", youtube: "YouTube", whatsapp: "WhatsApp",
};
export const ALL_PLATFORMS = Object.keys(PLATFORM_LABELS) as Platform[];
