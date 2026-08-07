import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section, CTABand, PricingCard, FeatureCard } from "@/components/public/blocks";
import { Cloud, Server, Zap, Shield, HardDrive, Activity, Layers } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_public/hosting")({
  head: () => ({
    meta: [
      { title: "Hosting & Cloud — The Knower" },
      { name: "description", content: "Managed hosting, cloud infrastructure, CDN, email and backups." },
    ],
  }),
  component: HostingPage,
});

function mapDbPlan(p: any) {
  return {
    name: p.name,
    price: { monthly: Number(p.price_monthly) || 0, yearly: Number(p.price_yearly) || 0 },
    blurb: p.blurb,
    features: Array.isArray(p.features) ? p.features : typeof p.features === 'string' ? JSON.parse(p.features) : [],
    highlight: !!p.highlight,
    cta: p.cta_text || undefined,
  };
}

function HostingPage() {
  const { t } = useTranslation();

  const { data: allPlans, isLoading } = useQuery({
    queryKey: ["public", "pricing"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/public/pricing");
      return (res.data.plans || []) as any[];
    },
  });

  const hostingPlans = allPlans?.filter((p) => p.plan_type === "hosting").map(mapDbPlan) || [];

  return (
    <div>
      <PageHero
        eyebrow={t("public.nav.hostingCloud", { defaultValue: "Hosting & Cloud" })}
        title={t("public.hostingPage.title", { defaultValue: "Managed hosting, worry-free" })}
        subtitle={t("public.hostingPage.subtitle", { defaultValue: "Cloud, servers, CDN, email and backups — one team, one bill." })}
      />
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
        <h2 className="font-display text-2xl font-semibold">{t("public.nav.hostingCloud", { defaultValue: "Hosting plans" })}</h2>
        <div className="mt-8">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-3 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 rounded-2xl border border-border bg-card/40 p-6" />
              ))}
            </div>
          ) : hostingPlans.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {hostingPlans.map((p: any) => <PricingCard key={p.name} plan={p} cycle="monthly" />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 p-10 text-center">
              <Layers className="h-6 w-6 text-primary mb-3" />
              <p className="text-sm text-muted-foreground">
                {t("public.pricingPage.noPlansDesc", { defaultValue: "Hosting plans are managed directly from the dashboard." })}
              </p>
              <Button asChild size="sm" variant="outline" className="mt-4">
                <Link to="/contact">{t("public.hero.startProject", { defaultValue: "Request a custom hosting quote" })}</Link>
              </Button>
            </div>
          )}
        </div>
      </Section>
      <CTABand title={t("public.hostingPage.cta", { defaultValue: "Need a custom architecture?" })} primary={{ label: t("public.hero.startProject", { defaultValue: "Talk to a cloud engineer" }), to: "/contact" }} />
    </div>
  );
}
