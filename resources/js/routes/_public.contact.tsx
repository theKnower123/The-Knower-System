import { useState, useEffect } from "react";
import axios from "axios";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { PageHero, Section, Card } from "@/components/public/blocks";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, MessageCircle, CheckCircle2, Calendar, X, ExternalLink, Users, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_public/contact")({
  validateSearch: (s: Record<string, unknown>) => ({
    plan: (s.plan as string) || "",
  }),
  head: () => ({
    meta: [
      { title: "Contact — The Knower" },
      { name: "description", content: "Talk to sales, book a demo, or reach us via WhatsApp." },
    ],
  }),
  component: ContactPage,
});

// ─── WhatsApp SVG ─────────────────────────────────────────────────────────────
function WaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── Book Demo Modal ──────────────────────────────────────────────────────────
function BookDemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post("/api/v1/public/demo-request", { name, email });
      setDone(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t("contact.errorGeneric"));
    } finally { setSending(false); }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
        {done ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold">{t("contact.demo.received")}</h3>
            <p className="text-sm text-muted-foreground">{t("contact.demo.receivedDesc")}</p>
            <Button className="mt-2 w-full" onClick={onClose}>{t("common.close", { defaultValue: "Close" })}</Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">{t("contact.demo.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("contact.demo.subtitle")}</p>
              </div>
            </div>
            <div className="mb-6 rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-2">{t("contact.demo.howItWorks")}</p>
              <ol className="space-y-1.5 list-none">
                {[t("contact.demo.step1"), t("contact.demo.step2"), t("contact.demo.step3")].map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="demo-name">{t("contact.form.name")}</Label>
                <Input id="demo-name" required value={name} onChange={e => setName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="demo-email">{t("contact.form.workEmail")}</Label>
                <Input id="demo-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className="mt-1" />
              </div>
              <Button type="submit" className="w-full" disabled={sending}>
                {sending ? t("common.loading") : t("contact.demo.request")}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Success State ────────────────────────────────────────────────────────────
function SuccessState({ onReset, whatsappUrl }: { onReset: () => void; whatsappUrl?: string | null }) {
  const { t } = useTranslation();
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <BookDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        {/* Success icon */}
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <span className="absolute -right-1 -top-1 text-2xl">🎉</span>
        </div>

        <div>
          <h3 className="font-display text-2xl font-bold text-foreground">{t("contact.success.title")}</h3>
          <p className="mt-2 text-muted-foreground max-w-sm mx-auto">{t("contact.success.subtitle")}</p>
        </div>

        {/* WhatsApp — highest priority */}
        <div className="w-full max-w-sm">
          <p className="mb-3 text-sm font-semibold text-foreground">{t("contact.success.whatsappPrompt")}</p>
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full rounded-2xl border-2 border-[#25D366] bg-[#25D366] px-5 py-4 text-base font-bold text-white shadow-lg shadow-[#25D366]/30 hover:bg-[#20b858] hover:shadow-[#25D366]/40 transition-all active:scale-95"
            >
              <WaIcon className="h-5 w-5" />
              {t("contact.success.joinGroup")}
              <ExternalLink className="h-4 w-4 opacity-80" />
            </a>
          ) : (
            <div className="flex items-center justify-center gap-3 w-full rounded-2xl border-2 border-dashed border-[#25D366]/40 bg-[#25D366]/5 px-5 py-4 text-sm font-medium text-muted-foreground">
              <WaIcon className="h-5 w-5 text-[#25D366]" />
              {t("contact.success.whatsappComingSoon")}
            </div>
          )}
        </div>

        {/* Secondary options */}
        <div className="w-full max-w-sm space-y-2.5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("contact.success.orReachUs")}</p>
          <a
            href="mailto:theknoweros@outlook.com"
            className="flex items-center gap-3 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold hover:border-primary/40 transition-colors"
          >
            <Mail className="h-4 w-4 text-primary shrink-0" />
            theknoweros@outlook.com
          </a>
          <button
            onClick={() => setDemoOpen(true)}
            className="flex items-center gap-3 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold hover:border-primary/40 transition-colors text-left"
          >
            <Calendar className="h-4 w-4 text-primary shrink-0" />
            {t("contact.success.bookDemo")}
          </button>
        </div>

        <button onClick={onReset} className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">
          {t("contact.success.sendAnother")}
        </button>
      </div>
    </>
  );
}

