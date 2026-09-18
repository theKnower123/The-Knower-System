import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Card } from "@/components/public/blocks";
import { systemStatus } from "@/mocks/marketing";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_public/status")({
  head: () => ({ meta: [{ title: "System Status — The Knower" }, { name: "description", content: "Real-time uptime for every service." }] }),
  component: () => (
    <div>
      <PageHero eyebrow="Status" title="All systems operational" subtitle="Live status across every service." />
      <Section>
        <div className="mx-auto max-w-3xl space-y-2">
          {systemStatus.map((s) => (
            <Card key={s.service} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <div className="font-display font-semibold">{s.service}</div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">Uptime {s.uptime}</span>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">Operational</span>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  ),
});
