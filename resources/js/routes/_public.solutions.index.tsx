import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section, CTABand, Badge } from "@/components/public/blocks";
import { industries } from "@/mocks/marketing";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_public/solutions/")({
  head: () => ({
    meta: [
      { title: "Solutions by industry — The Knower" },
      { name: "description", content: "Purpose-built software for healthcare, education, retail, government and more." },
      { property: "og:title", content: "Solutions by industry — The Knower" },
    ],
    links: [{ rel: "canonical", href: "https://knower-all-in-one.lovable.app/solutions" }],
  }),
  component: SolutionsIndex,
});

function SolutionsIndex() {
  return (
    <div>
      <PageHero eyebrow="Solutions" title="Software built for your industry"
        subtitle="Domain-shaped platforms with the workflows, integrations and compliance your industry demands." />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((i) => (
            <Link key={i.slug} to="/solutions/$industry" params={{ industry: i.slug }}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/50">
              <Badge>{i.name}</Badge>
              <h3 className="mt-3 font-display text-lg font-semibold">{i.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{i.summary}</p>
              <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
                {i.highlights.map((h) => <li key={h}>· {h}</li>)}
              </ul>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Explore <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </Section>
      <CTABand title="Not sure which fits?" subtitle="Talk to us — we've probably solved something similar." primary={{ label: "Book a call", to: "/contact" }} />
    </div>
  );
}
