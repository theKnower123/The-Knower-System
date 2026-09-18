import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, CTABand, FeatureCard } from "@/components/public/blocks";
import { aiSolutions } from "@/mocks/marketing";
import * as Icons from "lucide-react";

export const Route = createFileRoute("/_public/ai-solutions")({
  head: () => ({
    meta: [
      { title: "AI Solutions — The Knower" },
      { name: "description", content: "Production AI for chatbots, automation, OCR, vision, voice and predictive analytics." },
    ],
  }),
  component: AIPage,
});

function AIPage() {
  return (
    <div>
      <PageHero eyebrow="AI Solutions" title="AI that ships to production" subtitle="Beyond demos — real, measurable AI deployments that create ROI." />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {aiSolutions.map((a) => {
            const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[a.icon] ?? Icons.Sparkles;
            return <FeatureCard key={a.title} icon={<Icon className="h-5 w-5" />} title={a.title} description={a.desc} />;
          })}
        </div>
      </Section>
      <CTABand title="What could AI do for you?" primary={{ label: "Book AI discovery", to: "/contact" }} />
    </div>
  );
}
