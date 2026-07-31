import { Link, useRouterState } from "@tanstack/react-router";
import {
  Facebook, Instagram, Linkedin, Youtube, MessageCircle, Music2, Twitter, Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Platform, PostStatus } from "@/mocks/marketing-ops";
import { PLATFORM_LABELS } from "@/mocks/marketing-ops";

const NAV = [
  { to: "/marketing/dashboard", label: "Dashboard" },
  { to: "/marketing/accounts", label: "Social Accounts" },
  { to: "/marketing/content", label: "Content Calendar" },
  { to: "/marketing/campaigns", label: "Campaigns" },
  { to: "/marketing/landing", label: "Landing Page" },
  { to: "/marketing/pipeline", label: "Sales Pipeline" },
  { to: "/marketing/activity", label: "Activity Log" },
];

export function MarketingNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="-mx-1 mb-6 flex gap-1 overflow-x-auto border-b border-border pb-0.5">
      {NAV.map((n) => {
        const active = pathname === n.to || pathname.startsWith(n.to + "/");
        return (
          <Link
            key={n.to}
            to={n.to as never}
            className={cn(
              "shrink-0 rounded-t-md border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {n.label}
          </Link>
        );
      })}
    </div>
  );
}

const ICONS: Record<Platform, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  whatsapp: MessageCircle,
  tiktok: Music2,
  x: Twitter,
};

const PLATFORM_COLOR: Record<Platform, string> = {
  facebook: "text-sky-500 bg-sky-500/10",
  instagram: "text-fuchsia-500 bg-fuchsia-500/10",
  linkedin: "text-blue-500 bg-blue-500/10",
  youtube: "text-red-500 bg-red-500/10",
  whatsapp: "text-emerald-500 bg-emerald-500/10",
  tiktok: "text-foreground bg-muted",
  x: "text-foreground bg-muted",
};

export function PlatformIcon({ platform, className }: { platform: Platform; className?: string }) {
  const Icon = ICONS[platform];
  return (
    <span
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded-md",
        PLATFORM_COLOR[platform],
        className,
      )}
      title={PLATFORM_LABELS[platform]}
    >
      <Icon className="h-3.5 w-3.5" />
    </span>
  );
}

export function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <PlatformIcon platform={platform} />
      {PLATFORM_LABELS[platform]}
    </span>
  );
}

const POST_STATUS: Record<PostStatus, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  pending_approval: { label: "Pending approval", cls: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  changes_requested: { label: "Changes requested", cls: "bg-red-500/10 text-red-500 border-red-500/20" },
  scheduled: { label: "Scheduled", cls: "bg-sky-500/10 text-sky-500 border-sky-500/20" },
  published: { label: "Published", cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
};

export function PostStatusBadge({ status }: { status: PostStatus }) {
  const s = POST_STATUS[status];
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase", s.cls)}>
      {s.label}
    </span>
  );
}

export function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn("h-3.5 w-3.5", i < value ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40")}
        />
      ))}
    </span>
  );
}

export function MemberChip({ name, color }: { name: string; color?: string }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold",
        color ?? "bg-muted text-muted-foreground",
      )}
      title={name}
    >
      {initials}
    </span>
  );
}
