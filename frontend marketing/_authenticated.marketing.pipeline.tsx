import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MessageCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { PageHeader } from "@/components/page-header";
import { MarketingNav } from "@/components/marketing";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMarketing, addFollowUp, leadsBySource, marketingKpis, campaignTotals } from "@/mocks/marketing-ops";
import { useCollection } from "@/mocks/store";
import { useAuth } from "@/store/auth";
import { money, shortDate, relativeDays } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/marketing/pipeline")({
  head: () => ({
    meta: [
      { title: "Sales Pipeline — The Knower OS" },
      { name: "description", content: "Lead sources, UTM attribution, follow-ups and conversion reporting." },
    ],
  }),
  component: PipelinePage,
});

const CHANNEL_ICON = { call: Phone, email: Mail, whatsapp: MessageCircle } as const;

function PipelinePage() {
  const leads = useCollection("leads");
  const attribution = useMarketing("leadAttribution");
  const followUps = useMarketing("followUps");
  const campaigns = useMarketing("campaigns");
  const actor = useAuth((s) => s.user)?.name ?? "Sales Rep";
  const kpi = marketingKpis();
  const [logFor, setLogFor] = useState<string | null>(null);

  const sources = leadsBySource();
  const cplByPlatform = campaigns.map((c) => ({
    name: c.platform,
    cpl: campaignTotals(c.id).cpl,
  }));

  return (
    <div>
      <PageHeader title="Sales Pipeline" description="Lead sources, follow-ups and conversion performance" />
      <MarketingNav />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open leads" value={leads.filter((l) => l.status !== "won" && l.status !== "lost").length} />
        <StatCard label="Attributed leads (ads)" value={kpi.leads} accent="success" />
        <StatCard label="Cost per lead" value={money(kpi.cpl)} accent="warning" />
        <StatCard label="Lead → client rate" value={`${kpi.conversionRate}%`} accent="success" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 font-display text-sm font-semibold">Leads by source</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sources}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="source" fontSize={10} interval={0} angle={-12} height={45} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 font-display text-sm font-semibold">Cost per lead by platform</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cplByPlatform}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="cpl" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <h2 className="font-display text-sm font-semibold">Leads</h2>
        {leads.map((l) => {
          const attr = attribution.find((a) => a.leadId === l.id);
          const lf = followUps.filter((f) => f.leadId === l.id);
          const last = lf[0];
          return (
            <div key={l.id} className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
              <div>
                <div className="text-sm font-medium">{l.name}</div>
                <div className="text-xs text-muted-foreground">{l.email} · {l.phone}</div>
                <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase text-muted-foreground">
                  <span className="rounded-full border border-border px-2 py-0.5">{attr?.source ?? l.source}</span>
                  {attr?.utmCampaign && <span className="rounded-full border border-border px-2 py-0.5">utm_campaign: {attr.utmCampaign}</span>}
                  {attr?.utmSource && <span className="rounded-full border border-border px-2 py-0.5">utm_source: {attr.utmSource}</span>}
                  <span className="rounded-full border border-border px-2 py-0.5">{l.status}</span>
                  <span className="rounded-full border border-border px-2 py-0.5">{money(l.budget)}</span>
                </div>
                {last && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Last follow-up {shortDate(last.date)} via {last.channel} — {last.notes}
                    {last.nextFollowUpAt && ` · next ${relativeDays(last.nextFollowUpAt)}`}
                  </p>
                )}
              </div>
              <Button size="sm" variant="outline" onClick={() => setLogFor(l.id)}>
                <Plus className="me-1 h-3.5 w-3.5" /> Log Follow-up
              </Button>
            </div>
          );
        })}
      </div>

      <FollowUpDialog leadId={logFor} onClose={() => setLogFor(null)} actor={actor} />

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-3 font-display text-sm font-semibold">Follow-up history</h2>
        <ul className="space-y-2 text-sm">
          {followUps.map((f) => {
            const Icon = CHANNEL_ICON[f.channel];
            return (
              <li key={f.id} className="flex items-center gap-3 border-b border-border/60 pb-2 last:border-0">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span>{f.notes}</span>
                <span className="ms-auto text-xs text-muted-foreground">{shortDate(f.date)} · {f.createdBy}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function FollowUpDialog({ leadId, onClose, actor }: { leadId: string | null; onClose: () => void; actor: string }) {
  const [channel, setChannel] = useState<"call" | "email" | "whatsapp">("call");
  const [notes, setNotes] = useState("");
  const [next, setNext] = useState(() => new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10));

  return (
    <Dialog open={!!leadId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log follow-up</DialogTitle>
          <DialogDescription>A reminder notification is created for the next date.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Channel</Label>
            <Select value={channel} onValueChange={(v) => setChannel(v as typeof channel)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea rows={3} maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Next follow-up</Label>
            <Input type="date" value={next} onChange={(e) => setNext(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            disabled={!notes.trim()}
            onClick={() => {
              if (!leadId) return;
              addFollowUp({
                leadId, date: new Date().toISOString(), channel, notes: notes.trim(),
                nextFollowUpAt: new Date(next).toISOString(), createdBy: actor,
              });
              toast.success("Follow-up logged — reminder scheduled");
              setNotes(""); onClose();
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
