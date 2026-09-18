import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/public/blocks";
import { faqs as staticFaqs } from "@/mocks/marketing";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Route = createFileRoute("/_public/faq")({
  head: () => ({
    meta: [{ title: "FAQ — The Knower" }, { name: "description", content: "Answers to the most common questions." }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: staticFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }),
    }],
  }),
  component: FaqPage,
});

function FaqPage() {
  const { data: dynamicFaqs } = useQuery({
    queryKey: ['public', 'faqs'],
    queryFn: async () => {
      const res = await axios.get('/api/v1/public/faqs');
      return res.data.faqs.map((f: any) => ({
        q: f.question, a: f.answer, group: f.category || "General"
      }));
    }
  });
  const faqs = dynamicFaqs || staticFaqs;
  const groups = Array.from(new Set(faqs.map((f: any) => f.group)));

  return (
    <div>
      <PageHero eyebrow="FAQ" title="Frequently asked questions" />
      <Section>
        <div className="mx-auto max-w-3xl space-y-10">
          {groups.map((g: any) => (
            <div key={g}>
              <h2 className="font-display text-xl font-semibold">{g}</h2>
              <Accordion type="single" collapsible className="mt-4">
                {faqs.filter((f: any) => f.group === g).map((f: any, i: number) => (
                  <AccordionItem key={i} value={`${g}-${i}`}>
                    <AccordionTrigger className="text-start">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