// ─── Main Contact Page ────────────────────────────────────────────────────────
function ContactPage() {
  const { t } = useTranslation();
  const search = useSearch({ from: "/_public/contact" });
  const preselectedPlan = search.plan || "";

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(preselectedPlan);

  useEffect(() => { setSelectedPlan(preselectedPlan); }, [preselectedPlan]);

  // Fetch social links
  const { data: socialData } = useQuery({
    queryKey: ["public", "social-links"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/public/social-links");
      return (res.data.links || []) as { platform: string; url: string | null; label: string }[];
    },
  });

  // Fetch pricing plans (for selector when no plan pre-selected)
  const { data: pricingData } = useQuery({
    queryKey: ["public", "pricing"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/public/pricing");
      return (res.data.plans || []) as { id: number; name: string }[];
    },
  });

  const whatsappLink = socialData?.find(l => l.platform === "whatsapp")?.url ?? null;
  const allPlans = pricingData ?? [];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setSending(true);
    try {
      await axios.post("/api/v1/public/contact", {
        name: data.get("name"),
        company: data.get("company") || null,
        email: data.get("email"),
        phone: data.get("phone") || null,
        whatsapp_number: data.get("whatsapp_number") || null,
        message: data.get("message"),
        plan: selectedPlan || null,
        inquiry_type: selectedPlan ? "pricing_plan" : "general",
      });
      setSent(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t("contact.errorGeneric"));
    } finally { setSending(false); }
  }

  return (
    <>
      <BookDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      <PageHero
        eyebrow={t("contact.eyebrow")}
        title={t("contact.hero.title")}
        subtitle={t("contact.hero.subtitle")}
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">

          {/* ─── LEFT: Form ─── */}
          <Card>
            {sent ? (
              <SuccessState onReset={() => setSent(false)} whatsappUrl={whatsappLink} />
            ) : (
              <>
                <h2 className="font-display text-xl font-semibold">{t("contact.form.heading")}</h2>

                {/* Plan badge — shown if pre-selected from pricing page */}
                {preselectedPlan && (
                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground">{t("contact.form.selectedPlan")}</p>
                      <p className="font-display text-base font-bold text-primary">{preselectedPlan}</p>
                    </div>
                    <Link to="/pricing" className="text-xs text-muted-foreground underline hover:text-foreground transition-colors">
                      {t("contact.form.seePricing")}
                    </Link>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="c-name">{t("contact.form.name")} *</Label>
                    <Input id="c-name" name="name" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="c-company">{t("contact.form.company")}</Label>
                    <Input id="c-company" name="company" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="c-email">{t("contact.form.email")} *</Label>
                    <Input id="c-email" name="email" type="email" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="c-phone">{t("contact.form.phone")}</Label>
                    <Input id="c-phone" name="phone" className="mt-1" />
                  </div>

                  {/* WhatsApp number field */}
                  <div className="sm:col-span-2">
                    <Label htmlFor="c-wa" className="flex items-center gap-1.5">
                      <WaIcon className="h-3.5 w-3.5 text-[#25D366]" />
                      {t("contact.form.whatsapp")}
                    </Label>
                    <Input id="c-wa" name="whatsapp_number" placeholder="+966 5X XXX XXXX" className="mt-1" />
                    <p className="mt-1 text-xs text-muted-foreground">{t("contact.form.whatsappHint")}</p>
                  </div>

                  {/* Plan selector — only if NOT pre-selected from pricing */}
                  {!preselectedPlan && allPlans.length > 0 && (
                    <div className="sm:col-span-2">
                      <Label>{t("contact.form.interestedPlan")}</Label>
                      <Select onValueChange={setSelectedPlan} value={selectedPlan}>
                        <SelectTrigger className="mt-1 w-full">
                          <SelectValue placeholder={t("contact.form.planPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">{t("contact.form.noPlan")}</SelectItem>
                          {allPlans.map((p: any) => (
                            <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedPlan && (
                        <p className="mt-1.5 text-xs text-primary flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {t("contact.form.planTagged", { plan: selectedPlan })}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <Label htmlFor="c-message">{t("contact.form.message")} *</Label>
                    <Textarea id="c-message" name="message" rows={4} required className="mt-1" />
                  </div>
                  <div className="sm:col-span-2">
                    <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={sending}>
                      {sending ? t("contact.form.sending") : t("contact.form.send")}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </Card>

          {/* ─── RIGHT: Contact info ─── */}
          <div className="space-y-4">
            {/* WhatsApp Group — highest priority */}
            {whatsappLink ? (
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Card className="flex items-center gap-4 border-[#25D366]/40 bg-gradient-to-br from-[#25D366]/10 to-[#25D366]/5 hover:border-[#25D366] hover:shadow-lg hover:shadow-[#25D366]/10 transition-all cursor-pointer">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-md shadow-[#25D366]/30">
                    <WaIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#25D366]">{t("contact.whatsapp.label")}</div>
                    <div className="font-display font-bold text-foreground">{t("contact.whatsapp.joinCommunity")}</div>
                    <div className="text-xs text-muted-foreground">{t("contact.whatsapp.faster")}</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                </Card>
              </a>
            ) : (
              <Card className="flex items-center gap-4 border-dashed border-[#25D366]/30">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366]">
                  <WaIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("contact.whatsapp.label")}</div>
                  <div className="font-display font-semibold text-muted-foreground">{t("contact.whatsapp.comingSoon")}</div>
                </div>
              </Card>
            )}

            {/* Email */}
            <a href="mailto:theknoweros@outlook.com">
              <Card className="flex items-center gap-4 hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("contact.email.label")}</div>
                  <div className="font-display font-semibold">theknoweros@outlook.com</div>
                </div>
              </Card>
            </a>

            {/* Book Demo */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold">{t("contact.demo.title")}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{t("contact.demo.cardDesc")}</p>
                  <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <li>📋 {t("contact.demo.how1")}</li>
                    <li>⏱ {t("contact.demo.how2")}</li>
                  </ul>
                </div>
              </div>
              <Button className="mt-4 w-full" onClick={() => setDemoOpen(true)}>
                {t("contact.demo.request")}
              </Button>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
