import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Plan } from "@/mocks/marketing";
import { useTranslation } from "react-i18next";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8", className)}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
      <Sparkles className="h-3 w-3" />
      {children}
    </span>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, align = "start" }: {
  eyebrow?: string; title: ReactNode; subtitle?: ReactNode; align?: "start" | "center";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && <div className="mb-4"><Eyebrow>{eyebrow}</Eyebrow></div>}
      <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base text-muted-foreground sm:text-lg">{subtitle}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, subtitle, actions }: {
  eyebrow?: string; title: ReactNode; subtitle?: ReactNode; actions?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_60%)]" />
      <Container className="relative py-20 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          {eyebrow && <div className="mb-5 flex justify-center"><Eyebrow>{eyebrow}</Eyebrow></div>}
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {subtitle && <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">{subtitle}</p>}
          {actions && <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div>}
        </div>
      </Container>
    </section>
  );
}

export function StatCounter({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/50 p-6 text-center backdrop-blur">
      <div className="font-display text-3xl font-bold text-primary sm:text-4xl">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

export function FeatureCard({ icon, title, description, href }: {
  icon?: ReactNode; title: string; description: string; href?: string;
}) {
  const body = (
    <div className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      {icon && (
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {href && (
        <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
          Learn more <ArrowRight className="h-3.5 w-3.5" />
        </div>
      )}
    </div>
  );
  return href ? <Link to={href as never}>{body}</Link> : body;
}

export function PricingCard({ plan, cycle, onContact }: { plan: Plan; cycle: "monthly" | "yearly"; onContact?: () => void }) {
  const { t } = useTranslation();
  const price = plan.price ? plan.price[cycle] : 0;
  return (
    <div className={cn(
      "relative flex flex-col rounded-2xl border p-6 sm:p-8",
      plan.highlight ? "border-primary bg-primary/5 shadow-xl shadow-primary/10" : "border-border bg-card",
    )}>
      {plan.highlight && (
        <span className="absolute -top-3 start-6 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
          {t("public.pricingPage.mostPopular", { defaultValue: "Most popular" })}
        </span>
      )}
      {/* Plan name */}
      <div className="font-display text-lg font-semibold">{plan.name}</div>

      {/* Blurb — contained in a min-height box so cards stay aligned */}
      <div className="mt-2 min-h-[3.5rem]">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{plan.blurb}</p>
      </div>

      {/* Price */}
      <div className="mt-5 border-t border-border/50 pt-5">
        {price === 0 ? (
          <div className="font-display text-3xl font-bold">{t("public.pricingPage.custom", { defaultValue: "Custom" })}</div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="font-display text-4xl font-bold">${price.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">/{cycle === "monthly" ? t("public.pricingPage.mo", { defaultValue: "mo" }) : t("public.pricingPage.yr", { defaultValue: "yr" })}</span>
          </div>
        )}
      </div>

      {/* Features */}
      <ul className="mt-5 flex-1 space-y-2.5 text-sm">
        {(plan.features || []).map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="text-foreground/90">{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA — links to contact with plan pre-selected */}
      <Link to="/contact" search={{ plan: plan.name }} className="mt-8 block">
        <Button className="w-full" variant={plan.highlight ? "default" : "outline"}>
          {plan.cta ?? t("public.pricingPage.getStarted", { defaultValue: "Get started" })}
        </Button>
      </Link>
    </div>
  );
}

export function LogoCloud({ names }: { names: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {names.map((n) => (
        <div key={n} className="flex h-16 items-center justify-center rounded-xl border border-border bg-card/50 font-display text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
          {n}
        </div>
      ))}
    </div>
  );
}

export function CTABand({ title, subtitle, primary, secondary }: {
  title: string; subtitle?: string; primary?: { label: string; to: string }; secondary?: { label: string; to: string };
}) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-primary/5 to-accent/10 p-10 sm:p-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h3 className="font-display text-2xl font-semibold text-foreground sm:text-3xl md:text-4xl">{title}</h3>
              {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="flex flex-wrap gap-3">
              {primary && (
                <Button asChild size="lg"><Link to={primary.to as never}>{primary.label}</Link></Button>
              )}
              {secondary && (
                <Button asChild size="lg" variant="outline"><Link to={secondary.to as never}>{secondary.label}</Link></Button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function Section({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("py-16 sm:py-20", className)}><Container>{children}</Container></section>;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-border bg-card p-6", className)}>{children}</div>;
}

export function Badge({ children, variant }: { children: ReactNode; variant?: "default" | "outline" }) {
  if (variant === "outline") {
    return (
      <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
        {children}
      </span>
    );
  }
  return <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">{children}</span>;
}
