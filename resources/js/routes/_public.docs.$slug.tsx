import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { PageHero, Section, Card } from "@/components/public/blocks";
import { docs } from "@/mocks/marketing";

export const Route = createFileRoute("/_public/docs/$slug")({
  loader: ({ params }) => { const d = docs.find((x) => x.slug === params.slug); if (!d) throw notFound(); return d; },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.title ?? "Docs"} — The Knower` }, { name: "description", content: loaderData?.body?.[0] ?? "" }] }),
  component: () => {
    const d = Route.useLoaderData();
    return (
      <div>
        <PageHero eyebrow={d.group} title={d.title} />
        <Section>
          <div className="grid gap-6 lg:grid-cols-[1fr_3fr]">
            <Card>
              <h3 className="font-display text-sm font-semibold">On this page</h3>
              <ul className="mt-3 space-y-1 text-sm">
                {docs.filter((x) => x.group === d.group).map((x) => (
                  <li key={x.slug}><Link to="/docs/$slug" params={{ slug: x.slug }} className={x.slug === d.slug ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"}>{x.title}</Link></li>
                ))}
              </ul>
            </Card>
            <article className="prose prose-sm max-w-none rounded-2xl border border-border bg-card p-8 dark:prose-invert">
              {d.body.map((p: string, i: number) => <p key={i} className="text-muted-foreground">{p}</p>)}
            </article>
          </div>
        </Section>
      </div>
    );
  },
});
