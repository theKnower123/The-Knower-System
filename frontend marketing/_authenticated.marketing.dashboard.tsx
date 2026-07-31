import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Megaphone, Users, Clock, Target, DollarSign, Eye } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { MarketingNav, PlatformBadge, PostStatusBadge } from "@/components/marketing";
import {
  useMarketing, marketingKpis, campaignTotals, leadsBySource,
} from "@/mocks/marketing-ops";
import { money, shortDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/marketing/dashboard")({
  head: () => ({
    meta: [
      { title: "Marketing Dashboard — The Knower OS" },
      { name: "description", content: "Campaign spend, lead sources and content approvals at a glance." },
    ],
  }),
  component: MarketingDashboard,
});

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#06b6d4", "#a855f7", "#84cc16"];

function MarketingDashboard() {
  const campaigns = useMarketing("campaigns");
  const posts = useMarketing("posts");
  const kpi = marketingKpis();
  const sources = leadsBySource();

  const perCampaign = campaigns.map((c) => ({
    name: c.name.length > 18 ? c.name.slice(0, 18) + "…" : c.name,
    leads: campaignTotals(c.id).leads,
    cpl: campaignTotals(c.id).cpl,
  }));

  const spendTrend = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(Date.now() - (6 - i) * 86400000);
    return {
      day: day.toLocaleDateString("en-US", { weekday: "short" }),
      spend: Math.round(kpi.spend / 7 * (0.7 + i * 0.09)),
      leads: Math.round(kpi.leads / 7 * (0.8 + i * 0.06)),
    };
  });

  const upcoming = [...posts]
    .filter((p) => p.status === "scheduled" || p.status === "pending_approval")
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Sales & Marketing"
        description="Accounts, campaigns, content approvals and lead attribution"
      />
      <MarketingNav />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active campaigns" value={kpi.activeCampaigns} icon={Megaphone} />
        <StatCard label="Connected accounts" value={kpi.activeAccounts} icon={Users} accent="success" />
        <StatCard label="Pending approvals" value={kpi.pendingApprovals} icon={Clock} accent="warning" />
        <StatCard label="Scheduled posts" value={kpi.scheduledPosts} icon={Eye} />
        <StatCard label="Ad spend (7d)" value={money(kpi.spend)} icon={DollarSign} />
        <StatCard label="Leads generated" value={kpi.leads} icon={Target} accent="success" />
        <StatCard label="Cost per lead" value={money(kpi.cpl)} delta="target < $60" icon={DollarSign} accent="warning" />
        <StatCard label="Lead → client rate" value={`${kpi.conversionRate}%`} icon={Target} accent="success" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="mb-4 font-display text-sm font-semibold">Spend vs leads (last 7 days)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="spend" stroke="#6366f1" strokeWidth={2} />
                <Line type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 font-display text-sm font-semibold">Leads by source</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sources} dataKey="count" nameKey="source" outerRadius={80} label={false}>
                  {sources.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 font-display text-sm font-semibold">Leads per campaign</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perCampaign}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" fontSize={10} interval={0} angle={-12} height={50} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="leads" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 font-display text-sm font-semibold">Next up in the calendar</h2>
          <ul className="space-y-3">
            {upcoming.map((p) => (
              <li key={p.id} className="flex items-start justify-between gap-3 border-b border-border/60 pb-3 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-sm">{p.content}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {shortDate(p.scheduledAt)} · by {p.createdBy}
                  </p>
                </div>
                <PostStatusBadge status={p.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 font-display text-sm font-semibold">Best performing campaigns</h2>
        <div className="space-y-3">
          {[...campaigns]
            .sort((a, b) => campaignTotals(b.id).leads - campaignTotals(a.id).leads)
            .slice(0, 4)
            .map((c) => {
              const t = campaignTotals(c.id);
              return (
                <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3 last:border-0">
                  <div>
                    <div className="text-sm font-medium">{c.name}</div>
                    <PlatformBadge platform={c.platform} />
                  </div>
                  <div className="flex gap-6 text-xs text-muted-foreground">
                    <span>Reach <b className="text-foreground">{t.reach.toLocaleString()}</b></span>
                    <span>Leads <b className="text-foreground">{t.leads}</b></span>
                    <span>CPL <b className="text-foreground">{money(t.cpl)}</b></span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
