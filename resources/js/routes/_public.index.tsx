import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import {
  ArrowRight, Globe, Smartphone, Server, Cloud, Brain, Palette,
  ShieldCheck, LineChart, Sparkles, Code, Search, Megaphone,
  Wrench, Monitor, Zap, Award, CheckCircle2, Cpu, Users,
  FolderGit2, CreditCard, ChevronRight, Layers, Play, Eye, Rocket,
  Sliders, Star, Terminal, Lock, LayoutDashboard, FolderKanban, Receipt, LifeBuoy, FileText, Clock, AlertTriangle
} from "lucide-react";
import { Container } from "@/components/public/blocks";
import { ScrollReveal, StaggerReveal } from "@/components/public/ScrollReveal";
import { ParticleCanvas } from "@/components/public/ParticleCanvas";
import { useCountUp, useParallax, useTextScramble } from "@/hooks/useAnimations";
import { stats, services, products, trustedBy, portfolio } from "@/mocks/marketing";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { TransitionLink, usePageTransition } from "@/components/public/PageTransitionManager";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "The Knower — Next-Gen Operating System for Agencies & Software Houses" },
      { name: "description", content: "CRM, projects, hosting, HR, invoicing and an AI copilot — one unified high-performance platform." },
    ],
  }),
  component: HomePage,
});

const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "web-development": Globe, "mobile-apps": Smartphone, "cloud": Cloud, "hosting": Server,
  "consulting": Brain, "branding": Palette, "maintenance": Wrench, "seo": Search,
  "api": Code, "desktop": Monitor, "marketing": Megaphone,
};

// ─── Stat Card with Glow Counter ──────────────────────────────────────────────
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const isNumber = /[\d.]+/.test(value);
  const numericPart = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
  const prefix = value.match(/^[^0-9]*/)?.[0] ?? "";
  const suffix = value.match(/[^0-9.]+$/)?.[0] ?? "";
  const { ref, text } = useCountUp(numericPart, 2000, prefix, suffix);

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/60 p-6 backdrop-blur-xl shadow-lg hover:border-primary/50 hover:shadow-primary/20"
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
      <span ref={ref} className="font-display text-4xl font-extrabold sm:text-5xl bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
        {isNumber ? text : value}
      </span>
      <span className="mt-2 block text-xs font-mono uppercase tracking-widest text-muted-foreground">{label}</span>
    </motion.div>
  );
}

// ─── Interactive 3D Service Card ─────────────────────────────────────────────
function InteractiveServiceCard({
  slug,
  icon: Icon,
  title,
  tagline,
  description,
  deliverables,
  onSelect,
}: {
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  onSelect: () => void;
}) {
  const { transitionTo } = usePageTransition();

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card/80 p-7 shadow-xl backdrop-blur-xl hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
      <div>
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary/20 via-primary/10 to-accent/20 text-primary shadow-inner">
            <Icon className="h-6 w-6" />
          </div>
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">MODULE</span>
        </div>
        <h3 className="mt-5 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="mt-1 text-xs font-medium text-primary/80">{tagline}</p>
        <p className="mt-3 line-clamp-3 text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>

      <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
        <button
          onClick={onSelect}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          <Eye className="h-3.5 w-3.5" /> Quick Preview
        </button>
        <button
          onClick={() => transitionTo(`/services/${slug}`, title.toUpperCase())}
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors"
        >
          Explore <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Client Portal Showcase ──────────────────────────────────────────────────
const CLIENT_PORTAL_VIEWS = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "projects", name: "Projects", icon: FolderKanban },
  { id: "invoices", name: "Billing & Invoices", icon: Receipt },
  { id: "support", name: "Support Tickets", icon: LifeBuoy },
];

