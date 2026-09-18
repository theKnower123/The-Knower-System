import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Card } from "@/components/public/blocks";
import { testimonials as staticTestimonials } from "@/mocks/marketing";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Route = createFileRoute("/_public/testimonials")({
  head: () => ({ meta: [{ title: "Testimonials — The Knower" }, { name: "description", content: "What our clients say." }] }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  const { data: dynamicTestimonials } = useQuery({
    queryKey: ['public', 'testimonials'],
    queryFn: async () => {
      const res = await axios.get('/api/v1/public/testimonials');
      return res.data.testimonials.map((t: any) => ({
        name: t.name, role: t.position, company: t.company, quote: t.content, avatar: t.avatar || "JD"
      }));
    }
  });
  const testimonials = dynamicTestimonials || staticTestimonials;

  return (
    <div>
      <PageHero eyebrow="Testimonials" title="What clients say" />
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t: any) => (
            <Card key={t.name}>
              <div className="flex gap-0.5 text-accent">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <p className="mt-4 text-sm leading-relaxed">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">{t.avatar}</div>
                <div><div className="text-sm font-semibold">{t.name}</div><div className="text-xs text-muted-foreground">{t.role} · {t.company}</div></div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
