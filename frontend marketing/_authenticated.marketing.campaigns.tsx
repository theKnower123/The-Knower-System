import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { PageHeader } from "@/components/page-header";
import { MarketingNav, PlatformBadge, PlatformIcon } from "@/components/marketing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useMarketing, addCampaign, updateCampaign, campaignTotals,
  ALL_PLATFORMS, PLATFORM_LABELS, type Platform, type CampaignObjective,
} from "@/mocks/marketing-ops";
import { useAuth } from "@/store/auth";
import { money, shortDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/marketing/campaigns")({
  head: () => ({
    meta: [
      { title: "Ad Campaigns — The Knower OS" },
      { name: "description", content: "Paid campaigns with budget caps, reach, clicks, cost-per-lead and conversions." },
    ],
  }),
  component: CampaignsPage,
});

const BUDGET_CAP = 15000;

function CampaignsPage() {
  const campaigns = useMarketing("campaigns");
  const metrics = useMarketing("campaignMetrics");
  const actor = useAuth((s) => s.user)?.name ?? "Ads Specialist";
  const [selected, setSelected] = useState(campaigns[0]?.id ?? "");

  const active = campaigns.find((c) => c.id === selected) ?? campaigns[0];
  const series = metrics
    .filter((m) => m.campaignId === active?.id)
    .map((m) => ({ date: m.date.slice(5), reach: m.reach, clicks: m.clicks, leads: m.leadsGenerated }));

  return (
    <div>
      <PageHeader
        title="Campaigns"
        description={`Paid campaigns and analytics — Admin budget cap ${money(BUDGET_CAP)} per campaign`}
        actions={<NewCampaignDialog actor={actor} />}
      />
      <MarketingNav />

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4 space-y-3">
          {campaigns.map((c) => {
            const t = campaignTotals(c.id);
            const pct = Math.min(100, Math.round((c.spent / c.budget) * 100));
            return (
              <div key={c.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform={c.platform} />
                      <h3 className="font-display text-sm font-semibold">{c.name}</h3>
                      <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
                        {c.objective}
                      </span>
                      <span
                        className={
                          "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase " +
                          (c.status === "active"
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                            : c.status === "ended"
                              ? "border-slate-500/20 bg-slate-500/10 text-slate-400"
                              : "border-amber-500/20 bg-amber-500/10 text-amber-500")
                        }
                      >
                        {c.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {shortDate(c.startDate)} → {shortDate(c.endDate)}
                      {c.landingSectionKey && ` · linked to landing section “${c.landingSectionKey.replace("_", " ")}”`}
                    </p>
                    <div className="mt-3 w-64">
                      <Progress value={pct} className="h-1.5" />
                      <p className="mt-1 text-xs text-muted-foreground">
                        {money(c.spent)} of {money(c.budget)} spent
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
                    <Metric label="Reach" value={t.reach.toLocaleString()} />
                    <Metric label="Clicks" value={t.clicks.toLocaleString()} />
                    <Metric label="Leads" value={String(t.leads)} />
                    <Metric label="Cost / lead" value={money(t.cpl)} />
                    <Metric label="Conversions" value={String(t.conversions)} />
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      updateCampaign(c.id, { status: c.status === "active" ? "paused" : "active" });
                      toast.success(c.status === "active" ? "Campaign paused" : "Campaign resumed");
                    }}
                  >
                    {c.status === "active" ? "Pause" : "Activate"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setSelected(c.id)}>
                    View analytics
                  </Button>
                </div>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <div className="mb-4 max-w-sm">
            <Select value={active?.id} onValueChange={setSelected}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {campaigns.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {active && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <PlatformBadge platform={active.platform} />
                {Object.entries(campaignTotals(active.id)).map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-border bg-card px-4 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
                    <div className="font-display text-lg font-semibold tabular-nums">
                      {k === "cost" || k === "cpl" ? money(Number(v)) : Number(v).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-72 rounded-xl border border-border bg-card p-5">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={series}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip />
                    <Area type="monotone" dataKey="reach" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} />
                    <Area type="monotone" dataKey="clicks" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} />
                    <Area type="monotone" dataKey="leads" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider">{label}</div>
      <div className="font-display text-base font-semibold tabular-nums text-foreground">{value}</div>
    </div>
  );
}

function NewCampaignDialog({ actor }: { actor: string }) {
  const sections = useMarketing("landingSections");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<Platform>("facebook");
  const [objective, setObjective] = useState<CampaignObjective>("leads");
  const [budget, setBudget] = useState(2000);
  const [start, setStart] = useState(() => new Date().toISOString().slice(0, 10));
  const [end, setEnd] = useState(() => new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
  const [section, setSection] = useState("hero");

  const overCap = budget > BUDGET_CAP;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="me-1 h-4 w-4" /> New Campaign</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New campaign</DialogTitle>
          <DialogDescription>Budget must stay within the Admin-set cap of {money(BUDGET_CAP)}.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Platform</Label>
              <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ALL_PLATFORMS.map((p) => <SelectItem key={p} value={p}>{PLATFORM_LABELS[p]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Objective</Label>
              <Select value={objective} onValueChange={(v) => setObjective(v as CampaignObjective)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="traffic">Traffic</SelectItem>
                  <SelectItem value="leads">Leads</SelectItem>
                  <SelectItem value="awareness">Awareness</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Budget (USD)</Label>
              <Input type="number" min={0} value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label>Start</Label>
              <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>End</Label>
              <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>
          {overCap && <p className="text-xs text-destructive">Budget exceeds the {money(BUDGET_CAP)} cap.</p>}
          <div className="space-y-1.5">
            <Label>Linked landing section</Label>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {sections.map((s) => <SelectItem key={s.id} value={s.sectionKey}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            disabled={!name.trim() || overCap}
            onClick={() => {
              addCampaign({
                name: name.trim(), platform, objective, budget, spent: 0,
                startDate: new Date(start).toISOString(), endDate: new Date(end).toISOString(),
                createdBy: actor, status: "draft", landingSectionKey: section,
              });
              toast.success("Campaign created as draft");
              setName(""); setOpen(false);
            }}
          >
            Create campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
