import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PartnershipBadge() {
  const { t } = useTranslation();

  return (
    <div className="mt-12 border-t border-border/40 pt-8">
      <div className="rounded-2xl border border-border/50 bg-card/40 p-4.5 sm:px-6 sm:py-4 backdrop-blur-xs transition-colors hover:border-border/80">
        {/* Eyebrow Label */}
        <div className="mb-3 text-center sm:text-start">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {t("public.footer.partnership.eyebrow")}
          </span>
        </div>

        {/* Responsive Content Row / Stack */}
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-start">
          {/* Logo & Tagline Group (Side-by-side on desktop, stacked on mobile) */}
          <div className="flex flex-col items-center gap-3.5 sm:flex-row sm:gap-4.5">
            {/* Combined Logo Badge */}
            <div className="inline-flex items-center justify-center rounded-xl border border-border/40 bg-white/95 px-3 py-1.5 shadow-xs transition-transform duration-200 hover:scale-[1.02] shrink-0">
              <img
                src="/partners/techne-partnership.png"
                alt="The Knower OS & Techne Summit Partnership"
                className="h-7 sm:h-8 w-auto max-w-[190px] sm:max-w-[210px] object-contain"
                loading="lazy"
              />
            </div>

            {/* Tagline text */}
            <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-relaxed max-w-md">
              {t("public.footer.partnership.tagline")}
            </p>
          </div>

          {/* Action CTA Button */}
          <div className="w-full sm:w-auto flex justify-center sm:justify-end shrink-0">
            <Button
              asChild
              size="sm"
              className="w-full sm:w-auto rounded-full font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.02] gap-1.5 text-xs h-9 px-5"
            >
              <a
                href="https://technesummit.com/2026#ticketsSection"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{t("public.footer.partnership.bookNow")}</span>
                <ExternalLink className="h-3.5 w-3.5 rtl:rotate-180" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
