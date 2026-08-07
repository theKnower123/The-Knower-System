import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section, CTABand, PricingCard, FeatureCard } from "@/components/public/blocks";
import { Wrench, Shield, Activity, RefreshCw, Bug, TrendingUp, Layers } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_public/maintenance")({
  head: () => ({
    meta: [
      { title: "Maintenance Plans — The Knower" },
      { name: "description", content: "Keep your software fast, secure and continuously improving." },
    ],
  }),
  component: MaintenancePage,
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

function MaintenancePage() {
  const { t } = useTranslation();

  const { data: allPlans, isLoading } = useQuery({
    queryKey: ["public", "pricing"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/public/pricing");
      return (res.data.plans || []) as any[];
    },
  });

  const maintenancePlans = allPlans?.filter((p) => p.plan_type === "maintenance").map(mapDbPlan) || [];

  return (
    <div>
      <PageHero
        eyebrow={t("public.nav.maintenance", { defaultValue: "Maintenance" })}
        title={t("public.maintenancePage.title", { defaultValue: "Software that keeps getting better" })}
        subtitle={t("public.maintenancePage.subtitle", { defaultValue: "Security patches, performance tuning, bug fixes and continuous improvement." })}
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: <Shield className="h-5 w-5" />, title: "Security patches", description: "Weekly patching for OS, framework and dependencies." },
            { icon: <Activity className="h-5 w-5" />, title: "24/7 monitoring", description: "Uptime, performance and error tracking." },
            { icon: <RefreshCw className="h-5 w-5" />, title: "Daily backups", description: "Encrypted, tested, geo-redundant." },
            { icon: <Wrench className="h-5 w-5" />, title: "Updates", description: "Framework and library upgrades handled for you." },
            { icon: <Bug className="h-5 w-5" />, title: "Bug fixes", description: "SLA-backed response and resolution times." },
            { icon: <TrendingUp className="h-5 w-5" />, title: "Performance", description: "Quarterly performance audits and optimization." },
          ].map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </Section>

      <Section className="bg-muted/30">
        <h2 className="font-display text-2xl font-semibold">{t("public.nav.maintenance", { defaultValue: "Maintenance plans" })}</h2>
        <div className="mt-8">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-3 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 rounded-2xl border border-border bg-card/40 p-6" />
              ))}
            </div>
          ) : maintenancePlans.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {maintenancePlans.map((p: any) => <PricingCard key={p.name} plan={p} cycle="monthly" />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 p-10 text-center">
              <Layers className="h-6 w-6 text-primary mb-3" />
              <p className="text-sm text-muted-foreground">
                {t("public.pricingPage.noPlansDesc", { defaultValue: "Maintenance plans are managed directly from the dashboard." })}
              </p>
              <Button asChild size="sm" variant="outline" className="mt-4">
                <Link to="/contact">{t("public.hero.startProject", { defaultValue: "Request maintenance contract" })}</Link>
              </Button>
            </div>
          )}
        </div>
      </Section>
      <CTABand title={t("public.maintenancePage.cta", { defaultValue: "Emergency support needed?" })} subtitle={t("public.maintenancePage.ctaSub", { defaultValue: "24/7 hotline for critical issues." })} primary={{ label: t("public.nav.support", { defaultValue: "Contact support" }), to: "/support" }} />
    </div>
  );
}
