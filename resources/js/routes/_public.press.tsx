import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Card, Badge, CTABand } from "@/components/public/blocks";
import { press } from "@/mocks/marketing";

export const Route = createFileRoute("/_public/press")({
  head: () => ({ meta: [{ title: "Press & News — The Knower" }, { name: "description", content: "Announcements, coverage and media resources." }] }),
  component: () => (
    <div>
      <PageHero eyebrow="Press" title="In the news" />
      <Section>
        <div className="space-y-4">
          {press.map((p) => (
            <Card key={p.slug}>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge>{p.source}</Badge><span>{p.date}</span>
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
            </Card>
          ))}
        </div>
      </Section>
      <CTABand title="Press inquiry?" primary={{ label: "press@theknower.io", to: "/contact" }} />
    </div>
  ),
});
