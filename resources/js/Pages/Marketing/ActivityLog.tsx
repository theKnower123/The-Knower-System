import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import {
  Activity,
  Search,
  Filter,
  User,
  Calendar,
  Layers,
  FileText,
  Clock,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface LogEntry {
  id: number;
  log_name: string;
  description: string;
  subject_type: string;
  subject_id: number;
  causer?: { id: number; name: string };
  properties: any;
  created_at: string;
}

interface Props {
  logs: {
    data: LogEntry[];
    links: any[];
  };
  actors: Array<{ id: number; name: string }>;
  filters?: {
    search?: string;
    module?: string;
    actor_id?: string;
    date_from?: string;
    date_to?: string;
  };
}

export default function MarketingActivityLogPage({
  logs,
  actors,
  filters,
}: Props) {
  const [search, setSearch] = useState(filters?.search || "");
  const [module, setModule] = useState(filters?.module || "");
  const [actorId, setActorId] = useState(filters?.actor_id || "");
  const [dateFrom, setDateFrom] = useState(filters?.date_from || "");
  const [dateTo, setDateTo] = useState(filters?.date_to || "");

  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const logsList = logs?.data || [];

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(
      "/marketing/activity-log",
      {
        search: search || undefined,
        module: module || undefined,
        actor_id: actorId || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      },
      { preserveState: true }
    );
  };

  const handleResetFilters = () => {
    setSearch("");
    setModule("");
    setActorId("");
    setDateFrom("");
    setDateTo("");
    router.get("/marketing/activity-log");
  };

  const getModuleBadge = (subjectType: string) => {
    if (subjectType.includes("SocialAccount")) {
      return <Badge className="bg-blue-500/15 text-blue-600 border-blue-200">Social Accounts</Badge>;
    }
    if (subjectType.includes("Post")) {
      return <Badge className="bg-purple-500/15 text-purple-600 border-purple-200">Content Posts</Badge>;
    }
    if (subjectType.includes("Campaign")) {
      return <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-200">Campaigns</Badge>;
    }
    if (subjectType.includes("Landing") || subjectType.includes("Portfolio") || subjectType.includes("Testimonial")) {
      return <Badge className="bg-amber-500/15 text-amber-600 border-amber-200">Landing Page</Badge>;
    }
    if (subjectType.includes("Lead")) {
      return <Badge className="bg-sky-500/15 text-sky-600 border-sky-200">Sales Pipeline</Badge>;
    }
    return <Badge variant="secondary">General</Badge>;
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border/40 rounded-xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Marketing Audit & Activity Log</h1>
              <p className="text-sm text-muted-foreground">
                Track and search every visibility toggle, post approval, campaign launch, and account edit.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Bar */}
      <form onSubmit={handleApplyFilters} className="bg-card border border-border/40 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-bold text-sm text-foreground">
          <Filter className="w-4 h-4 text-primary" /> Advanced Search & Filters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground">Search Query</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 text-xs h-9"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground">Sub-module</label>
            <select
              value={module}
              onChange={(e) => setModule(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs h-9 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Modules</option>
              <option value="social_accounts">Social Accounts</option>
              <option value="posts">Content Posts</option>
              <option value="campaigns">Campaigns & Ads</option>
              <option value="landing">Landing Page Control</option>
              <option value="leads">Sales Pipeline</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground">Actor (User)</label>
            <select
              value={actorId}
              onChange={(e) => setActorId(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs h-9 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Actors</option>
              {actors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} (ID: {a.id})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground">From Date</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground">To Date</label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="text-xs h-9"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
          <Button type="button" variant="outline" size="sm" onClick={handleResetFilters} className="text-xs h-8">
            Reset Filters
          </Button>
          <Button type="submit" size="sm" className="text-xs h-8 gap-1">
            <Filter className="w-3.5 h-3.5" /> Apply Filters
          </Button>
        </div>
      </form>

      {/* Activity Log Table */}
      <div className="bg-card border border-border/40 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground border-b border-border">
            <tr>
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5">Actor (User)</th>
              <th className="p-3.5">Sub-module</th>
              <th className="p-3.5">Activity Description</th>
              <th className="p-3.5 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {logsList.map((log) => (
              <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                <td className="p-3.5 text-xs text-muted-foreground font-mono whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString()}
                </td>

                <td className="p-3.5 font-medium text-foreground text-xs flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                    {log.causer?.name?.charAt(0) || "U"}
                  </div>
                  <span>{log.causer?.name || "System Automated"}</span>
                </td>

                <td className="p-3.5">{getModuleBadge(log.subject_type || log.log_name)}</td>

                <td className="p-3.5 text-xs font-medium text-foreground">{log.description}</td>

                <td className="p-3.5 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedLog(log)}
                    className="text-xs h-7 gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <FileText className="w-3.5 h-3.5" /> Payload Diff
                  </Button>
                </td>
              </tr>
            ))}

            {logsList.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-muted-foreground text-sm">
                  No activity logs matching the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Payload Diff Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" /> Log Entry #{selectedLog.id}
              </h2>
              <button onClick={() => setSelectedLog(null)} className="text-muted-foreground hover:text-foreground text-sm">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-muted-foreground">Description:</span>
                <p className="font-medium text-foreground text-sm mt-0.5">{selectedLog.description}</p>
              </div>

              <div>
                <span className="font-semibold text-muted-foreground">Subject Type:</span>
                <p className="font-mono text-muted-foreground">{selectedLog.subject_type} (ID: {selectedLog.subject_id})</p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-muted-foreground">Properties / Changes Payload:</span>
                <pre className="p-3 bg-muted rounded-lg font-mono text-[11px] overflow-x-auto text-foreground border border-border/40">
                  {JSON.stringify(selectedLog.properties || {}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
