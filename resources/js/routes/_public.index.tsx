import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Globe, Smartphone, Server, Cloud, Brain, Palette, ShieldCheck, LineChart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Eyebrow, SectionHeading, StatCounter, FeatureCard, PricingCard, LogoCloud, CTABand, Section, Badge } from "@/components/public/blocks";
import { ProjectCardBanner } from "@/components/public/ProjectCardBanner";
import { stats, services, products, plans, portfolio, testimonials, trustedBy, blog } from "@/mocks/marketing";

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "The Knower — The operating system for software houses" },
      { name: "description", content: "CRM, ERP, hosting, AI and services under one roof. Ship products, run operations and delight clients — bilingual EN/AR, enterprise ready." },
      { property: "og:title", content: "The Knower — The operating system for software houses" },
      { property: "og:description", content: "CRM, ERP, hosting, AI and services under one roof for modern software teams." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://knower-all-in-one.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://knower-all-in-one.lovable.app/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "The Knower",
        url: "https://knower-all-in-one.lovable.app/",
        description: "The operating system for software houses.",
        sameAs: ["https://twitter.com/theknower", "https://linkedin.com/company/theknower"],
      }),
    }],
  }),
  component: HomePage,
});

const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "web-development": Globe, "mobile-apps": Smartphone, "cloud": Cloud, "hosting": Server,
  "consulting": Brain, "branding": Palette, "maintenance": ShieldCheck, "seo": LineChart,
};

