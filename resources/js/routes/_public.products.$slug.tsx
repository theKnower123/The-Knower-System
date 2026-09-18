import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { PageHero, Section, CTABand, Card, Badge } from "@/components/public/blocks";
import { products } from "@/mocks/marketing";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/_public/products/$slug")({
  loader: ({ params }) => {
    const p = products.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Product"} — The Knower` },
      { name: "description", content: loaderData?.description ?? "" },
      { property: "og:title", content: `${loaderData?.name ?? "Product"} — The Knower` },
      { property: "og:type", content: "product" },
    ],
    scripts: loaderData ? [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org", "@type": "Product",
        name: loaderData.name, description: loaderData.description, category: loaderData.category,
        brand: { "@type": "Brand", name: "The Knower" },
      }),
    }] : [],
  }),
  component: ProductPage,
});

function ProductPage() {
  const p = Route.useLoaderData();
  return (
    <div>
      <PageHero eyebrow={p.category} title={p.name} subtitle={p.tagline}
        actions={<>
          <Button asChild size="lg"><Link to="/contact">Book a demo</Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/pricing">See pricing</Link></Button>
        </>} />
      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <Badge>Overview</Badge>
            <h2 className="mt-3 font-display text-2xl font-semibold">Why {p.name}</h2>
            <p className="mt-3 text-muted-foreground">{p.description}</p>
            <h3 className="mt-8 font-display text-lg font-semibold">Key features</h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {p.features.map((f: string) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{f}</span>
                </li>
              ))}
            </ul>
          </Card>
          <div className="space-y-6">
            <Card>
              <h3 className="font-display text-base font-semibold">Highlights</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>· Bilingual EN/AR with full RTL</li>
                <li>· Cloud, on-prem or hybrid</li>
                <li>· Open API & webhooks</li>
                <li>· 24/7 enterprise support</li>
              </ul>
            </Card>
            <Card>
              <h3 className="font-display text-base font-semibold">Try it live</h3>
              <p className="mt-2 text-sm text-muted-foreground">Explore a role-based demo of The Knower OS in your browser.</p>
              <Button asChild className="mt-4 w-full"><a href="/login">Open demo</a></Button>
            </Card>
          </div>
        </div>
      </Section>
      <CTABand title={`Ready to try ${p.name}?`} primary={{ label: "Book a demo", to: "/contact" }} secondary={{ label: "See pricing", to: "/pricing" }} />
    </div>
  );
}
