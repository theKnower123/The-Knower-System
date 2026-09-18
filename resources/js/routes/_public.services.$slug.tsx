import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section, CTABand, Card, Badge } from "@/components/public/blocks";
import { services as staticServices } from "@/mocks/marketing";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Zap, Shield, Clock, Award, CheckCircle2, Cpu, HelpCircle, Layers, ArrowUpRight } from "lucide-react";
import * as Icons from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Route = createFileRoute("/_public/services/$slug")({
  loader: ({ params }) => {
    return { slug: params.slug };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.slug ? loaderData.slug.replace(/-/g, ' ').toUpperCase() : "Service"} — The Knower` },
      { name: "description", content: "Professional engineering and technology services by The Knower." },
    ],
  }),
  component: ServicePage,
});

// Fallback hardcoded defaults if DB doesn't have custom data
const MOCK_DEFAULTS: Record<string, any> = {
  "web-development": {
    badge_label: "High-Performance Web Solutions",
    cta_label: "Start Your Web Project",
    full_description: "We engineer bespoke, modern web applications built for speed, scalability, and exceptional user experiences. From enterprise web portals to responsive consumer applications, our engineering team utilizes cutting-edge stacks like Next.js, React, and Laravel to deliver seamless web products.",
    features: [
      { title: "Custom Architecture", description: "Tailored frontend and backend architectures designed to handle high traffic seamlessly." },
      { title: "SEO & Speed Optimized", description: "Sub-second page loading times with core web vitals optimization built in from day one." },
      { title: "Responsive Design", description: "Pixel-perfect mobile and desktop interfaces crafted with extreme attention to detail." },
      { title: "Enterprise Security", description: "Bank-grade security protocols, encryption, and vulnerability defense." }
    ],
    benefits: [
      { title: "3x Faster Time to Market", description: "Pre-built component libraries and automated CI/CD pipelines streamline launches." },
      { title: "99.99% Uptime Guarantee", description: "Resilient cloud infrastructure setup ensuring maximum service availability." },
      { title: "Bilingual & Localized", description: "Native English & Arabic RTL support for MENA and global expansion." }
    ],
    process_steps: [
      { step: 1, title: "Discovery & Blueprinting", description: "Requirements gathering, wireframing, technical scoping, and UX mapping." },
      { step: 2, title: "UI/UX & Prototyping", description: "Interactive high-fidelity design prototypes and component design systems." },
      { step: 3, title: "Agile Development", description: "Sprint-based development with bi-weekly client demos and continuous feedback." },
      { step: 4, title: "QA & Performance Audit", description: "Automated testing, security vulnerability scans, and speed optimization." },
      { step: 5, title: "Launch & Ongoing Support", description: "Zero-downtime deployment, analytics tracking, and continuous monitoring." }
    ],
    tech_stack: [
      { name: "React / Next.js", category: "Frontend" },
      { name: "TypeScript", category: "Language" },
      { name: "Laravel / Node.js", category: "Backend" },
      { name: "Tailwind CSS", category: "Styling" },
      { name: "PostgreSQL / MySQL", category: "Database" }
    ],
    faqs: [
      { question: "How long does a custom web project take?", answer: "Typical projects range from 4 to 12 weeks depending on complexity, features, and integrations." },
      { question: "Do you provide bilingual Arabic & English support?", answer: "Yes! All web applications are engineered with complete i18n internationalization and RTL layout support out of the box." },
      { question: "Will I own the source code?", answer: "Absolutely. You retain 100% intellectual property ownership of all custom source code, assets, and databases." }
    ]
  }
};

function ServicePage() {
  const { slug } = Route.useLoaderData();

  // Query Database API
  const { data: dbService, isLoading } = useQuery({
    queryKey: ['public', 'service', slug],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/v1/public/services/${slug}`);
        return res.data.service;
      } catch (e) {
        return null;
      }
    }
  });

  // Find static fallback if DB query fails or pending
  const staticFallback = staticServices.find((x) => x.slug === slug) || staticServices[0];
  const mockExtra = MOCK_DEFAULTS[slug] || {};

  // Merged service object
  const s = {
    id: dbService?.id,
    name: dbService?.name || dbService?.title || staticFallback.name,
    slug: slug,
    tagline: dbService?.tagline || staticFallback.tagline,
    badge_label: dbService?.badge_label || mockExtra.badge_label || "Premium Engineering Service",
    cta_label: dbService?.cta_label || mockExtra.cta_label || "Get Started",
    description: dbService?.description || staticFallback.description,
    full_description: dbService?.full_description || mockExtra.full_description || dbService?.description || staticFallback.description,
    hero_image: dbService?.hero_image || mockExtra.hero_image || "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=80",
    icon: dbService?.icon || staticFallback.icon || "Sparkles",
    deliverables: Array.isArray(dbService?.deliverables) ? dbService.deliverables : staticFallback.deliverables,
    features: Array.isArray(dbService?.features) && dbService.features.length > 0 ? dbService.features : (mockExtra.features || [
      { title: "Custom Architecture", description: "Bespoke engineering tailored to your requirements." },
      { title: "Scalable Infrastructure", description: "Built for growth and high user traffic." },
      { title: "24/7 Monitoring", description: "Proactive uptime and error prevention." }
    ]),
    benefits: Array.isArray(dbService?.benefits) && dbService.benefits.length > 0 ? dbService.benefits : (mockExtra.benefits || [
      { title: "Rapid Time-to-Market", description: "Streamlined deployment pipelines get your product live faster." },
      { title: "Dedicated Support", description: "Direct access to senior engineering leads." }
    ]),
    process_steps: Array.isArray(dbService?.process_steps) && dbService.process_steps.length > 0 ? dbService.process_steps : (mockExtra.process_steps || [
      { step: 1, title: "Discovery", description: "Defining goals, user flows, and technical scope." },
      { step: 2, title: "Architecture & Design", description: "Wireframing and component design system." },
      { step: 3, title: "Sprint Build", description: "Iterative development with continuous demos." },
      { step: 4, title: "QA & Deployment", description: "Automated testing and production launch." }
    ]),
    tech_stack: Array.isArray(dbService?.tech_stack) && dbService.tech_stack.length > 0 ? dbService.tech_stack : (mockExtra.tech_stack || [
      { name: "React", category: "Frontend" },
      { name: "Laravel", category: "Backend" },
      { name: "TypeScript", category: "Language" },
      { name: "AWS", category: "Cloud" }
    ]),
    faqs: Array.isArray(dbService?.faqs) && dbService.faqs.length > 0 ? dbService.faqs : (mockExtra.faqs || [])
  };

  const Icon = (Icons as any)[s.icon] ?? Icons.Sparkles;

  return (
    <div className="space-y-12 pb-16">

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-12 pb-8 border-b border-border bg-gradient-to-b from-muted/50 to-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
                <Icon className="h-4 w-4" />
                <span>{s.badge_label}</span>
              </div>

              <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {s.name}
              </h1>

              <p className="text-xl font-medium text-primary leading-relaxed">
                {s.tagline}
              </p>

              <p className="text-base text-muted-foreground leading-relaxed">
                {s.description}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Button asChild size="lg" className="rounded-xl gap-2 text-base font-semibold shadow-lg shadow-primary/25">
                  <Link to="/contact">
                    {s.cta_label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl border-border">
                  <Link to="/portfolio">View Case Studies</Link>
                </Button>
              </div>
            </div>

            {/* Hero Image / Card Preview */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary to-violet-500 opacity-20 blur-xl transition-all group-hover:opacity-30" />
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
                {s.hero_image ? (
                  <img 
                    src={s.hero_image} 
                    alt={s.name}
                    className="w-full h-80 lg:h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-80 items-center justify-center bg-primary/5 p-8 text-center">
                    <Icon className="h-20 w-20 text-primary opacity-40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
                  <Badge variant="outline" className="w-fit border-white/30 text-white bg-white/10 backdrop-blur-md mb-2">
                    {s.badge_label}
                  </Badge>
                  <p className="text-sm text-white/80 line-clamp-2 font-medium">{s.full_description}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Professional Overview / Detailed Intro */}
      <Section className="py-4">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary border-primary/30">
            Professional Overview
          </Badge>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Engineered for Scalability, Speed & Precision
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {s.full_description}
          </p>
        </div>
      </Section>

      {/* Key Features */}
      {s.features.length > 0 && (
        <Section className="bg-muted/30 py-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <Badge variant="outline" className="text-xs text-primary border-primary/30">Capabilities</Badge>
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Key Features</h2>
              <p className="text-sm text-muted-foreground">What makes our {s.name} service stand out.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {s.features.map((feat: any, idx: number) => (
                <Card key={idx} className="p-6 space-y-3 hover:border-primary/50 transition-all hover:-translate-y-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                    0{idx + 1}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Key Benefits & Outcomes */}
      {s.benefits.length > 0 && (
        <Section className="py-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-1">
                <Badge variant="outline" className="text-xs text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                  Value & ROI
                </Badge>
                <h2 className="font-display text-3xl font-bold text-foreground">Measurable Business Benefits</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We don't just deliver code — we focus on driving high ROI, reduced technical debt, and enterprise resilience.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
                {s.benefits.map((ben: any, idx: number) => (
                  <div key={idx} className="flex gap-4 p-5 rounded-2xl border border-border bg-card hover:border-emerald-500/30 transition-all">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-display text-base font-semibold text-foreground">{ben.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{ben.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* Workflow / Process Steps */}
      {s.process_steps.length > 0 && (
        <Section className="bg-muted/30 py-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <Badge variant="outline" className="text-xs text-primary border-primary/30">Methodology</Badge>
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Development Process</h2>
              <p className="text-sm text-muted-foreground">Our structured step-by-step workflow from discovery to launch.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {s.process_steps.map((proc: any, idx: number) => (
                <div key={idx} className="relative p-5 rounded-2xl border border-border bg-card space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xs">
                      {proc.step || idx + 1}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">Step {idx + 1}</span>
                  </div>
                  <h4 className="font-display text-base font-semibold text-foreground">{proc.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{proc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Technologies & Tech Stack */}
      {s.tech_stack.length > 0 && (
        <Section className="py-12">
          <div className="mx-auto max-w-4xl text-center space-y-6">
            <Badge variant="outline" className="text-xs text-primary border-primary/30">Modern Tech Stack</Badge>
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Built with Best-in-Class Tools</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {s.tech_stack.map((t: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-sm hover:border-primary/40 transition-colors">
                  <Cpu className="h-3.5 w-3.5 text-primary" />
                  <span>{typeof t === 'string' ? t : t.name}</span>
                  {t.category && (
                    <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                      {t.category}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* FAQs */}
      {s.faqs.length > 0 && (
        <Section className="bg-muted/30 py-12">
          <div className="mx-auto max-w-3xl px-6 space-y-6">
            <div className="text-center space-y-2">
              <Badge variant="outline" className="text-xs text-primary border-primary/30">FAQ</Badge>
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {s.faqs.map((faq: any, idx: number) => (
                <Card key={idx} className="p-5 space-y-2">
                  <h4 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                    {faq.question || faq.q}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-6">{faq.answer || faq.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Call to Action */}
      <CTABand
        title={`Ready to build your ${s.name}?`}
        subtitle="Schedule a consultation with our technical team today and get a comprehensive project scope."
        primary={{ label: `${s.cta_label} →`, to: "/contact" }}
        secondary={{ label: "Explore All Services", to: "/services" }}
      />

    </div>
  );
}
