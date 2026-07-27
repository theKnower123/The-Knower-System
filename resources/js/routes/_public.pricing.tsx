import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section, PricingCard, CTABand, Card } from "@/components/public/blocks";
import { plans as staticPlans, hostingPlans as staticHostingPlans, maintenancePlans as staticMaintenancePlans } from "@/mocks/marketing";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Route = createFileRoute("/_public/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — The Knower" },
      { name: "description", content: "Transparent pricing for The Knower OS platform, hosting and maintenance. Yearly billing saves 20%." },
      { property: "og:title", content: "Pricing — The Knower" },
    ],
    links: [{ rel: "canonical", href: "https://knower-all-in-one.lovable.app/pricing" }],
  }),
  component: PricingPage,
});

// DB row -> the shape PricingCard expects. This was previously reading
// p.description / p.is_popular, which don't exist on marketing_plans --
// the real columns are `blurb` and `highlight`. That mismatch is why
// featured/description never actually showed real data before.
function mapDbPlan(p: any) {
  return {
    name: p.name,
    price: { monthly: Number(p.price_monthly) || 0, yearly: Number(p.price_yearly) || 0 },
    blurb: p.blurb,
    features: p.features || [],
    highlight: !!p.highlight,
    cta: p.cta_text || undefined,
  };
}

function PricingPage() {
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");

  const { data: allPlans } = useQuery({
    queryKey: ["public", "pricing"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/public/pricing");
      return (res.data.plans || []) as any[];
    },
  });

  // Split the one API response by plan_type instead of hitting 3 different
  // static mock arrays. A plan only shows up here once someone sets its
  // "Plan Type" in CMS > Pricing Plans (see the admin form fix).
  const softwarePlans = allPlans?.filter((p) => (p.plan_type ?? "software") === "software").map(mapDbPlan);
  const hostingPlans = allPlans?.filter((p) => p.plan_type === "hosting").map(mapDbPlan);
  const maintenancePlans = allPlans?.filter((p) => p.plan_type === "maintenance").map(mapDbPlan);

  const plansToUse = softwarePlans?.length ? softwarePlans : staticPlans;
  const hostingToUse = hostingPlans?.length ? hostingPlans : staticHostingPlans;
  const maintenanceToUse = maintenancePlans?.length ? maintenancePlans : staticMaintenancePlans;

  return (
    <div>
      <PageHero eyebrow="Pricing" title="Simple pricing, serious value" subtitle="Start free, scale when you're ready. Save 20% with yearly billing." />
      <Section>
        <Tabs value={cycle} onValueChange={(v) => setCycle(v as typeof cycle)}>
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly · save 20%</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={cycle} className="mt-10">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {plansToUse.map((p: any) => <PricingCard key={p.name} plan={p} cycle={cycle} />)}
            </div>
          </TabsContent>
        </Tabs>
      </Section>

      <Section className="bg-muted/30">
        <h2 className="font-display text-2xl font-semibold">Hosting plans</h2>
        <p className="mt-2 text-muted-foreground">Managed cloud hosting with 24/7 monitoring.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {hostingToUse.map((p: any) => <PricingCard key={p.name} plan={p} cycle={cycle} />)}
        </div>
      </Section>

      <Section>
        <h2 className="font-display text-2xl font-semibold">Maintenance plans</h2>
        <p className="mt-2 text-muted-foreground">Keep your software fast, secure and improving.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {maintenanceToUse.map((p: any) => <PricingCard key={p.name} plan={p} cycle={cycle} />)}
        </div>
      </Section>

      <Section className="bg-muted/30">
        <h2 className="font-display text-2xl font-semibold">Add-ons</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Domain registration", price: "from $12/yr", desc: ".com, .io, .co, .ai and more." },
            { name: "SSL certificate", price: "Free", desc: "Included with all hosting plans." },
            { name: "Premium support", price: "+$99/mo", desc: "1-hour response SLA, direct Slack channel." },
            { name: "Extra storage", price: "$0.10/GB", desc: "S3-backed object storage." },
            { name: "AI credits", price: "$29/1M tokens", desc: "For your AI copilot usage." },
            { name: "Dedicated CSM", price: "+$999/mo", desc: "Named success manager." },
          ].map((a) => (
            <Card key={a.name}>
              <div className="flex items-start justify-between gap-3">
                <div className="font-display text-base font-semibold">{a.name}</div>
                <span className="text-sm font-semibold text-primary">{a.price}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="font-display text-2xl font-semibold">Compare plans</h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="p-4 text-start">Feature</th>
                {plansToUse.map((p: any) => <th key={p.name} className="p-4 text-start font-semibold">{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {["Users", "Projects", "Storage", "AI copilot", "SSO", "24/7 support", "Custom SLA"].map((row, ri) => (
                <tr key={row} className="border-t border-border">
                  <td className="p-4 font-medium">{row}</td>
                  {plansToUse.map((_: any, pi: number) => (
                    <td key={pi} className="p-4 text-muted-foreground">
                      {pi >= ri - 1 ? <Check className="h-4 w-4 text-primary" /> : "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="outline"><Link to="/faq">Read the pricing FAQ</Link></Button>
        </div>
      </Section>

      <CTABand title="Need a custom quote?" primary={{ label: "Contact sales", to: "/contact" }} />
    </div>
  );
}
