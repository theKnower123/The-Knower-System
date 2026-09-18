import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Card, Badge } from "@/components/public/blocks";
import { partners } from "@/mocks/marketing";

export const Route = createFileRoute("/_public/partners")({
  head: () => ({ meta: [{ title: "Partners — The Knower" }, { name: "description", content: "The technology partners we build with." }] }),
  component: () => (
    <div>
      <PageHero eyebrow="Partners" title="Better together" subtitle="The technology partners we trust." />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((p) => (
            <Card key={p.name}>
              <Badge>{p.category}</Badge>
              <div className="mt-3 font-display text-lg font-semibold">{p.name}</div>
              <div className="mt-1 text-sm text-primary">{p.tier}</div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  ),
});
