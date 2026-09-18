import React, { useState, useMemo } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, Mail, Phone, Calendar, Search, 
  ExternalLink, Tag, Clock,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Inquiry {
  id: string;
  title: string;
  name: string;
  email: string;
  phone: string | null;
  whatsapp_number: string | null;
  inquiry_type: "pricing_plan" | "demo_request" | "business" | "general";
  interested_plan: string | null;
  status: string;
  source: string;
  createdAt: string;
  contact_id: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const TYPES = [
  { key: "all",          labelKey: "inquiries.filter.all",        color: "bg-muted text-muted-foreground" },
  { key: "pricing_plan", labelKey: "inquiries.type.pricingPlan",  color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  { key: "demo_request", labelKey: "inquiries.type.demoRequest",  color: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20" },
  { key: "business",     labelKey: "inquiries.type.business",     color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  { key: "general",      labelKey: "inquiries.type.general",      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
];

function typeColor(type: string) {
  return TYPES.find(t => t.key === type)?.color ?? "bg-muted text-muted-foreground";
}

function WaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── Inquiry Card ─────────────────────────────────────────────────────────────
function InquiryCard({ inquiry }: { inquiry: Inquiry }) {
  const { t } = useTranslation();
  const typeInfo = TYPES.find(t => t.key === inquiry.inquiry_type) ?? TYPES[0];

  const whatsappHref = inquiry.whatsapp_number
    ? `https://wa.me/${inquiry.whatsapp_number.replace(/[^0-9]/g, "")}`
    : null;

  const date = new Date(inquiry.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  const time = new Date(inquiry.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="group rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
            {(inquiry.name || inquiry.title || "?")[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-foreground leading-tight">{inquiry.name || inquiry.title}</p>
            <p className="text-xs text-muted-foreground">{inquiry.email}</p>
          </div>
        </div>
        <Badge variant="outline" className={`text-xs shrink-0 ${typeColor(inquiry.inquiry_type)}`}>
          {t(typeInfo.labelKey, { defaultValue: inquiry.inquiry_type })}
        </Badge>
      </div>

      {/* Details */}
      <div className="space-y-1.5 mb-4">
        {inquiry.interested_plan && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Tag className="h-3.5 w-3.5 text-blue-500" />
            <span className="font-medium text-blue-600 dark:text-blue-400">{t("inquiries.interestedIn")}: <strong>{inquiry.interested_plan}</strong></span>
          </div>
        )}
        {inquiry.phone && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone className="h-3.5 w-3.5" />
            <span>{inquiry.phone}</span>
          </div>
        )}
        {inquiry.whatsapp_number && (
          <div className="flex items-center gap-2 text-xs text-[#25D366]">
            <WaIcon className="h-3.5 w-3.5" />
            <span className="font-medium">{inquiry.whatsapp_number}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{date} · {time}</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
        <a
          href={`mailto:${inquiry.email}`}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
        >
          <Mail className="h-3.5 w-3.5" />
          {t("inquiries.actions.email")}
        </a>

        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-[#25D366]/40 bg-[#25D366]/10 px-3 py-1.5 text-xs font-bold text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
          >
            <WaIcon className="h-3.5 w-3.5" />
            {t("inquiries.actions.whatsapp")}
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
        ) : inquiry.phone ? (
          <a
            href={`https://wa.me/${inquiry.phone.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-[#25D366]/40 hover:text-[#25D366] transition-colors"
          >
            <WaIcon className="h-3.5 w-3.5" />
            {t("inquiries.actions.whatsappViaPhone")}
          </a>
        ) : null}

        {inquiry.phone && (
          <a
            href={`tel:${inquiry.phone}`}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/40 transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            {t("inquiries.actions.call")}
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InquiriesPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["leads", filterType, search],
    queryFn: async () => {
      const res = await axios.get("/api/leads", {
        params: {
          inquiry_type: filterType === "all" ? undefined : filterType,
          search: search || undefined,
          source: "website",
        },
      });
      return (res.data.data || []) as Inquiry[];
    },
  });

  const inquiries = data ?? [];

  // Count per type
  const counts = useMemo(() => {
    const all = data ?? [];
    return {
      all: all.length,
      pricing_plan:  all.filter(i => i.inquiry_type === "pricing_plan").length,
      demo_request:  all.filter(i => i.inquiry_type === "demo_request").length,
      business:      all.filter(i => i.inquiry_type === "business").length,
      general:       all.filter(i => i.inquiry_type === "general").length,
    };
  }, [data]);

  return (
    <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-primary" />
              {t("inquiries.title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">{t("inquiries.subtitle")}</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={t("inquiries.searchPlaceholder")}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {TYPES.map(tp => {
            const count = counts[tp.key as keyof typeof counts] ?? 0;
            const active = filterType === tp.key;
            return (
              <button
                key={tp.key}
                onClick={() => setFilterType(tp.key)}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium border transition-all ${
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {t(tp.labelKey, { defaultValue: tp.key })}
                <span className={`flex h-5 min-w-5 items-center justify-center rounded-full text-[11px] font-bold px-1 ${active ? "bg-white/20" : "bg-muted"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 rounded-xl border border-border bg-card animate-pulse" />
            ))}
          </div>
        ) : inquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
            <MessageCircle className="h-12 w-12 mb-3 opacity-30" />
            <p className="font-medium">{t("inquiries.empty")}</p>
            <p className="text-sm">{t("inquiries.emptyDesc")}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {inquiries.map(inq => <InquiryCard key={inq.id} inquiry={inq} />)}
          </div>
        )}
    </div>
  );
}
