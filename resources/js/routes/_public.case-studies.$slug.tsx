import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { PageHero, Section, CTABand, Card, Badge } from "@/components/public/blocks";
import { caseStudies } from "@/mocks/marketing";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_public/case-studies/$slug")({
  loader: ({ params }) => {
    const c = caseStudies.find((x) => x.slug === params.slug);
    if (!c) throw notFound();
    return c;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Case study"} — The Knower` },
      { name: "description", content: loaderData?.challenge ?? "" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: CaseStudyPage,
});

function CaseStudyPage() {
  const c = Route.useLoaderData();
  return (
    <div>
      <PageHero eyebrow={c.industry} title={c.title} subtitle={c.client} />
      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <Card><h2 className="font-display text-xl font-semibold">The Challenge</h2><p className="mt-3 text-muted-foreground">{c.challenge}</p></Card>
            <Card><h2 className="font-display text-xl font-semibold">The Solution</h2><p className="mt-3 text-muted-foreground">{c.solution}</p></Card>
            <Card>
              <h2 className="font-display text-xl font-semibold">The Result</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {c.result.map((r: string) => (
                  <li key={r} className="rounded-lg bg-primary/10 p-4 font-display text-lg font-semibold text-primary">{r}</li>
                ))}
              </ul>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <h3 className="font-display text-base font-semibold">Client review</h3>
              <p className="mt-3 text-sm italic text-muted-foreground">"Working with The Knower changed how we think about software. The team delivered on time, on budget, and beyond scope."</p>
              <div className="mt-4 text-sm font-semibold">— {c.client}</div>
            </Card>
            <Card>
              <h3 className="font-display text-base font-semibold">Technology</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.stack.map((s: string) => <Badge key={s}>{s}</Badge>)}
              </div>
            </Card>
            <Button asChild className="w-full"><Link to="/contact">Get a similar outcome</Link></Button>
          </div>
        </div>
      </Section>
      <CTABand title="Read more stories" primary={{ label: "All case studies", to: "/case-studies" }} />
    </div>
  );
}
