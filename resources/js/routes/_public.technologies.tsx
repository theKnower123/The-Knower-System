import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, CTABand } from "@/components/public/blocks";
import { technologies } from "@/mocks/marketing";

export const Route = createFileRoute("/_public/technologies")({
  head: () => ({
    meta: [
      { title: "Technologies — The Knower" },
      { name: "description", content: "The stack we use to ship reliable, scalable software." },
    ],
  }),
  component: TechnologiesPage,
});

function TechnologiesPage() {
  const groups = Array.from(new Set(technologies.map((t) => t.category)));
  return (
    <div>
      <PageHero eyebrow="Technologies" title="Modern stacks, proven at scale" subtitle="We pick the right tool for the job — not the trendiest." />
      <Section>
        <div className="space-y-12">
          {groups.map((g) => (
            <div key={g}>
              <h2 className="font-display text-xl font-semibold">{g}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {technologies.filter((t) => t.category === g).map((t) => (
                  <div key={t.name} className="flex items-center justify-center rounded-xl border border-border bg-card p-4 font-display text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary">
                    {t.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
      <CTABand title="Have a stack we should support?" primary={{ label: "Talk to us", to: "/contact" }} />
    </div>
  );
}
