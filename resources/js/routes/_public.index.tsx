import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Globe, Smartphone, Server, Cloud, Brain, Palette,
  ShieldCheck, LineChart, Sparkles, Code, Search, Megaphone,
  Wrench, Monitor, Zap, Award, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/public/blocks";
import { ScrollReveal, StaggerReveal } from "@/components/public/ScrollReveal";
import { ParticleCanvas } from "@/components/public/ParticleCanvas";
import { useCountUp, useMagneticEffect, useParallax, useTextScramble } from "@/hooks/useAnimations";
import { stats, services, products, trustedBy } from "@/mocks/marketing";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "The Knower — The operating system for software houses" },
      { name: "description", content: "CRM, projects, hosting, HR, invoicing and an AI copilot — one platform to build products, run operations, and delight every client." },
    ],
  }),
  component: HomePage,
});

const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "web-development": Globe, "mobile-apps": Smartphone, "cloud": Cloud, "hosting": Server,
  "consulting": Brain, "branding": Palette, "maintenance": Wrench, "seo": Search,
  "api": Code, "desktop": Monitor, "marketing": Megaphone,
};

// ─── Animated stat counter ────────────────────────────────────────────────
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const isNumber = /[\d.]+/.test(value);
  const numericPart = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
  const prefix = value.match(/^[^0-9]*/)?.[0] ?? "";
  const suffix = value.match(/[^0-9.]+$/)?.[0] ?? "";
  const { ref, text } = useCountUp(numericPart, 2000, prefix, suffix);

  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm">
      <span
        ref={ref}
        className="font-display text-4xl font-bold text-primary sm:text-5xl"
      >
        {isNumber ? text : value}
      </span>
      <span className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
    </div>
  );
}

// ─── 3-D flip service card ─────────────────────────────────────────────────
function FlipCard({ slug, icon: Icon, title, tagline, description, deliverables, learnMore }: {
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string; tagline: string; description: string; deliverables: string[]; learnMore: string;
}) {
  return (
    <div className="group relative h-52 [perspective:800px] cursor-pointer" style={{ WebkitPerspective: "800px" }}>
      <div
        className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm [backface-visibility:hidden]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-primary/30 bg-primary/5 p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-sm leading-relaxed text-foreground/80">{description}</p>
          <ul className="mt-3 space-y-1">
            {(deliverables || []).slice(0, 3).map((d) => (
              <li key={d} className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                {d}
              </li>
            ))}
          </ul>
          <Link to="/services/$slug" params={{ slug }} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
            {learnMore} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Product card ──────────────────────────────────────────────────────────
function ProductCard({ name, tagline, description, category, slug, explore }: {
  name: string; tagline: string; description: string; category: string; slug: string; explore: string;
}) {
  return (
    <Link
      to="/products/$slug"
      params={{ slug }}
      className="group flex flex-col rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/8"
    >
      <span className="self-start rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
        {category}
      </span>
      <h3 className="mt-4 font-display text-xl font-semibold text-foreground">{name}</h3>
      <p className="mt-1 text-sm font-medium text-primary">{tagline}</p>
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-auto pt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:gap-2.5">
        {explore} <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
      </div>
    </Link>
  );
}

// ─── Why-us pillar ────────────────────────────────────────────────────────
function Pillar({ icon: Icon, title, body, index }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string; body: string; index: number;
}) {
  return (
    <div className="relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
      <span className="font-display text-6xl font-bold text-border select-none absolute -top-3 right-6">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

// ─── Magnetic CTA button ──────────────────────────────────────────────────
function MagneticButton({ children, to, variant = "primary" }: {
  children: React.ReactNode; to: string; variant?: "primary" | "outline";
}) {
  const ref = useMagneticEffect<HTMLAnchorElement>(0.3);
  return (
    <Link
      to={to as never}
      ref={ref}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-200",
        variant === "primary"
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02]"
          : "border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-muted"
      )}
    >
      {children}
    </Link>
  );
}

