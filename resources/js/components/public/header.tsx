import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Menu,
  X,
  Languages,
  LogIn,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocaleStore } from "@/store/i18n";
import { useAuth } from "@/store/auth";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { TransitionLink, usePageTransition } from "@/components/public/PageTransitionManager";
import { motion, AnimatePresence } from "framer-motion";

const NAV_KEYS: Array<{ key: string; to: string }> = [
  { key: "solutions", to: "/solutions" },
  { key: "products", to: "/products" },
  { key: "services", to: "/services" },
  { key: "pricing", to: "/pricing" },
  { key: "about", to: "/about" },
];

const MORE_KEYS: Array<{ key: string; to: string }> = [
  { key: "hosting", to: "/hosting" },
  { key: "domains", to: "/domains" },
  { key: "maintenance", to: "/maintenance" },
  { key: "aiSolutions", to: "/ai-solutions" },
  { key: "technologies", to: "/technologies" },
  { key: "portfolio", to: "/portfolio" },
  { key: "team", to: "/team" },
  { key: "careers", to: "/careers" },
  { key: "blog", to: "/blog" },
  { key: "docs", to: "/docs" },
  { key: "contact", to: "/contact" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { transitionTo } = usePageTransition();
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const user = useAuth((s) => s.user);

  const switchLocale = () => {
    const next = locale === "en" ? "ar" : "en";
    setLocale(next);
    void i18n.changeLanguage(next);
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = next;
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-background/70 border-b border-border/40 shadow-sm transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Brand Logo with Glowing Halo */}
        <TransitionLink to="/" label="HOMEPAGE" className="group flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 via-primary/10 to-accent/20 p-0.5 shadow-md shadow-primary/20 transition-transform duration-300 group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-background/90 backdrop-blur-md">
              <img src="/favicon-96x96.png" alt="The Knower OS Logo" className="h-6 w-6 object-contain" />
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-primary/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-none">
              {t('app.name')}
            </span>
            <span className="mt-1 text-[9px] font-mono font-extrabold tracking-widest text-primary uppercase">
              ONE SYSTEM . ANY BUSINESS
            </span>
          </div>
        </TransitionLink>

        {/* Floating Desktop Capsule Navbar */}
        <nav className="hidden lg:flex items-center gap-1 rounded-full border border-border/60 bg-card/60 p-1.5 shadow-inner backdrop-blur-xl">
          {NAV_KEYS.map((n) => {
            const label = t(`public.nav.${n.key}`);
            return (
              <TransitionLink
                key={n.to}
                to={n.to}
                label={label}
                className="relative rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-muted/60"
                activeClassName="bg-primary/15 text-primary border border-primary/30 shadow-sm"
              >
                {label}
              </TransitionLink>
            );
          })}

          {/* Mega Menu Toggle */}
          <div className="relative">
            <button
              onClick={() => setMoreOpen((v) => !v)}
              onBlur={() => setTimeout(() => setMoreOpen(false), 200)}
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-all hover:text-foreground hover:bg-muted/60"
            >
              <span>{t('public.nav.more')}</span>
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", moreOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute end-0 top-full mt-3 grid w-[540px] grid-cols-2 gap-1.5 rounded-3xl border border-border/80 bg-card/95 p-4 shadow-2xl backdrop-blur-2xl ring-1 ring-primary/10"
                >
                  <div className="col-span-2 mb-2 flex items-center justify-between border-b border-border/40 pb-2 px-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary flex items-center gap-1">
                      <Compass className="h-3.5 w-3.5" /> EXTENDED ECOSYSTEM MODULES
                    </span>
                    <span className="text-[10px] text-muted-foreground">ZOOM PORTAL ENABLED</span>
                  </div>
                  {MORE_KEYS.map((m) => {
                    const label = t(`public.nav.${m.key}`);
                    return (
                      <TransitionLink
                        key={m.to}
                        to={m.to}
                        label={label}
                        className="group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
                      >
                        <span>{label}</span>
                        <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 rtl:rotate-180" />
                      </TransitionLink>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="ghost" size="sm" onClick={switchLocale} className="gap-1.5 hidden md:inline-flex rounded-full text-xs font-mono">
            <Languages className="h-4 w-4 text-primary" />
            <span className="uppercase">{locale}</span>
          </Button>

          {user ? (
            <Button size="sm" onClick={() => (window.location.href = "/dashboard")} className="gap-2 rounded-full font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
              {t('public.nav.goToApp')} <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (window.location.href = "/login")}
                className="hidden sm:inline-flex gap-1.5 rounded-full text-xs font-semibold"
              >
                <LogIn className="h-4 w-4" /> {t('public.nav.signIn')}
              </Button>
              <Button
                size="sm"
                onClick={() => transitionTo("/contact", "START PROJECT")}
                className="gap-2 rounded-full font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105 hidden sm:inline-flex"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {t('public.nav.startProject')}
              </Button>
            </>
          )}

          {/* Mobile Drawer Trigger */}
          <Button variant="ghost" size="icon" className="lg:hidden rounded-full" onClick={() => setOpen((v) => !v)} aria-label={t('public.nav.more')}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden border-t border-border/50 bg-card/95 backdrop-blur-2xl"
          >
            <div className="grid max-h-[75vh] grid-cols-2 gap-2 overflow-y-auto p-5">
              {[...NAV_KEYS, ...MORE_KEYS].map((n) => {
                const label = t(`public.nav.${n.key}`);
                return (
                  <TransitionLink
                    key={n.to}
                    to={n.to}
                    label={label}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-xl border border-border/40 bg-background/50 p-3 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
                  >
                    <span>{label}</span>
                  </TransitionLink>
                );
              })}
              <button
                onClick={switchLocale}
                className="col-span-2 mt-2 flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 p-3 text-xs font-bold text-primary"
              >
                <Languages className="h-4 w-4" />
                {locale === "en" ? "SWITCH TO ARABIC (العربية)" : "SWITCH TO ENGLISH"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}