import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, CTABand, PricingCard, FeatureCard } from "@/components/public/blocks";
import { hostingPlans as staticHostingPlans } from "@/mocks/marketing";
import { Cloud, Server, Zap, Shield, HardDrive, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Route = createFileRoute("/_public/hosting")({
  head: () => ({
    meta: [
      { title: "Hosting & Cloud — The Knower" },
      { name: "description", content: "Managed hosting, cloud infrastructure, CDN, email and backups." },
    ],
  }),
  component: HostingPage,
});

// Same mapping used on /pricing -- real columns are blurb/highlight/cta_text,
// not description/is_popular.
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

function HostingPage() {
  const { data: allPlans } = useQuery({
    queryKey: ["public", "pricing"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/public/pricing");
      return (res.data.plans || []) as any[];
    },
  });

  // Only plans created in CMS > Pricing Plans with Plan Type = "hosting"
  // show up here. Falls back to the old static demo plans if none exist
  // yet, so the page never looks empty during setup.
  const dbHostingPlans = allPlans?.filter((p) => p.plan_type === "hosting").map(mapDbPlan);
  const hostingPlans = dbHostingPlans?.length ? dbHostingPlans : staticHostingPlans;

  return (
    <div>
      <PageHero eyebrow="Hosting & Cloud" title="Managed hosting, worry-free" subtitle="Cloud, servers, CDN, email and backups — one team, one bill." />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: <Cloud className="h-5 w-5" />, title: "Managed cloud", description: "Fully managed on AWS, Azure, GCP or Cloudflare." },
            { icon: <Server className="h-5 w-5" />, title: "Dedicated servers", description: "Bare-metal performance for demanding workloads." },
            { icon: <Zap className="h-5 w-5" />, title: "Global CDN", description: "200+ edge locations for instant delivery worldwide." },
            { icon: <Shield className="h-5 w-5" />, title: "DDoS protection", description: "Enterprise-grade WAF and DDoS mitigation." },
            { icon: <HardDrive className="h-5 w-5" />, title: "Backups", description: "Daily encrypted backups with 30-day retention." },
            { icon: <Activity className="h-5 w-5" />, title: "24/7 monitoring", description: "Real-time alerts, on-call engineers, SLA-backed." },
          ].map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </Section>
      <Section className="bg-muted/30">
        <h2 className="font-display text-2xl font-semibold">Hosting plans</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {hostingPlans.map((p: any) => <PricingCard key={p.name} plan={p} cycle="monthly" />)}
        </div>
      </Section>
      <CTABand title="Need a custom architecture?" primary={{ label: "Talk to a cloud engineer", to: "/contact" }} />
    </div>
  );
}
