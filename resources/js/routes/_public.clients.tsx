import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, LogoCloud, CTABand, Card } from "@/components/public/blocks";
import { clientLogos, caseStudies } from "@/mocks/marketing";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/clients")({
  head: () => ({ meta: [{ title: "Clients — The Knower" }, { name: "description", content: "The teams we're proud to serve." }] }),
  component: () => (
    <div>
      <PageHero eyebrow="Clients" title="Trusted by ambitious teams" subtitle="150+ clients across 20+ countries." />
      <Section><LogoCloud names={clientLogos} /></Section>
      <Section className="bg-muted/30">
        <h2 className="font-display text-2xl font-semibold">Success stories</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {caseStudies.map((c) => (
            <Card key={c.slug}>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.industry}</div>
              <h3 className="mt-2 font-display text-base font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.client}</p>
              <Link to="/case-studies/$slug" params={{ slug: c.slug }} className="mt-3 inline-block text-sm font-medium text-primary">Read story →</Link>
            </Card>
          ))}
        </div>
      </Section>
      <CTABand title="Ready to join them?" primary={{ label: "Start a project", to: "/contact" }} />
    </div>
  ),
});
