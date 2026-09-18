import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section, PricingCard, CTABand } from "@/components/public/blocks";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check, HelpCircle, Layers } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_public/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — The Knower" },
      { name: "description", content: "Pricing plans for The Knower OS platform, hosting and maintenance managed dynamically." },
      { property: "og:title", content: "Pricing — The Knower" },
    ],
  }),
  component: PricingPage,
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

function PricingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-80 rounded-2xl border border-border bg-card/40 p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="h-6 w-1/3 bg-muted rounded" />
            <div className="h-4 w-2/3 bg-muted/60 rounded" />
            <div className="h-10 w-1/2 bg-muted rounded mt-4" />
          </div>
          <div className="h-10 w-full bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

function EmptyPlansState({ category }: { category: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/30 p-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
        <Layers className="h-6 w-6" />
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground">
        {t("public.pricingPage.noPlansTitle", { defaultValue: "No plans configured" })} ({category})
      </h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {t("public.pricingPage.noPlansDesc", { defaultValue: "Pricing plans are directly managed from the system dashboard. Once configured in the admin panel, they will appear here automatically." })}
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild size="sm" variant="outline">
          <Link to="/contact">{t("public.pricingPage.contactSales", { defaultValue: "Contact sales for a custom quote" })}</Link>
        </Button>
      </div>
    </div>
  );
}

function PricingPage() {
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const { t } = useTranslation();

  const { data: allPlans, isLoading } = useQuery({
    queryKey: ["public", "pricing"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/public/pricing");
      return (res.data.plans || []) as any[];
    },
  });

  const softwarePlans = allPlans?.filter((p) => (p.plan_type ?? "software") === "software").map(mapDbPlan) || [];
  const hostingPlans = allPlans?.filter((p) => p.plan_type === "hosting").map(mapDbPlan) || [];
  const maintenancePlans = allPlans?.filter((p) => p.plan_type === "maintenance").map(mapDbPlan) || [];

  return (
    <div>
      <PageHero
        eyebrow={t("public.nav.pricing", { defaultValue: "Pricing" })}
        title={t("public.pricingPage.heroTitle", { defaultValue: "Flexible pricing, scaled to your needs" })}
        subtitle={t("public.pricingPage.heroSubtitle", { defaultValue: "All plans are dynamically managed from the dashboard and update instantly." })}
      />

      {/* Software Platform Plans */}
      <Section>
        <Tabs value={cycle} onValueChange={(v) => setCycle(v as typeof cycle)}>
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="monthly">{t("public.pricingPage.monthly", { defaultValue: "Monthly" })}</TabsTrigger>
              <TabsTrigger value="yearly">{t("public.pricingPage.yearly", { defaultValue: "Yearly" })}</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={cycle} className="mt-10">
            {isLoading ? (
              <PricingSkeleton />
            ) : softwarePlans.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {softwarePlans.map((p: any) => (
                  <PricingCard key={p.name} plan={p} cycle={cycle} />
                ))}
              </div>
            ) : (
              <EmptyPlansState category={t("public.nav.products", { defaultValue: "Software OS" })} />
            )}
          </TabsContent>
        </Tabs>
      </Section>

      {/* Hosting Plans */}
      <Section className="bg-muted/30">
        <h2 className="font-display text-2xl font-semibold">{t("public.nav.hostingCloud", { defaultValue: "Hosting plans" })}</h2>
        <p className="mt-2 text-muted-foreground">{t("public.pricingPage.hostingSubtitle", { defaultValue: "Managed cloud hosting with 24/7 monitoring." })}</p>
        <div className="mt-8">
          {isLoading ? (
            <PricingSkeleton />
          ) : hostingPlans.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {hostingPlans.map((p: any) => (
                <PricingCard key={p.name} plan={p} cycle={cycle} />
              ))}
            </div>
          ) : (
            <EmptyPlansState category={t("public.nav.hostingCloud", { defaultValue: "Hosting" })} />
          )}
        </div>
      </Section>

      {/* Maintenance Plans */}
      <Section>
        <h2 className="font-display text-2xl font-semibold">{t("public.nav.maintenance", { defaultValue: "Maintenance plans" })}</h2>
        <p className="mt-2 text-muted-foreground">{t("public.pricingPage.maintenanceSubtitle", { defaultValue: "Keep your software fast, secure and improving." })}</p>
        <div className="mt-8">
          {isLoading ? (
            <PricingSkeleton />
          ) : maintenancePlans.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {maintenancePlans.map((p: any) => (
                <PricingCard key={p.name} plan={p} cycle={cycle} />
              ))}
            </div>
          ) : (
            <EmptyPlansState category={t("public.nav.maintenance", { defaultValue: "Maintenance" })} />
          )}
        </div>
      </Section>

      {/* Feature Comparison Table (Renders when software plans exist) */}
      {softwarePlans.length > 0 && (
        <Section className="bg-muted/30">
          <h2 className="font-display text-2xl font-semibold">{t("public.pricingPage.compareTitle", { defaultValue: "Compare plans" })}</h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="p-4 text-start">{t("common.fields.title", { defaultValue: "Feature" })}</th>
                  {softwarePlans.map((p: any) => (
                    <th key={p.name} className="p-4 text-start font-semibold">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {["Users", "Projects", "Storage", "AI copilot", "SSO", "24/7 support"].map((row, ri) => (
                  <tr key={row} className="border-t border-border">
                    <td className="p-4 font-medium">{row}</td>
                    {softwarePlans.map((_: any, pi: number) => (
                      <td key={pi} className="p-4 text-muted-foreground">
                        {pi >= ri - 1 ? <Check className="h-4 w-4 text-primary" /> : "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      <CTABand
        title={t("public.cta.title", { defaultValue: "Need a custom quote?" })}
        subtitle={t("public.cta.subtitle", { defaultValue: "Talk to our engineering team for custom enterprise requirements." })}
        primary={{ label: t("public.hero.startProject", { defaultValue: "Contact sales" }), to: "/contact" }}
      />
    </div>
  );
}
