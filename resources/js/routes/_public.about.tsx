import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, CTABand, Card, Badge } from "@/components/public/blocks";
import { branches } from "@/mocks/marketing";

export const Route = createFileRoute("/_public/about")({
  head: () => ({ meta: [{ title: "About — The Knower" }, { name: "description", content: "Our story, mission, values and where you'll find us." }] }),
  component: () => (
    <div>
      <PageHero eyebrow="About us" title="Building the operating system for software houses" subtitle="Founded in 2015. 300+ people. 20+ countries. One mission." />
      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card><h3 className="font-display text-base font-semibold">Mission</h3><p className="mt-2 text-sm text-muted-foreground">Give every software team the platform to ship products the world uses.</p></Card>
          <Card><h3 className="font-display text-base font-semibold">Vision</h3><p className="mt-2 text-sm text-muted-foreground">A world where great software is the default, not the exception.</p></Card>
          <Card><h3 className="font-display text-base font-semibold">Values</h3><p className="mt-2 text-sm text-muted-foreground">Craft. Ownership. Kindness. Bias to ship.</p></Card>
        </div>
      </Section>
      <Section className="bg-muted/30">
        <h2 className="font-display text-2xl font-semibold">Our story</h2>
        <div className="mt-6 space-y-6">
          {[
            { year: "2015", event: "Founded in Riyadh with 4 engineers." },
            { year: "2018", event: "Opened Dubai and Cairo offices. 50 people." },
            { year: "2021", event: "Launched The Knower CRM. Crossed 100 clients." },
            { year: "2023", event: "Series A funding. Opened London office." },
            { year: "2025", event: "Launched The Knower AI. 300+ people, 20+ countries." },
            { year: "2026", event: "Series B — global expansion." },
          ].map((t) => (
            <div key={t.year} className="flex gap-6">
              <div className="w-20 shrink-0 font-display text-2xl font-bold text-primary">{t.year}</div>
              <div className="flex-1 border-s border-border ps-6 text-muted-foreground">{t.event}</div>
            </div>
          ))}
        </div>
      </Section>
      <Section>
        <h2 className="font-display text-2xl font-semibold">Where you'll find us</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {branches.map((b) => (
            <Card key={b.city}>
              <Badge>{b.country}</Badge>
              <div className="mt-3 font-display text-lg font-semibold">{b.city}</div>
              <p className="mt-1 text-sm text-muted-foreground">{b.address}</p>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <div>{b.phone}</div><div>{b.email}</div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
      <CTABand title="Want to work with us?" primary={{ label: "Talk to us", to: "/contact" }} secondary={{ label: "Join the team", to: "/careers" }} />
    </div>
  ),
});
