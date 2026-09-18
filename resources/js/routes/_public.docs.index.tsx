import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section, Card } from "@/components/public/blocks";
import { docs } from "@/mocks/marketing";

export const Route = createFileRoute("/_public/docs/")({
  head: () => ({ meta: [{ title: "Documentation — The Knower" }, { name: "description", content: "Guides, API reference and developer resources." }] }),
  component: () => {
    const groups = Array.from(new Set(docs.map((d) => d.group)));
    return (
      <div>
        <PageHero eyebrow="Docs" title="Documentation" subtitle="Everything you need to build with The Knower." />
        <Section>
          <div className="grid gap-6 md:grid-cols-3">
            {groups.map((g) => (
              <Card key={g}>
                <h2 className="font-display text-lg font-semibold">{g}</h2>
                <ul className="mt-3 space-y-2">
                  {docs.filter((d) => d.group === g).map((d) => (
                    <li key={d.slug}><Link to="/docs/$slug" params={{ slug: d.slug }} className="text-sm text-muted-foreground hover:text-primary">{d.title}</Link></li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Section>
      </div>
    );
  },
});
