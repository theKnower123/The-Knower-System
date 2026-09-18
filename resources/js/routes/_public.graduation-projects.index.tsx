import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowRight,
  CircuitBoard,
  Code2,
  Cpu,
  FileCheck2,
  GraduationCap,
  Layers3,
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Container, CTABand, Section, SectionHeading } from "@/components/public/blocks";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_public/graduation-projects/")({
  head: () => ({
    meta: [
      { title: "Graduation Projects — The Knower" },
      {
        name: "description",
        content:
          "Embedded/IoT and Software/Mobile graduation project support for university students — from consultation to full execution and defense prep.",
      },
    ],
  }),
  component: GraduationProjectsLanding,
});

type ShowcaseItem = {
  id: string;
  teamName: string;
  university: string;
  projectType: string;
  description?: string | null;
};

type TestimonialItem = {
  id: string;
  name: string;
  role?: string | null;
  quote: string;
};

const HARDWARE_TAGS = [
  "Arduino",
  "ESP32",
  "STM32",
  "Raspberry Pi",
  "Sensors/Actuators",
  "Custom PCB",
  "LoRa/BLE/MQTT",
  "Edge AI & Robotics",
];

const SOFTWARE_TAGS = [
  "Laravel",
  "React",
  "Next.js",
  "React Native",
  "Flutter",
  "AI / Computer Vision",
  "Cloud",
  "REST APIs",
];

