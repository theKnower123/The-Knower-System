import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, CTABand, Card } from "@/components/public/blocks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/_public/domains")({
  head: () => ({
    meta: [
      { title: "Domains & SSL — The Knower" },
      { name: "description", content: "Search, register, transfer and renew domains. Free SSL included." },
    ],
  }),
  component: DomainsPage,
});

const PRICING = [
  { tld: ".com", price: 12.99 }, { tld: ".io", price: 39.99 }, { tld: ".co", price: 24.99 },
  { tld: ".ai", price: 89.99 }, { tld: ".dev", price: 14.99 }, { tld: ".app", price: 15.99 },
  { tld: ".net", price: 14.99 }, { tld: ".org", price: 13.99 },
];

function DomainsPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Array<{ tld: string; price: number; available: boolean }>>([]);
  const search = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setResults(PRICING.map((p) => ({ ...p, available: Math.random() > 0.3 })));
  };
  return (
    <div>
      <PageHero eyebrow="Domains" title="Find your perfect domain" subtitle="Search, register, transfer and renew — with free SSL bundled in." />
      <Section>
        <form onSubmit={search} className="mx-auto flex max-w-2xl gap-2">
          <Input placeholder="Search a domain name…" value={q} onChange={(e) => setQ(e.target.value)} className="h-12 text-base" />
          <Button type="submit" size="lg">Search</Button>
        </form>
        {results.length > 0 && (
          <div className="mx-auto mt-8 max-w-2xl space-y-2">
            {results.map((r) => (
              <div key={r.tld} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  {r.available ? <Check className="h-5 w-5 text-emerald-500" /> : <X className="h-5 w-5 text-destructive" />}
                  <span className="font-display font-semibold">{q}{r.tld}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold">${r.price}/yr</span>
                  {r.available && <Button size="sm" onClick={() => toast.success(`${q}${r.tld} added to cart`)}>Register</Button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
      <Section className="bg-muted/30">
        <h2 className="font-display text-2xl font-semibold">Popular TLDs</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PRICING.map((p) => (
            <Card key={p.tld}><div className="flex items-center justify-between"><span className="font-display text-lg font-bold">{p.tld}</span><span className="text-sm font-semibold text-primary">${p.price}/yr</span></div></Card>
          ))}
        </div>
      </Section>
      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          <Card><h3 className="font-display text-base font-semibold">Transfer domain</h3><p className="mt-2 text-sm text-muted-foreground">Move an existing domain to us. Free for the first year.</p></Card>
          <Card><h3 className="font-display text-base font-semibold">Renew</h3><p className="mt-2 text-sm text-muted-foreground">Auto-renew or one-click renewal on all TLDs.</p></Card>
          <Card><h3 className="font-display text-base font-semibold">WHOIS privacy</h3><p className="mt-2 text-sm text-muted-foreground">Included free with every registration.</p></Card>
        </div>
      </Section>
      <CTABand title="Need a bulk domain plan?" primary={{ label: "Contact sales", to: "/contact" }} />
    </div>
  );
}
