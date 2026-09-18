import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, CTABand, Card, Badge } from "@/components/public/blocks";
import { Button } from "@/components/ui/button";
import { resources } from "@/mocks/marketing";
import { toast } from "sonner";
import { Download } from "lucide-react";

export const Route = createFileRoute("/_public/resources")({
  head: () => ({ meta: [{ title: "Resources — The Knower" }, { name: "description", content: "Whitepapers, templates, e-books and guides." }] }),
  component: () => (
    <div>
      <PageHero eyebrow="Resources" title="Learn, plan, ship" subtitle="Free resources to help your team build better software." />
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <Card key={r.title}>
              <Badge>{r.type}</Badge>
              <h3 className="mt-3 font-display text-lg font-semibold">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
              <Button size="sm" className="mt-4 gap-1.5" onClick={() => toast.success(`${r.title} · download started`)}><Download className="h-3.5 w-3.5" /> Download</Button>
            </Card>
          ))}
        </div>
      </Section>
      <CTABand title="Have a resource idea?" primary={{ label: "Suggest one", to: "/contact" }} />
    </div>
  ),
});