function GraduationProjectsLanding() {
  const { t } = useTranslation();
  const [showcaseFilter, setShowcaseFilter] = useState<"all" | "hardware" | "software">("all");

  const { data: showcase = [] } = useQuery({
    queryKey: ["public", "gp-showcase", showcaseFilter],
    queryFn: async () => {
      const params = showcaseFilter === "all" ? {} : { project_type: showcaseFilter };
      const res = await axios.get("/api/v1/public/graduation-projects/showcase", { params });
      return (res.data.data || []) as ShowcaseItem[];
    },
  });

  const { data: testimonials = [] } = useQuery({
    queryKey: ["public", "gp-testimonials"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/public/graduation-projects/testimonials");
      return (res.data.data || []) as TestimonialItem[];
    },
  });

  const steps = useMemo(
    () => [
      { title: t("graduation.landing.step1Title"), desc: t("graduation.landing.step1Desc") },
      { title: t("graduation.landing.step2Title"), desc: t("graduation.landing.step2Desc") },
      { title: t("graduation.landing.step3Title"), desc: t("graduation.landing.step3Desc") },
      { title: t("graduation.landing.step4Title"), desc: t("graduation.landing.step4Desc") },
    ],
    [t],
  );

  const faqs = useMemo(
    () => [
      { q: t("graduation.landing.faq1Q"), a: t("graduation.landing.faq1A") },
      { q: t("graduation.landing.faq2Q"), a: t("graduation.landing.faq2A") },
      { q: t("graduation.landing.faq3Q"), a: t("graduation.landing.faq3A") },
      { q: t("graduation.landing.faq4Q"), a: t("graduation.landing.faq4A") },
      { q: t("graduation.landing.faq5Q"), a: t("graduation.landing.faq5A") },
    ],
    [t],
  );

  return (
    <div className="gp-landing">
      <style>{`
        .gp-landing {
          --gp-ink: #0c1f2e;
          --gp-copper: #c45c26;
          --gp-teal: #1a6b6b;
          --gp-sand: #e8dcc8;
        }
        .dark .gp-landing {
          --gp-ink: #e8dcc8;
          --gp-copper: #e07a45;
          --gp-teal: #4db6b0;
          --gp-sand: #1a2834;
        }
        .gp-hero-grid {
          background-image:
            linear-gradient(color-mix(in oklab, var(--gp-teal) 12%, transparent) 1px, transparent 1px),
            linear-gradient(90deg, color-mix(in oklab, var(--gp-teal) 12%, transparent) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
        }
      `}</style>

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-[color-mix(in_oklab,var(--gp-teal)_14%,transparent)] via-background to-[color-mix(in_oklab,var(--gp-copper)_10%,transparent)]" />
        <div className="gp-hero-grid pointer-events-none absolute inset-0 opacity-60" />
        <Container className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--gp-copper)_40%,transparent)] bg-[color-mix(in_oklab,var(--gp-copper)_12%,transparent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--gp-copper)]">
                <Cpu className="h-3 w-3" />
                {t("graduation.landing.badgeHardware")}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--gp-teal)_40%,transparent)] bg-[color-mix(in_oklab,var(--gp-teal)_12%,transparent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--gp-teal)]">
                <Code2 className="h-3 w-3" />
                {t("graduation.landing.badgeSoftware")}
              </span>
            </div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {t("graduation.landing.eyebrow")}
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {t("graduation.landing.heroTitle")}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {t("graduation.landing.heroSubtitle")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-[var(--gp-copper)] text-white hover:bg-[var(--gp-copper)]/90">
                <Link to="/graduation-projects/register">
                  {t("graduation.landing.ctaRegister")}
                  <ArrowRight className="ms-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#tracks">{t("graduation.landing.ctaExplore")}</a>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[var(--gp-teal)]" />
                {t("graduation.landing.trustEngineers")}
              </span>
              <span className="inline-flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-[var(--gp-copper)]" />
                {t("graduation.landing.trustDefense")}
              </span>
              <span className="inline-flex items-center gap-2">
                <Layers3 className="h-4 w-4 text-[var(--gp-teal)]" />
                {t("graduation.landing.trustMilestones")}
              </span>
            </div>
          </div>
        </Container>
      </section>

      <Section id="tracks">
        <SectionHeading
          align="center"
          title={t("graduation.landing.tracksTitle")}
          subtitle={t("graduation.landing.tracksSubtitle")}
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <TrackPanel
            icon={<CircuitBoard className="h-6 w-6" />}
            accent="copper"
            title={t("graduation.landing.hardwareTitle")}
            description={t("graduation.landing.hardwareDesc")}
            tags={HARDWARE_TAGS}
            deliverables={t("graduation.landing.hardwareDeliverables")}
          />
          <TrackPanel
            icon={<Code2 className="h-6 w-6" />}
            accent="teal"
            title={t("graduation.landing.softwareTitle")}
            description={t("graduation.landing.softwareDesc")}
            tags={SOFTWARE_TAGS}
            deliverables={t("graduation.landing.softwareDeliverables")}
          />
        </div>
      </Section>

      <Section className="bg-muted/30">
        <SectionHeading
          align="center"
          title={t("graduation.landing.servicesTitle")}
          subtitle={t("graduation.landing.servicesSubtitle")}
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { title: t("graduation.landing.svcConsultTitle"), desc: t("graduation.landing.svcConsultDesc"), icon: MessageSquareQuote },
            { title: t("graduation.landing.svcPartialTitle"), desc: t("graduation.landing.svcPartialDesc"), icon: Layers3 },
            { title: t("graduation.landing.svcFullTitle"), desc: t("graduation.landing.svcFullDesc"), icon: FileCheck2 },
          ].map((s) => (
            <div key={s.title} className="rounded-2xl border border-border bg-card p-6">
              <s.icon className="mb-4 h-6 w-6 text-[var(--gp-teal)]" />
              <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          align="center"
          title={t("graduation.landing.howTitle")}
          subtitle={t("graduation.landing.howSubtitle")}
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="relative rounded-2xl border border-border bg-card p-5">
              <div className="mb-3 font-mono text-xs font-bold tracking-widest text-[var(--gp-copper)]">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="font-display text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="bg-muted/30" id="showcase">
        <SectionHeading
          align="center"
          title={t("graduation.landing.showcaseTitle")}
          subtitle={t("graduation.landing.showcaseSubtitle")}
        />
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {(
            [
              ["all", t("graduation.landing.showcaseAll")],
              ["hardware", t("graduation.landing.showcaseHardware")],
              ["software", t("graduation.landing.showcaseSoftware")],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setShowcaseFilter(key)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                showcaseFilter === key
                  ? "border-[var(--gp-teal)] bg-[var(--gp-teal)] text-white"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {showcase.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-[var(--gp-copper)]" />
            <p className="text-muted-foreground">{t("graduation.landing.showcaseEmpty")}</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {showcase.map((item) => (
              <article key={item.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--gp-teal)]">
                  {item.projectType === "hardware"
                    ? t("graduation.landing.showcaseHardware")
                    : t("graduation.landing.showcaseSoftware")}
                </div>
                <h3 className="font-display text-lg font-semibold">{item.teamName}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.university}</p>
                {item.description && (
                  <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{item.description}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </Section>

      {testimonials.length > 0 && (
        <Section>
          <SectionHeading align="center" title={t("graduation.landing.testimonialsTitle")} />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote key={item.id} className="rounded-2xl border border-border bg-card p-6">
                <p className="text-sm leading-relaxed text-foreground">“{item.quote}”</p>
                <footer className="mt-4 text-sm font-medium">
                  {item.name}
                  {item.role ? <span className="text-muted-foreground"> · {item.role}</span> : null}
                </footer>
              </blockquote>
            ))}
          </div>
        </Section>
      )}

      <Section>
        <SectionHeading align="center" title={t("graduation.landing.faqTitle")} />
        <div className="mx-auto mt-10 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.q} value={`faq-${i}`}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      <CTABand
        title={t("graduation.landing.ctaBandTitle")}
        primary={{ label: t("graduation.landing.ctaBandPrimary"), to: "/graduation-projects/register" }}
      />
    </div>
  );
}

function TrackPanel({
  icon,
  accent,
  title,
  description,
  tags,
  deliverables,
}: {
  icon: React.ReactNode;
  accent: "copper" | "teal";
  title: string;
  description: string;
  tags: string[];
  deliverables: string;
}) {
  const color = accent === "copper" ? "var(--gp-copper)" : "var(--gp-teal)";
  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div
        className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ background: `color-mix(in oklab, ${color} 15%, transparent)`, color }}
      >
        {icon}
      </div>
      <h3 className="font-display text-2xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-border bg-muted/40 px-2.5 py-1 font-mono text-[11px] font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-5 border-t border-border pt-4 text-sm text-muted-foreground">{deliverables}</p>
    </div>
  );
}
