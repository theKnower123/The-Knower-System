import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section, CTABand } from "@/components/public/blocks";
import { services as staticServices } from "@/mocks/marketing";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Route = createFileRoute("/_public/services/")({
  head: () => ({
    meta: [
      { title: "Services — The Knower" },
      { name: "description", content: "Web, mobile, cloud, AI, hosting, SEO, marketing and more — full-stack services for ambitious teams." },
    ],
    links: [{ rel: "canonical", href: "https://knower-all-in-one.lovable.app/services" }],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  const { data: dynamicServices } = useQuery({
    queryKey: ['public', 'services'],
    queryFn: async () => {
      const res = await axios.get('/api/v1/public/services');
      return res.data.services.map((s: any) => ({
        slug: s.slug, name: s.title, tagline: s.description.substring(0, 50), description: s.description, deliverables: [], icon: s.icon || "Sparkles"
      }));
    }
  });
  const services = dynamicServices || staticServices;

  return (
    <div>
      <PageHero eyebrow="Services" title="Full-stack services, senior teams" subtitle="One accountable partner for the entire lifecycle — from idea to launch to scale." />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s: any) => {
            const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[s.icon] ?? Icons.Sparkles;
            return (
              <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/50">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{s.name}</h3>
                <p className="mt-1 text-sm text-primary">{s.tagline}</p>
                <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">Details <ArrowRight className="h-3.5 w-3.5" /></div>
              </Link>
            );
          })}
        </div>
      </Section>
      <CTABand title="Have a project in mind?" primary={{ label: "Get a quote", to: "/contact" }} />
    </div>
  );
}
