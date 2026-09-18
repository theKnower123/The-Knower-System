import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Card } from "@/components/public/blocks";
import { Button } from "@/components/ui/button";
import { downloads } from "@/mocks/marketing";
import { toast } from "sonner";
import { Download, FileText } from "lucide-react";

export const Route = createFileRoute("/_public/downloads")({
  head: () => ({ meta: [{ title: "Downloads — The Knower" }, { name: "description", content: "Company profile, brochures, portfolio and brand assets." }] }),
  component: () => (
    <div>
      <PageHero eyebrow="Downloads" title="Files & brand assets" />
      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          {downloads.map((d) => (
            <Card key={d.name} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileText className="h-5 w-5" /></div>
                <div>
                  <div className="font-display font-semibold">{d.name}</div>
                  <div className="text-xs text-muted-foreground">{d.format} · {d.size}</div>
                </div>
              </div>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success(`${d.name} · download started`)}><Download className="h-3.5 w-3.5" /> Download</Button>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  ),
});
