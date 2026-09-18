import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  online: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  valid: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  accepted: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  paid: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  done: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  resolved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  won: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",

  in_progress: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  sent: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  planning: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  contacted: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  review: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  qualified: "bg-blue-500/10 text-blue-500 border-blue-500/20",

  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  expiring: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  todo: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  draft: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  new: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  on_hold: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  on_leave: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  maintenance: "bg-amber-500/10 text-amber-500 border-amber-500/20",

  overdue: "bg-red-500/10 text-red-500 border-red-500/20",
  expired: "bg-red-500/10 text-red-500 border-red-500/20",
  rejected: "bg-red-500/10 text-red-500 border-red-500/20",
  lost: "bg-red-500/10 text-red-500 border-red-500/20",
  open: "bg-red-500/10 text-red-500 border-red-500/20",
  urgent: "bg-red-500/10 text-red-500 border-red-500/20",
  critical: "bg-red-500/10 text-red-500 border-red-500/20",
  error: "bg-red-500/10 text-red-500 border-red-500/20",
  offline: "bg-red-500/10 text-red-500 border-red-500/20",
  terminated: "bg-red-500/10 text-red-500 border-red-500/20",

  high: "bg-red-500/10 text-red-500 border-red-500/20",
  medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  low: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

export function StatusBadge({ value }: { value: string }) {
  const key = String(value).toLowerCase().replace(/\s+/g, "_");
  const cls = styles[key] ?? "bg-muted text-foreground border-border";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
        cls,
      )}
    >
      {value.replace(/_/g, " ")}
    </span>
  );
}
