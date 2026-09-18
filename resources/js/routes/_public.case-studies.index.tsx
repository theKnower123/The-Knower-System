import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section, CTABand, Card, Badge } from "@/components/public/blocks";
import { caseStudies } from "@/mocks/marketing";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_public/case-studies/")({
  head: () => ({
    meta: [
      { title: "Case studies — The Knower" },
      { name: "description", content: "Real customer stories, measured outcomes." },
    ],
    links: [{ rel: "canonical", href: "https://knower-all-in-one.lovable.app/case-studies" }],
  }),
  component: CaseStudiesIndex,
});

function CaseStudiesIndex() {
  return (
    <div>
      <PageHero eyebrow="Case studies" title="Outcomes, in customer words" />
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {caseStudies.map((c) => (
            <Link key={c.slug} to="/case-studies/$slug" params={{ slug: c.slug }}
              className="group flex flex-col rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-0.5 hover:border-primary/50">
              <Badge>{c.industry}</Badge>
              <h3 className="mt-3 font-display text-xl font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.client}</p>
              <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
                {c.result.slice(0, 2).map((r: string) => <li key={r}>· {r}</li>)}
              </ul>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">Read case study <ArrowRight className="h-3.5 w-3.5" /></div>
            </Link>
          ))}
        </div>
        <div className="mt-16">
          <Card>
            <h3 className="font-display text-lg font-semibold">Numbers we're proud of</h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-4">
              {[["500+", "Projects"], ["150+", "Clients"], ["20+", "Countries"], ["99.9%", "Uptime"]].map(([v, l]) => (
                <div key={l}><div className="font-display text-3xl font-bold text-primary">{v}</div><div className="text-xs uppercase tracking-wider text-muted-foreground">{l}</div></div>
              ))}
            </div>
          </Card>
        </div>
      </Section>
      <CTABand title="Ready to be our next story?" primary={{ label: "Book a call", to: "/contact" }} />
    </div>
  );
}
