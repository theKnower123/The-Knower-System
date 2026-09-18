import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { PageHero, Section, CTABand, Card, Badge } from "@/components/public/blocks";
import { portfolio } from "@/mocks/marketing";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_public/portfolio/$slug")({
  loader: ({ params }) => {
    const p = portfolio.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Project"} — The Knower Portfolio` },
      { name: "description", content: loaderData?.summary ?? "" },
    ],
  }),
  component: ProjectPage,
});

function ProjectPage() {
  const p = Route.useLoaderData();
  return (
    <div>
      <PageHero eyebrow={p.category} title={p.title} subtitle={p.summary} />
      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <div className="mb-4 flex h-60 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 via-primary/10 to-accent/20 font-display text-6xl font-bold text-primary/40">
              {p.client.split(" ").map((w: string) => w[0]).join("")}
            </div>
            <h2 className="font-display text-xl font-semibold">About this project</h2>
            <p className="mt-2 text-muted-foreground">{p.summary}</p>
            <p className="mt-4 text-muted-foreground">Delivered in {p.year} for {p.client}. A cross-functional team of designers, engineers and product managers shipped this in tight collaboration with the client.</p>
          </Card>
          <div className="space-y-6">
            <Card>
              <h3 className="font-display text-base font-semibold">Details</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Client</dt><dd>{p.client}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Category</dt><dd>{p.category}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Year</dt><dd>{p.year}</dd></div>
              </dl>
            </Card>
            <Card>
              <h3 className="font-display text-base font-semibold">Technology</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.stack.map((s: string) => <Badge key={s}>{s}</Badge>)}
              </div>
            </Card>
            <Button asChild className="w-full"><Link to="/contact">Start a similar project</Link></Button>
          </div>
        </div>
      </Section>
      <CTABand title="Like what you see?" primary={{ label: "See more work", to: "/portfolio" }} secondary={{ label: "Talk to us", to: "/contact" }} />
    </div>
  );
}