// ─── Scrolling ticker ─────────────────────────────────────────────────────
function LogoTicker({ names }: { names: string[] }) {
  const doubled = [...names, ...names];
  return (
    <div className="overflow-hidden">
      <div className="flex gap-6 whitespace-nowrap" style={{ animation: "ticker 30s linear infinite" }}>
        {doubled.map((name, i) => (
          <div key={i} className="flex h-12 shrink-0 items-center justify-center rounded-xl border border-border bg-card/60 px-6 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────
function HomePage() {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const parallaxOrb1 = useParallax<HTMLDivElement>(0.12);
  const parallaxOrb2 = useParallax<HTMLDivElement>(-0.08);
  const headlineScramble = useTextScramble(t("public.hero.title2"), 1100);

  const pillars = [
    { icon: ShieldCheck, titleKey: "senior", bodyKey: "senior" },
    { icon: LineChart, titleKey: "outcomes", bodyKey: "outcomes" },
    { icon: Zap, titleKey: "ai", bodyKey: "ai" },
    { icon: Globe, titleKey: "bilingual", bodyKey: "bilingual" },
    { icon: Cloud, titleKey: "cloud", bodyKey: "cloud" },
    { icon: Award, titleKey: "product", bodyKey: "product" },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Global animation keyframes */}
      <style>{`
        @keyframes ticker { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
        @keyframes float1 { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-24px) } }
        @keyframes float2 { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(20px) } }
        @keyframes float3 { 0%,100% { transform: translateY(0px) rotate(0deg) } 50% { transform: translateY(-16px) rotate(4deg) } }
        @keyframes pulse-glow { 0%,100% { opacity:0.3; transform:scale(1) } 50% { opacity:0.6; transform:scale(1.06) } }
        @keyframes gradient-shift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
      `}</style>

      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-20">
        {/* Particle canvas */}
        <div className="absolute inset-0 z-0 opacity-60">
          <ParticleCanvas count={65} color={isDark ? "140,110,255" : "99,80,200"} />
        </div>

        {/* Ambient orbs */}
        <div
          ref={parallaxOrb1}
          className="pointer-events-none absolute -left-48 top-1/4 h-[600px] w-[600px] rounded-full opacity-15 dark:opacity-20"
          style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)", animation: "float1 9s ease-in-out infinite" }}
        />
        <div
          ref={parallaxOrb2}
          className="pointer-events-none absolute -right-32 bottom-1/4 h-[500px] w-[500px] rounded-full opacity-10 dark:opacity-15"
          style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)", animation: "float2 11s ease-in-out infinite" }}
        />

        {/* Subtle grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />

        <Container className="relative z-10 py-24 text-center">
          {/* Eyebrow */}
          <ScrollReveal variant="fade-down" duration={700}>
            <Eyebrow>{t("public.hero.tagline")}</Eyebrow>
          </ScrollReveal>

          {/* Headline */}
          <ScrollReveal variant="blur-up" delay={140} duration={900}>
            <h1 className="mt-8 font-display text-5xl font-bold leading-[1.04] tracking-tight text-foreground sm:text-7xl lg:text-8xl">
              {t("public.hero.title1")}{" "}
              <span
                ref={headlineScramble.ref as React.RefObject<HTMLSpanElement>}
                className="inline-block bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent"
                style={{ backgroundSize: "200% 200%", animation: "gradient-shift 4s ease infinite" }}
              >
                {headlineScramble.output}
              </span>
            </h1>
          </ScrollReveal>

          {/* Subtitle */}
          <ScrollReveal variant="fade-up" delay={280} duration={700}>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {t("public.hero.subtitle")}
            </p>
          </ScrollReveal>

          {/* CTAs */}
          <ScrollReveal variant="fade-up" delay={420} duration={600}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <MagneticButton to="/contact" variant="primary">
                {t("public.hero.startProject")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </MagneticButton>
              <MagneticButton to="/portfolio" variant="outline">
                {t("public.hero.seeWork")}
              </MagneticButton>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal variant="fade-up" delay={560} duration={800}>
            <StaggerReveal stagger={90} variant="scale" className="mx-auto mt-20 grid max-w-4xl gap-4 sm:grid-cols-2 md:grid-cols-4">
              {stats.map((s) => (
                <AnimatedStat key={s.label} value={s.value} label={s.label} />
              ))}
            </StaggerReveal>
          </ScrollReveal>
        </Container>

        {/* Scroll indicator */}
        <ScrollReveal variant="fade" delay={900} duration={600}>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50">{t("public.hero.scroll")}</span>
            <div className="h-10 w-5 rounded-full border border-border flex items-start justify-center pt-1.5">
              <div className="h-2 w-1 rounded-full bg-primary" style={{ animation: "float2 1.8s ease-in-out infinite" }} />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── TRUSTED BY TICKER ─────────────────────────────────────────── */}
      <section className="py-12 border-y border-border/50">
        <ScrollReveal variant="fade" duration={500}>
          <p className="mb-6 text-center text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {t("public.trustedBy")}
          </p>
          <LogoTicker names={trustedBy} />
        </ScrollReveal>
      </section>

      {/* ─── SERVICES ── Flip cards ──────────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="mb-16">
            <ScrollReveal variant="fade-right" duration={700}>
              <span className="text-[10px] uppercase tracking-[0.18em] text-primary font-bold">
                {t("public.services.eyebrow")}
              </span>
              <h2 className="mt-3 font-display text-4xl font-bold text-foreground sm:text-5xl md:text-6xl max-w-xl leading-tight">
                {t("public.services.title")}
              </h2>
              <p className="mt-5 max-w-lg text-base text-muted-foreground leading-relaxed">
                {t("public.services.subtitle")}
              </p>
            </ScrollReveal>
          </div>

          <StaggerReveal stagger={55} variant="fade-up" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.slice(0, 8).map((s) => {
              const Icon = SERVICE_ICONS[s.slug] ?? Sparkles;
              return (
                <FlipCard
                  key={s.slug}
                  slug={s.slug}
                  icon={Icon}
                  title={s.name}
                  tagline={s.tagline}
                  description={s.description}
                  deliverables={s.deliverables}
                  learnMore={t("public.services.learnMore")}
                />
              );
            })}
          </StaggerReveal>

          <ScrollReveal variant="fade-up" delay={200} duration={500}>
            <div className="mt-10 text-center">
              <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
                {t("public.services.viewAll")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ─── PRODUCTS ─────────────────────────────────────────────────── */}
      <section className="relative py-24 sm:py-32 overflow-hidden bg-muted/30">
        <div
          className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] translate-x-1/2 -translate-y-1/4 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 65%)", animation: "pulse-glow 6s ease-in-out infinite" }}
        />
        <Container className="relative z-10">
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <ScrollReveal variant="fade-right" duration={700}>
              <span className="text-[10px] uppercase tracking-[0.18em] text-accent font-bold">
                {t("public.products.eyebrow")}
              </span>
              <h2 className="mt-3 font-display text-4xl font-bold text-foreground sm:text-5xl leading-tight">
                {t("public.products.title")}
              </h2>
              <p className="mt-5 max-w-lg text-base text-muted-foreground leading-relaxed">
                {t("public.products.subtitle")}
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade-left" delay={100} duration={500}>
              <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                {t("public.products.viewAll")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </ScrollReveal>
          </div>

          <StaggerReveal stagger={80} variant="blur-up" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.slug} {...p} explore={t("public.products.explore")} />
            ))}
          </StaggerReveal>
        </Container>
      </section>

      {/* ─── WHY US ───────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="mb-16">
            <ScrollReveal variant="blur-up" duration={700}>
              <span className="text-[10px] uppercase tracking-[0.18em] text-primary font-bold">
                {t("public.whyUs.eyebrow")}
              </span>
              <h2 className="mt-3 font-display text-4xl font-bold text-foreground sm:text-5xl leading-tight max-w-2xl">
                {t("public.whyUs.title")}
              </h2>
            </ScrollReveal>
          </div>

          <StaggerReveal stagger={80} variant="fade-up" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p, i) => (
              <Pillar
                key={p.titleKey}
                icon={p.icon}
                title={t(`public.whyUs.pillars.${p.titleKey}.title`)}
                body={t(`public.whyUs.pillars.${p.bodyKey}.body`)}
                index={i}
              />
            ))}
          </StaggerReveal>
        </Container>
      </section>

      {/* ─── TECH STACK ───────────────────────────────────────────────── */}
      <section className="relative py-24 sm:py-32 overflow-hidden bg-muted/30">
        <Container>
          <div className="text-center mb-14">
            <ScrollReveal variant="blur-up" duration={700}>
              <span className="text-[10px] uppercase tracking-[0.18em] text-primary font-bold">
                {t("public.techStack.eyebrow")}
              </span>
              <h2 className="mt-3 font-display text-4xl font-bold text-foreground sm:text-5xl">
                {t("public.techStack.title")}
              </h2>
              <p className="mt-4 text-muted-foreground text-base max-w-lg mx-auto leading-relaxed">
                {t("public.techStack.subtitle")}
              </p>
            </ScrollReveal>
          </div>

          <StaggerReveal stagger={40} variant="scale" className="flex flex-wrap justify-center gap-3">
            {[
              "React", "TypeScript", "Vue", "Next.js",
              "Laravel", "Node.js", "Python", "Go", "Django",
              "Flutter", "React Native",
              "PostgreSQL", "Redis", "MongoDB",
              "AWS", "Google Cloud", "Azure", "Cloudflare",
              "Docker", "Kubernetes", "Terraform",
              "OpenAI", "PyTorch",
            ].map((tech, i) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:text-foreground hover:bg-primary/5"
                style={{ animation: `float${(i % 3) + 1} ${7 + (i % 4)}s ease-in-out infinite`, animationDelay: `${i * 0.15}s` }}
              >
                {tech}
              </span>
            ))}
          </StaggerReveal>
        </Container>
      </section>

      {/* ─── FINAL CTA ───────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <Container>
          <ScrollReveal variant="blur-up" duration={800}>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-card to-accent/5 p-12 sm:p-16 text-center shadow-xl">
              {/* Glow orbs */}
              <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
              <div className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

              <div className="relative z-10">
                <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl leading-tight">
                  {t("public.cta.title").split(t("public.cta.titleAccent") || "next great thing?")[0]}
                  <span
                    className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                    style={{ backgroundSize: "200% 200%", animation: "gradient-shift 3s ease infinite" }}
                  >
                    {t("public.cta.title").includes("?")
                      ? t("public.cta.title").split("?")[0].split(" ").slice(-3).join(" ") + "?"
                      : t("public.cta.title")}
                  </span>
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground leading-relaxed">
                  {t("public.cta.subtitle")}
                </p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  <MagneticButton to="/contact" variant="primary">
                    {t("public.cta.startProject")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </MagneticButton>
                  <MagneticButton to="/portfolio" variant="outline">
                    {t("public.cta.seeWork")}
                  </MagneticButton>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </div>
  );
}
