import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section, CTABand, Badge } from "@/components/public/blocks";
import { products } from "@/mocks/marketing";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_public/products/")({
  head: () => ({
    meta: [
      { title: "Products — The Knower" },
      { name: "description", content: "The Knower CRM, ERP, HR, POS, AI and CMS — one platform, six flagship products." },
      { property: "og:title", content: "Products — The Knower" },
    ],
    links: [{ rel: "canonical", href: "https://knower-all-in-one.lovable.app/products" }],
  }),
  component: ProductsIndex,
});

function ProductsIndex() {
  return (
    <div>
      <PageHero eyebrow="Products" title="One platform. Six flagship products." subtitle="Built on The Knower OS — extensible, bilingual, cloud-native." />
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link key={p.slug} to="/products/$slug" params={{ slug: p.slug }}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg">
              <Badge>{p.category}</Badge>
              <div className="mt-3 font-display text-xl font-semibold">{p.name}</div>
              <div className="text-sm text-primary">{p.tagline}</div>
              <p className="mt-3 text-sm text-muted-foreground">{p.description}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">Learn more <ArrowRight className="h-3.5 w-3.5" /></div>
            </Link>
          ))}
        </div>
      </Section>
      <CTABand title="Need a custom fit?" subtitle="Every product runs on The Knower OS — extend or white-label to your brand." primary={{ label: "Talk to sales", to: "/contact" }} />
    </div>
  );
}