function ClientPortalMockup({ activeView }: { activeView: string }) {
  return (
    <div className="flex h-[500px] w-full flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl relative z-10">
      {/* Fake Browser Header */}
      <div className="flex h-12 flex-shrink-0 items-center justify-between border-b border-border/60 bg-muted/30 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/20 text-primary">
            <Layers className="h-4 w-4" />
          </div>
          <span className="font-display text-sm font-bold text-foreground">The Knower OS</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary">OM</div>
            <div className="hidden flex-col sm:flex">
              <span className="text-[10px] font-bold leading-none text-foreground">Omar Mehawed</span>
              <span className="text-[9px] text-muted-foreground">Client</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden w-48 flex-col border-r border-border/60 bg-muted/10 p-3 sm:flex">
          <div className="mb-4 px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-2">
            Client Portal
          </div>
          <div className="space-y-1">
            {CLIENT_PORTAL_VIEWS.map((view) => {
              const Icon = view.icon;
              const isActive = activeView === view.id;
              return (
                <div
                  key={view.id}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    isActive ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {view.name}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-card p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {activeView === "dashboard" && (
                <>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome back, Omar 👋</h2>
                    <p className="text-sm text-muted-foreground mt-1">Your client portal — view projects, invoices, and support tickets.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <div className="rounded-xl border border-border/60 bg-background p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <FolderKanban className="h-3.5 w-3.5 text-blue-500" /> Active Projects
                      </div>
                      <div className="mt-2 text-2xl font-bold text-foreground">1</div>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <LifeBuoy className="h-3.5 w-3.5 text-amber-500" /> Open Tickets
                      </div>
                      <div className="mt-2 text-2xl font-bold text-foreground">0</div>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <Receipt className="h-3.5 w-3.5 text-red-500" /> Unpaid Invoices
                      </div>
                      <div className="mt-2 text-2xl font-bold text-foreground">1</div>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <FileText className="h-3.5 w-3.5 text-emerald-500" /> Contracts
                      </div>
                      <div className="mt-2 text-2xl font-bold text-foreground">0</div>
                    </div>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl border border-border/60 bg-background p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-foreground">My Projects</h3>
                        <span className="text-[10px] font-bold text-primary cursor-pointer hover:underline">View all &rarr;</span>
                      </div>
                      <div className="flex flex-col gap-3 rounded-lg border border-border/40 p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold">medical</span>
                          <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-500">In Progress</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <div className="h-full w-[25%] bg-blue-500 rounded-full" />
                          </div>
                          <span className="text-[10px] font-medium text-muted-foreground">25%</span>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-foreground">Recent Invoices</h3>
                        <span className="text-[10px] font-bold text-primary cursor-pointer hover:underline">View all &rarr;</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                        <div>
                          <div className="text-sm font-bold">INV-5</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">Jul 30, 2026</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-bold text-foreground">$50,000</span>
                          <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-500">Overdue</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {activeView === "projects" && (
                <>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Projects</h2>
                    <p className="text-sm text-muted-foreground mt-1">Your active projects and engagements.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <div className="rounded-xl border border-border/60 bg-background p-4 shadow-sm">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Projects</div>
                      <div className="mt-2 text-2xl font-bold text-foreground">1</div>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background p-4 shadow-sm">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Active</div>
                      <div className="mt-2 text-2xl font-bold text-blue-500">1</div>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background p-4 shadow-sm">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Completed</div>
                      <div className="mt-2 text-2xl font-bold text-emerald-500">0</div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted/30 text-[10px] uppercase text-muted-foreground border-b border-border/60">
                        <tr>
                          <th className="p-4 font-medium">Name</th>
                          <th className="p-4 font-medium">Type</th>
                          <th className="p-4 font-medium">Status</th>
                          <th className="p-4 font-medium">Progress</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        <tr className="hover:bg-muted/20">
                          <td className="p-4 font-bold text-foreground">medical</td>
                          <td className="p-4 text-xs text-muted-foreground">Web & Mobile</td>
                          <td className="p-4"><span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-medium text-blue-500">In Progress</span></td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                                <div className="h-full w-[25%] bg-blue-500 rounded-full" />
                              </div>
                              <span className="text-[10px] font-medium text-muted-foreground">25%</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              {activeView === "invoices" && (
                <>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Invoices</h2>
                    <p className="text-sm text-muted-foreground mt-1">Bills and payments history.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <div className="rounded-xl border border-border/60 bg-background p-4 shadow-sm">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Billed</div>
                      <div className="mt-2 text-2xl font-bold text-foreground">$50,000</div>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background p-4 shadow-sm">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Overdue</div>
                      <div className="mt-2 text-2xl font-bold text-red-500">1</div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted/30 text-[10px] uppercase text-muted-foreground border-b border-border/60">
                        <tr>
                          <th className="p-4 font-medium">Number</th>
                          <th className="p-4 font-medium">Project</th>
                          <th className="p-4 font-medium">Amount</th>
                          <th className="p-4 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        <tr className="hover:bg-muted/20">
                          <td className="p-4 font-bold text-foreground">INV-1</td>
                          <td className="p-4 text-xs text-muted-foreground">medical</td>
                          <td className="p-4 font-bold text-foreground">$50,000</td>
                          <td className="p-4"><span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-medium text-red-500">Overdue</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              {activeView === "support" && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-foreground">Support Tickets</h2>
                      <p className="text-sm text-muted-foreground mt-1">Open and track issues.</p>
                    </div>
                    <div className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground cursor-pointer shadow-md">
                      New Ticket
                    </div>
                  </div>
                  <div className="mt-12 flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-border/80 bg-background">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 mb-3">
                      <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-bold text-foreground">No open tickets</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">Everything is running smoothly. Need help? Open a new ticket.</p>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ClientPortalShowcase() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="relative mx-auto mt-12 max-w-6xl">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
              DEDICATED CLIENT OS
            </span>
            <h3 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl leading-tight">
              Your Complete Project Command Center
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              When you subscribe to The Knower, you don't just get a service. You get a dedicated operating system to manage, track, and collaborate on your entire project lifecycle.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {CLIENT_PORTAL_VIEWS.map((view) => {
              const isActive = activeTab === view.id;
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  onClick={() => setActiveTab(view.id)}
                  className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ${
                    isActive
                      ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                      : "border-border/40 bg-card hover:border-border hover:bg-muted/50"
                  }`}
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors ${
                    isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/20 group-hover:text-foreground"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className={`font-bold transition-colors ${isActive ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
                      {view.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Explore live client interaction details
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="relative rounded-3xl bg-gradient-to-b from-primary/10 via-accent/5 to-transparent p-2 sm:p-4 shadow-2xl">
            <ClientPortalMockup activeView={activeTab} />
          </div>
        </div>
      </div>
    </div>
  );
}

function mapDbPlan(p: any) {
  let parsedFeatures: string[] = [];
  try {
    parsedFeatures = Array.isArray(p.features)
      ? p.features
      : typeof p.features === 'string'
      ? JSON.parse(p.features)
      : [];
  } catch (e) {
    parsedFeatures = [];
  }

  return {
    id: p.id,
    name: p.name,
    price: { monthly: Number(p.price_monthly) || 0, yearly: Number(p.price_yearly) || 0 },
    blurb: p.blurb,
    features: parsedFeatures,
    highlight: !!p.highlight,
    cta: p.cta_text || undefined,
  };
}

function InteractivePricingShowcase() {
  const [activeCatIndex, setActiveCatIndex] = useState(0);
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const { transitionTo } = usePageTransition();

  // Dynamically pull pricing data directly from /api/v1/public/pricing (Source of Truth!)
  const { data: rawPlans, isLoading } = useQuery({
    queryKey: ["public", "pricing"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/public/pricing");
      return (res.data.plans || []) as any[];
    },
  });

  const categories = [
    {
      id: "software",
      title: "Software Development",
      subtitle: "Custom SaaS, enterprise web apps, & mobile platforms",
      badge: "Most Popular",
      plans: rawPlans?.filter((p) => (p.plan_type ?? "software") === "software").map(mapDbPlan) || [],
    },
    {
      id: "hosting",
      title: "Managed Cloud & Hosting",
      subtitle: "Blazing fast cloud infrastructure, high availability & auto-scaling",
      badge: "Cloud Infra",
      plans: rawPlans?.filter((p) => p.plan_type === "hosting").map(mapDbPlan) || [],
    },
    {
      id: "maintenance",
      title: "System Maintenance & Care",
      subtitle: "Continuous updates, security hardening & 24/7 system health",
      badge: "Peace of Mind",
      plans: rawPlans?.filter((p) => p.plan_type === "maintenance").map(mapDbPlan) || [],
    },
  ];

  const currentCategory = categories[activeCatIndex] || categories[0];

  return (
    <div className="relative mx-auto max-w-6xl">
      {/* Category selector pills & Billing Toggle */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex flex-wrap gap-2 rounded-full border border-border/80 bg-card/80 p-1.5 shadow-inner backdrop-blur-xl">
          {categories.map((cat, idx) => {
            const isActive = activeCatIndex === idx;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCatIndex(idx)}
                className={`relative rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-[1.03]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {cat.title}
              </button>
            );
          })}
        </div>

        {/* Billing cycle toggle */}
        <div className="flex items-center gap-3 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-xs font-semibold">
          <span className={cycle === "monthly" ? "text-foreground font-bold" : "text-muted-foreground"}>Monthly</span>
          <button
            onClick={() => setCycle(cycle === "monthly" ? "yearly" : "monthly")}
            className="relative h-6 w-11 rounded-full bg-muted p-0.5 transition-colors duration-200"
          >
            <div
              className={`h-5 w-5 rounded-full bg-primary transition-transform duration-200 ${
                cycle === "yearly" ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className={cycle === "yearly" ? "text-foreground font-bold" : "text-muted-foreground"}>
            Yearly <span className="text-[10px] font-mono text-emerald-500 font-bold">(Save 15%)</span>
          </span>
        </div>
      </div>

      {/* Category Subtitle */}
      <div className="mt-8 text-center">
        <h3 className="font-display text-2xl font-bold text-foreground sm:text-3xl">{currentCategory.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">{currentCategory.subtitle}</p>
      </div>

      {/* Animated Plans Container */}
      <div className="mt-12 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCategory.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid gap-8 md:grid-cols-3"
          >
            {currentCategory.plans.map((plan) => {
              const price = plan.price[cycle];
              return (
                <div
                  key={plan.name}
                  className={`relative flex flex-col justify-between rounded-3xl border p-8 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${
                    plan.highlight
                      ? "border-primary bg-gradient-to-b from-primary/10 via-card to-card shadow-2xl shadow-primary/15 ring-1 ring-primary/30"
                      : "border-border/80 bg-card/80 shadow-lg"
                  }`}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3.5 start-6 z-10 rounded-full bg-primary px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-md ring-2 ring-background">
                      {currentCategory.badge}
                    </span>
                  )}
                  <div>
                    <h4 className="font-display text-xl font-bold text-foreground">{plan.name}</h4>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed min-h-[2.5rem]">
                      {plan.blurb}
                    </p>
                    <div className="mt-6 border-t border-border/50 pt-5">
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-4xl font-extrabold text-foreground">
                          ${price.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground font-semibold">
                          /{cycle === "monthly" ? "mo" : "yr"}
                        </span>
                      </div>
                    </div>

                    <ul className="mt-6 space-y-3 text-xs">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-2.5 text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => transitionTo("/pricing", plan.name.toUpperCase())}
                    className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full py-3.5 px-6 text-xs font-bold transition-all duration-300 ${
                      plan.highlight
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-[1.02]"
                        : "border border-border/80 bg-background/80 text-foreground hover:border-primary/50 hover:bg-muted hover:scale-[1.02]"
                    }`}
                  >
                    <span>View Plan</span>
                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                  </button>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Our Work Interactive Showcase Component ──────────────────────────────
function OurWorkShowcase({ transitionTo }: { transitionTo: (to: string, label: string) => void }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Healthcare", "Retail", "Government", "Fintech", "Consumer", "Education"];

  const filteredItems = selectedCategory === "All"
    ? portfolio.slice(0, 6)
    : portfolio.filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-8">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-5 py-2 text-xs font-bold transition-all duration-300 ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                : "bg-card/80 text-muted-foreground border border-border/60 hover:text-foreground hover:bg-muted"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              key={item.slug}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={() => transitionTo(`/portfolio/${item.slug}`, item.title.toUpperCase())}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border/80 bg-card/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 flex flex-col justify-between"
            >
              {/* Glowing Background Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

              <div>
                {/* Header info */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary border border-primary/20">
                    {item.category}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground font-semibold">
                    {item.year}
                  </span>
                </div>

                <h3 className="font-display text-xl font-extrabold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {item.title}
                </h3>
                
                <p className="mt-1.5 text-xs font-semibold text-muted-foreground">
                  Client: <span className="text-foreground font-bold">{item.client}</span>
                </p>

                <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                  {item.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {item.stack.slice(0, 3).map((tech) => (
                    <span key={tech} className="rounded-md bg-muted/80 border border-border/40 px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:translate-x-1 group-hover:bg-primary group-hover:text-primary-foreground shadow-sm">
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Bottom CTA */}
      <div className="text-center pt-6">
        <button
          onClick={() => transitionTo("/portfolio", "ALL PORTFOLIO PROJECTS")}
          className="inline-flex items-center gap-3 rounded-full border border-border/80 bg-card/90 px-8 py-3.5 text-xs font-bold text-foreground backdrop-blur-xl shadow-lg transition-all hover:bg-muted hover:scale-105 hover:border-primary/40"
        >
          <span>View All Completed Projects ({portfolio.length})</span>
          <ArrowRight className="h-4 w-4 text-primary rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Landing Page Component ─────────────────────────────────────────────
function HomePage() {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { transitionTo } = usePageTransition();

  const parallaxOrb1 = useParallax<HTMLDivElement>(0.12);
  const parallaxOrb2 = useParallax<HTMLDivElement>(-0.08);

  const headlineScramble = useTextScramble(t("public.hero.title2") || "Built for the Future", 1100);

  const [activeModalService, setActiveModalService] = useState<any | null>(null);

  useEffect(() => {
    if (activeModalService) {
      const origBodyOverflow = document.body.style.overflow;
      const origHtmlOverflow = document.documentElement.style.overflow;
      const origBodyTouchAction = document.body.style.touchAction;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.touchAction = "none";

      return () => {
        document.body.style.overflow = origBodyOverflow;
        document.documentElement.style.overflow = origHtmlOverflow;
        document.body.style.touchAction = origBodyTouchAction;
      };
    }
  }, [activeModalService]);

  const pillars = [
    { icon: ShieldCheck, titleKey: "senior", bodyKey: "senior" },
    { icon: LineChart, titleKey: "outcomes", bodyKey: "outcomes" },
    { icon: Zap, titleKey: "ai", bodyKey: "ai" },
    { icon: Globe, titleKey: "bilingual", bodyKey: "bilingual" },
    { icon: Cloud, titleKey: "cloud", bodyKey: "cloud" },
    { icon: Award, titleKey: "product", bodyKey: "product" },
  ];

  return (
    <div className="relative overflow-x-hidden">
      {/* Global animation keyframes */}
      <style>{`
        @keyframes ticker { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
        @keyframes float1 { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-24px) } }
        @keyframes float2 { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(20px) } }
        @keyframes float3 { 0%,100% { transform: translateY(0px) rotate(0deg) } 50% { transform: translateY(-16px) rotate(4deg) } }
        @keyframes pulse-glow { 0%,100% { opacity:0.3; transform:scale(1) } 50% { opacity:0.6; transform:scale(1.06) } }
        @keyframes gradient-shift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
      `}</style>

      {/* Ambient Particle Field Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <ParticleCanvas count={28} color={isDark ? "130,100,255" : "80,60,200"} />
      </div>

      {/* ─── HERO SECTION ──────────────────────────────────────────────── */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center pt-24 pb-20">
        {/* Glow Spheres */}
        <div className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-primary/20 via-accent/15 to-transparent blur-[140px]" />
        
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

        <Container className="relative z-10 text-center">
          {/* Futuristic Eyebrow */}
          <ScrollReveal variant="fade-down" duration={700}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 backdrop-blur-xl shadow-lg">
              <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                {t("public.hero.tagline") || "THE NEXT-GEN OPERATING SYSTEM"}
              </span>
            </div>
          </ScrollReveal>

          {/* Kinetic Scramble Headline */}
          <ScrollReveal variant="blur-up" delay={140} duration={900}>
            <h1 className="mt-8 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-7xl lg:text-8xl max-w-6xl mx-auto">
              {t("public.hero.title1") || "Power Your Agency with"}{" "}
              <span
                ref={headlineScramble.ref as React.RefObject<HTMLSpanElement>}
                className="inline-block bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent drop-shadow-sm"
              >
                {headlineScramble.output}
              </span>
            </h1>
          </ScrollReveal>

          {/* Subtitle */}
          <ScrollReveal variant="fade-up" delay={280} duration={700}>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl font-medium">
              {t("public.hero.subtitle") || "The unified platform to manage clients, software projects, cloud infrastructure, team operations, and AI intelligence."}
            </p>
          </ScrollReveal>

          {/* Transition CTA Buttons */}
          <ScrollReveal variant="fade-up" delay={420} duration={600}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
              <button
                onClick={() => transitionTo("/contact", "START PROJECT")}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-primary via-primary-glow to-accent px-9 py-4 text-sm font-bold text-primary-foreground shadow-2xl shadow-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-primary/60"
              >
                <Sparkles className="h-4 w-4" />
                <span>{t("public.hero.startProject") || "Start A Project"}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180" />
              </button>
              <button
                onClick={() => transitionTo("/portfolio", "PORTFOLIO")}
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-8 py-4 text-sm font-bold text-foreground backdrop-blur-xl transition-all duration-300 hover:border-primary/50 hover:bg-muted hover:scale-105"
              >
                <span>{t("public.hero.seeWork") || "See Our Work"}</span>
              </button>
            </div>
          </ScrollReveal>

          {/* Animated Stats Bar */}
          <ScrollReveal variant="fade-up" delay={560} duration={800}>
            <div className="mx-auto mt-20 grid max-w-5xl gap-4 sm:grid-cols-2 md:grid-cols-4">
              {stats.map((s) => (
                <AnimatedStat key={s.label} value={s.value} label={s.label} />
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ─── CLIENT PORTAL SHOWCASE SECTION ─────────────────────────────────── */}
      <section className="py-24 sm:py-32 relative z-10 overflow-hidden">
        <Container>
          <ScrollReveal variant="blur-up" duration={700}>
            <div className="text-center max-w-3xl mx-auto mb-4 space-y-4">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                BEYOND JUST A SERVICE
              </span>
              <h2 className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">
                Experience Your Client Portal
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={150}>
            <ClientPortalShowcase />
          </ScrollReveal>
        </Container>
      </section>

      {/* ─── SERVICES GRID WITH 3D CARD ZOOM PREVIEWS ───────────────────── */}
      <section className="py-24 sm:py-32 relative z-10 bg-muted/20">
        <Container>
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <ScrollReveal variant="fade-right" duration={700}>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                {t("public.services.eyebrow") || "SPECIALIZED SERVICES"}
              </span>
              <h2 className="mt-3 font-display text-4xl font-extrabold text-foreground sm:text-5xl max-w-xl leading-tight">
                {t("public.services.title") || "Engineering & Software Capabilities"}
              </h2>
              <p className="mt-5 max-w-lg text-base text-muted-foreground leading-relaxed">
                {t("public.services.subtitle")}
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade-left" delay={100} duration={500}>
              <button
                onClick={() => transitionTo("/services", "ALL SERVICES")}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-6 py-3 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
              >
                <span>{t("public.services.viewAll") || "View All Services"}</span>
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </button>
            </ScrollReveal>
          </div>

          <StaggerReveal stagger={60} variant="fade-up" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.slice(0, 8).map((s) => {
              const Icon = SERVICE_ICONS[s.slug] ?? Sparkles;
              return (
                <InteractiveServiceCard
                  key={s.slug}
                  slug={s.slug}
                  icon={Icon}
                  title={s.name}
                  tagline={s.tagline}
                  description={s.description}
                  deliverables={s.deliverables}
                  onSelect={() => setActiveModalService(s)}
                />
              );
            })}
          </StaggerReveal>

          {/* Interactive Pricing Tiers Carousel Showcase (Software -> Hosting -> Maintenance) */}
          <div className="mt-24 pt-16 border-t border-border/40">
            <ScrollReveal variant="fade-up" duration={700}>
              <InteractivePricingShowcase />
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* ─── OUR WORK & FEATURED PROJECTS SHOWCASE SECTION (Below Price Plans) ───────────────── */}
      <section className="py-24 sm:py-32 relative z-10">
        <Container>
          <ScrollReveal variant="blur-up" duration={700}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> PROVEN TRACK RECORD
                </span>
                <h2 className="mt-3 font-display text-4xl font-extrabold text-foreground sm:text-5xl">
                  Our Work & Featured Projects
                </h2>
                <p className="mt-3 text-base text-muted-foreground max-w-xl">
                  Explore high-performance platforms, enterprise mobile apps, and scalable software solutions engineered for our clients.
                </p>
              </div>
              <button
                onClick={() => transitionTo("/portfolio", "PORTFOLIO")}
                className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-6 py-3 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105 shrink-0"
              >
                <span>Explore Full Portfolio</span>
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </button>
            </div>
          </ScrollReveal>

          {/* Interactive Work Grid Showcase */}
          <OurWorkShowcase transitionTo={transitionTo} />
        </Container>
      </section>

      {/* ─── WHY CHOOSE US PILLARS (Engineering Excellence) ───────────────────────────────────────── */}
      <section className="py-24 sm:py-32 relative z-10 bg-muted/20 border-t border-border/40">
        <Container>
          <ScrollReveal variant="blur-up" duration={700}>
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
                ENGINEERING EXCELLENCE
              </span>
              <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
                Why Software Leaders Trust Us
              </h2>
            </div>
          </ScrollReveal>

          <StaggerReveal stagger={80} variant="scale" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.titleKey}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="relative rounded-3xl border border-border/80 bg-card/80 p-8 shadow-xl backdrop-blur-xl hover:border-primary/40"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {t(`public.whyUs.pillars.${p.titleKey}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {t(`public.whyUs.pillars.${p.bodyKey}.body`)}
                  </p>
                </motion.div>
              );
            })}
          </StaggerReveal>
        </Container>
      </section>

      {/* ─── FINAL HYPER CTA SECTION ───────────────────────────────────── */}
      <section className="py-24 sm:py-32 relative z-10">
        <Container>
          <ScrollReveal variant="scale" duration={800}>
            <div className="relative overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/15 via-card to-accent/15 p-12 sm:p-20 text-center shadow-2xl backdrop-blur-2xl">
              <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
              <div className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
              <div className="relative z-10 space-y-6">
                <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-primary">
                  READY TO ELEVATE YOUR OPERATIONS?
                </span>
                <h2 className="font-display text-4xl font-extrabold text-foreground sm:text-6xl max-w-4xl mx-auto leading-tight">
                  Build Your Next Big Platform With The Knower System
                </h2>
                <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
                  Join hundreds of software agencies and enterprises delivering world-class digital products.
                </p>
                <div className="pt-6 flex flex-wrap items-center justify-center gap-5">
                  <button
                    onClick={() => transitionTo("/contact", "START PROJECT")}
                    className="inline-flex items-center gap-3 rounded-full bg-primary px-9 py-4 text-sm font-bold text-primary-foreground shadow-2xl shadow-primary/40 transition-all hover:scale-105 hover:bg-primary/90"
                  >
                    <span>{t("public.cta.startProject") || "Get Started Today"}</span>
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </button>
                  <button
                    onClick={() => transitionTo("/about", "ABOUT US")}
                    className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-8 py-4 text-sm font-bold text-foreground backdrop-blur-xl transition-all hover:bg-muted hover:scale-105"
                  >
                    <span>Learn About Us</span>
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ─── QUICK PREVIEW MODAL ON CARD CLICK ───────────────────────────── */}
      <AnimatePresence>
        {activeModalService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModalService(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-2xl overflow-y-auto overscroll-none touch-none"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-primary/40 bg-card p-6 sm:p-8 shadow-2xl ring-1 ring-primary/20 my-auto pointer-events-auto"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                  SERVICE SPECIFICATION
                </span>
                <button
                  onClick={() => setActiveModalService(null)}
                  className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
                {activeModalService.name}
              </h3>
              <p className="mt-1 text-sm font-semibold text-primary">{activeModalService.tagline}</p>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{activeModalService.description}</p>
              <div className="mt-6">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-foreground mb-3">
                  KEY DELIVERABLES:
                </h4>
                <ul className="grid grid-cols-2 gap-2">
                  {(activeModalService.deliverables || []).map((d: string) => (
                    <li key={d} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-border/40">
                <button
                  onClick={() => setActiveModalService(null)}
                  className="rounded-full px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const slug = activeModalService.slug;
                    const name = activeModalService.name;
                    setActiveModalService(null);
                    transitionTo(`/services/${slug}`, name.toUpperCase());
                  }}
                  className="rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-lg hover:bg-primary/90"
                >
                  View Full Details
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}