import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageHero, Section, CTABand, Card, Badge } from "@/components/public/blocks";
import { industries } from "@/mocks/marketing";
import { Check } from "lucide-react";

export const Route = createFileRoute("/_public/solutions/$industry")({
  loader: ({ params }) => {
    const i = industries.find((x) => x.slug === params.industry);
    if (!i) throw notFound();
    return i;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Industry"} solutions — The Knower` },
      { name: "description", content: loaderData?.summary ?? "Industry solutions by The Knower." },
      { property: "og:title", content: `${loaderData?.name ?? "Industry"} solutions — The Knower` },
    ],
  }),
  component: IndustryPage,
});

function IndustryPage() {
  const i = Route.useLoaderData();
  return (
    <div>
      <PageHero eyebrow={i.name} title={`${i.name} software, done right`} subtitle={i.summary} />
      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <h2 className="font-display text-xl font-semibold">What we build</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {i.highlights.map((h: string) => (
                <li key={h} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{h}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              Every {i.name.toLowerCase()} engagement starts with a discovery workshop and delivers a working prototype in weeks — not months.
            </p>
          </Card>
          <Card>
            <Badge>Compliance</Badge>
            <h3 className="mt-3 font-display text-base font-semibold">Built-in guarantees</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>· SOC 2 Type II & ISO 27001</li>
              <li>· Data residency in your region</li>
              <li>· 99.99% uptime SLA</li>
              <li>· Dedicated success manager</li>
            </ul>
          </Card>
        </div>
      </Section>
      <CTABand title={`Ready to modernize ${i.name.toLowerCase()}?`} primary={{ label: "Book a demo", to: "/contact" }} secondary={{ label: "See portfolio", to: "/portfolio" }} />
    </div>
  );
}