import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function HomePage() {
  const { t } = useTranslation();
  const { data: dynamicData } = useQuery({
    queryKey: ['public', 'home'],
    queryFn: async () => {
      const [pRes, tRes, bRes, prRes] = await Promise.all([
        axios.get('/api/v1/public/pricing'),
        axios.get('/api/v1/public/testimonials'),
        axios.get('/api/v1/public/blog'),
        axios.get('/api/v1/public/portfolio'),
      ]);
      return {
        plans: pRes.data.plans.map((p: any) => ({
          name: p.name, price: { monthly: p.price_monthly, yearly: p.price_yearly }, blurb: p.description, features: p.features || [], highlight: p.is_popular, cta: p.price_monthly == 0 ? "Contact sales" : undefined
        })),
        testimonials: tRes.data.testimonials.map((t: any) => ({
          name: t.name, role: t.position, company: t.company, quote: t.content, avatar: t.avatar || "JD"
        })),
        posts: bRes.data.posts.map((p: any) => ({
          slug: p.slug, title: p.title, excerpt: p.excerpt, category: "Blog", author: p.author_name, readTime: "5 min", date: p.published_at
        })),
        projects: prRes.data.projects.map((p: any) => ({
          slug: String(p.id),
          title: p.name || "Untitled Project",
          summary: p.description || p.details || "",
          category: p.type || "Project",
          images: p.images || [],
          year: p.start_date ? new Date(p.start_date).getFullYear() : (p.created_at ? new Date(p.created_at).getFullYear() : new Date().getFullYear()),
        }))
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  const previewServices = services.slice(0, 8);
  const previewProducts = products;
  
  const activePlans = dynamicData?.plans || [];
  const previewProjects = dynamicData?.projects || [];
  const previewPosts = dynamicData?.posts || [];
  const activeTestimonials = dynamicData?.testimonials || [];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_55%)]" />
        <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <Container className="relative py-20 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow>{t('public.hero.tagline')}</Eyebrow>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-6xl md:text-7xl">
              {t('public.hero.title1')} <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">{t('public.hero.title2')}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              {t('public.hero.subtitle')}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="gap-1.5"><Link to="/contact">{t('public.hero.startProject')} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/pricing">{t('public.hero.bookDemo')}</Link></Button>
              <Button asChild size="lg" variant="ghost"><Link to="/portfolio">{t('public.hero.seeWork')}</Link></Button>
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-2 md:grid-cols-4">
            {stats.map((s) => <StatCounter key={s.label} value={s.value} label={s.label} />)}
          </div>
        </Container>
      </section>

      {/* Trusted by */}
      <Section className="!py-14">
        <p className="mb-8 text-center text-xs uppercase tracking-widest text-muted-foreground">Trusted by teams at</p>
        <LogoCloud names={trustedBy} />
      </Section>

      {/* Services */}
      <Section>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Services" title="Everything you need, end-to-end" subtitle="From discovery to launch to 24/7 support — one accountable team." />
          <Button asChild variant="outline"><Link to="/services">All services <ArrowRight className="ms-1 h-4 w-4" /></Link></Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {previewServices.map((s) => {
            const Icon = SERVICE_ICONS[s.slug] ?? Sparkles;
            return <FeatureCard key={s.slug} icon={<Icon className="h-5 w-5" />} title={s.name} description={s.tagline} href={`/services/${s.slug}`} />;
          })}
        </div>
      </Section>

      {/* Products */}
      <Section className="bg-muted/30">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Products" title="Our software suite" subtitle="Six flagship products built on The Knower OS platform." />
          <Button asChild variant="outline"><Link to="/products">All products <ArrowRight className="ms-1 h-4 w-4" /></Link></Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {previewProducts.map((p) => (
            <Link key={p.slug} to="/products/$slug" params={{ slug: p.slug }}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg">
              <Badge>{p.category}</Badge>
              <div className="mt-3 font-display text-xl font-semibold">{p.name}</div>
              <div className="mt-1 text-sm text-primary">{p.tagline}</div>
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Explore <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Pricing */}
      <Section>
        <SectionHeading eyebrow="Pricing" align="center" title="Simple, transparent pricing" subtitle="Start free. Scale when you're ready. Enterprise SLAs available." />
        {activePlans.length > 0 ? (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {activePlans.map((p: any) => <PricingCard key={p.name} plan={p} cycle="monthly" />)}
          </div>
        ) : (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            No pricing plans uploaded yet. Manage your pricing plans from the CMS dashboard.
          </div>
        )}
        <div className="mt-8 text-center">
          <Button asChild variant="outline"><Link to="/pricing">Full pricing details <ArrowRight className="ms-1 h-4 w-4" /></Link></Button>
        </div>
      </Section>

      {/* Why choose us */}
      <Section className="bg-muted/30">
        <SectionHeading eyebrow="Why us" align="center" title="Senior teams, obsessive craft, measurable outcomes" />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { icon: <ShieldCheck className="h-5 w-5" />, title: "Senior by default", desc: "Every team you meet is who you'll work with. No juniors, no bait-and-switch." },
            { icon: <LineChart className="h-5 w-5" />, title: "Outcomes, not hours", desc: "We're measured on the metrics that move your business." },
            { icon: <Sparkles className="h-5 w-5" />, title: "AI-native delivery", desc: "Our own AI copilot ships work faster with fewer defects." },
            { icon: <Globe className="h-5 w-5" />, title: "Bilingual, global", desc: "Native EN/AR delivery across 20+ countries." },
            { icon: <Cloud className="h-5 w-5" />, title: "Cloud-native", desc: "Every solution ships cloud-ready, resilient, observable." },
            { icon: <Brain className="h-5 w-5" />, title: "Product mindset", desc: "We think in outcomes, roadmaps and iterations." },
          ].map((f) => <FeatureCard key={f.title} {...f} description={f.desc} />)}
        </div>
      </Section>

      {/* Portfolio preview */}
      <Section>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Portfolio" title="Recent work" subtitle="A snapshot of the products we've shipped for clients around the world." />
          <Button asChild variant="outline"><Link to="/portfolio">See portfolio <ArrowRight className="ms-1 h-4 w-4" /></Link></Button>
        </div>
        {previewProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {previewProjects.map((p: any) => (
              <div key={p.slug}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:border-primary/50 hover:shadow-md flex flex-col justify-between">
                <ProjectCardBanner title={p.title} images={p.images} />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
                    <Badge variant="outline">{p.category}</Badge>
                    <span className="font-semibold">{p.year}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-4 leading-relaxed">{p.summary}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No portfolio projects published yet. Enable project visibility from the admin dashboard to display them here!
          </div>
        )}
      </Section>

      {/* Testimonials */}
      <Section className="bg-muted/30">
        <SectionHeading eyebrow="Testimonials" align="center" title="Loved by teams that ship" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeTestimonials.slice(0, 6).map((t: any) => (
            <div key={t.name} className="flex flex-col rounded-2xl border border-border bg-card p-6">
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">{t.avatar}</div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role} · {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Blog */}
      <Section>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Journal" title="From our blog" />
          <Button asChild variant="outline"><Link to="/blog">All articles <ArrowRight className="ms-1 h-4 w-4" /></Link></Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {previewPosts.map((p: any) => (
            <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/50">
              <Badge>{p.category}</Badge>
              <h3 className="mt-3 font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{p.author}</span><span>{p.readTime}</span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <CTABand title="Ready to build the next great thing?"
        subtitle="Book a 30-minute call. We'll listen, then propose the shortest path from idea to launch."
        primary={{ label: "Start your project", to: "/contact" }}
        secondary={{ label: "See pricing", to: "/pricing" }} />
    </div>
  );
}
