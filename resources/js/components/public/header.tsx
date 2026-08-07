import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, Languages, LogIn, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocaleStore } from "@/store/i18n";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/store/auth";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

// Nav items use i18n key references, labels resolved inside the component
const NAV_KEYS: Array<{ key: string; to: string }> = [
  { key: "solutions", to: "/solutions" },
  { key: "products", to: "/products" },
  { key: "services", to: "/services" },
  { key: "pricing", to: "/pricing" },
  { key: "portfolio", to: "/portfolio" },
  { key: "company", to: "/about" },
];

const MORE_KEYS: Array<{ key: string; to: string }> = [
  { key: "caseStudies", to: "/case-studies" },
  { key: "technologies", to: "/technologies" },
  { key: "aiSolutions", to: "/ai-solutions" },
  { key: "hostingCloud", to: "/hosting" },
  { key: "domains", to: "/domains" },
  { key: "maintenance", to: "/maintenance" },
  { key: "blog", to: "/blog" },
  { key: "docs", to: "/docs" },
  { key: "careers", to: "/careers" },
  { key: "team", to: "/team" },
  { key: "partners", to: "/partners" },
  { key: "clients", to: "/clients" },
  { key: "events", to: "/events" },
  { key: "press", to: "/press" },
  { key: "resources", to: "/resources" },
  { key: "downloads", to: "/downloads" },
  { key: "support", to: "/support" },
  { key: "faq", to: "/faq" },
  { key: "status", to: "/status" },
  { key: "contact", to: "/contact" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const user = useAuth((s) => s.user);

  const switchLocale = () => {
    const next = locale === "en" ? "ar" : "en";
    setLocale(next);
    void i18n.changeLanguage(next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="font-display text-base font-bold">K</span>
          </div>
          <span className="font-display text-base font-semibold tracking-tight">{t('app.name')}</span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {NAV_KEYS.map((n) => (
            <Link
              key={n.to}
              to={n.to as never}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {t(`public.nav.${n.key}`)}
            </Link>
          ))}
          <div className="relative">
            <button
              onClick={() => setMoreOpen((v) => !v)}
              onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {t('public.nav.more')}
            </button>
            {moreOpen && (
              <div className="absolute end-0 top-full mt-1 grid w-[520px] grid-cols-2 gap-1 rounded-xl border border-border bg-popover p-3 shadow-xl">
                {MORE_KEYS.map((m) => (
                  <Link
                    key={m.to}
                    to={m.to as never}
                    className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    {t(`public.nav.${m.key}`)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="ms-auto flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex" aria-label={t('common.search')}>
            <Search className="h-4 w-4" />
          </Button>
          <ModeToggle />
          <Button variant="ghost" size="sm" onClick={switchLocale} className="gap-1 hidden md:inline-flex" aria-label={t('common.language')}>
            <Languages className="h-4 w-4" />
            <span className="text-xs uppercase">{locale}</span>
          </Button>
          {user ? (
            <Button size="sm" onClick={() => (window.location.href = "/dashboard")} className="gap-1.5">
              {t('public.nav.goToApp')} <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/login")} className="hidden sm:inline-flex gap-1.5">
                <LogIn className="h-4 w-4" /> {t('public.nav.signIn')}
              </Button>
              <Button size="sm" onClick={() => void navigate({ to: "/contact" })} className="gap-1.5 hidden sm:inline-flex">
                {t('public.nav.startProject')}
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label={t('public.nav.more')}>
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={cn("lg:hidden overflow-hidden border-t border-border transition-[max-height]", open ? "max-h-[70vh]" : "max-h-0")}>
        <div className="grid max-h-[70vh] grid-cols-2 gap-1 overflow-y-auto p-4">
          {[...NAV_KEYS, ...MORE_KEYS].map((n) => (
            <Link
              key={n.to}
              to={n.to as never}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {t(`public.nav.${n.key}`)}
            </Link>
          ))}
          <button
            onClick={switchLocale}
            className="col-span-2 mt-2 flex items-center justify-center gap-2 rounded-md border border-border py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Languages className="h-4 w-4" />
            {locale === "en" ? "العربية" : "English"}
          </button>
        </div>
      </div>
    </header>
  );
}
