import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  accent = "primary",
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon?: LucideIcon;
  accent?: "primary" | "success" | "warning" | "destructive";
}) {
  const accentClass = {
    primary: "text-primary",
    success: "text-emerald-500",
    warning: "text-amber-500",
    destructive: "text-destructive",
  }[accent];

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-foreground">
            {value}
          </p>
          {delta && (
            <p className={cn("mt-1 text-xs font-medium", accentClass)}>{delta}</p>
          )}
        </div>
        {Icon && (
          <div className={cn("rounded-lg bg-muted p-2", accentClass)}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
    </div>
  );
}
