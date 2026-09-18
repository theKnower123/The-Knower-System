import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Activity,
  Search,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileText,
  RefreshCw,
  Info,
} from "lucide-react";

export default function ActivityLogPage() {
  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  // Users List (for user dropdown filter)
  const [usersList, setUsersList] = useState<any[]>([]);

  // Response States
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [logsPage, setLogsPage] = useState<number>(1);
  const [logsLastPage, setLogsLastPage] = useState<number>(1);
  const [logsTotal, setLogsTotal] = useState<number>(0);
  const [logsLoading, setLogsLoading] = useState<boolean>(false);

  // Selected Detail Modal
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);

  // Fetch Users for filter dropdown on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch activity logs when filters or page change
  useEffect(() => {
    fetchGlobalLogs(logsPage);
  }, [logsPage, searchQuery, categoryFilter, moduleFilter, userFilter, fromDate, toDate]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/v1/admin/users", { params: { per_page: 100 } });
      if (res.data?.success) {
        setUsersList(res.data.data?.data || res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load user filter list", err);
    }
  };

  const fetchGlobalLogs = async (page: number) => {
    try {
      setLogsLoading(true);
      const res = await axios.get("/api/v1/admin/global-activity-logs", {
        params: {
          page,
          per_page: 15,
          search: searchQuery,
          user_id: userFilter,
          category: categoryFilter,
          module: moduleFilter,
          from_date: fromDate,
          to_date: toDate,
        },
      });

      if (res.data?.success) {
        setActivityLogs(res.data.data || []);
        setLogsPage(res.data.current_page || 1);
        setLogsLastPage(res.data.last_page || 1);
        setLogsTotal(res.data.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch global activity logs", err);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setModuleFilter("all");
    setUserFilter("all");
    setFromDate("");
    setToDate("");
    setLogsPage(1);
  };

  const formatExactDateTime = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <Head title="System Audit & Activity Logs - The Knower OS" />

      <div className="space-y-6 max-w-7xl mx-auto p-6 pb-12">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/10 text-indigo-300 backdrop-blur-sm">
                <Activity className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black tracking-tight">System Audit & Activity Logs</h1>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Centralized, auditable event trail capturing high-value user activities, security changes, administrative operations, and user histories across the entire system.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-white/10 text-white border-white/20 px-4 py-2 text-xs font-bold rounded-xl">
              {logsTotal} System Events
            </Badge>
            <Button
              size="sm"
              onClick={() => fetchGlobalLogs(logsPage)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </Button>
          </div>
        </div>

        {/* Search & Filter Control Bar */}
        <Card className="rounded-3xl border-border/80 shadow-md">
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Instant Search Bar */}
              <div className="md:col-span-4 relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search actions, targets, actors, description..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setLogsPage(1);
                  }}
                  className="pl-9 h-10 text-xs rounded-xl border-border/70"
                />
              </div>

              {/* User Filter Dropdown */}
              <div className="md:col-span-3">
                <select
                  value={userFilter}
                  onChange={(e) => {
                    setUserFilter(e.target.value);
                    setLogsPage(1);
                  }}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-border/70 bg-background text-foreground font-medium"
                >
                  <option value="all">All Users & Actors</option>
                  {usersList.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role}) - ID #{u.id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="md:col-span-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setLogsPage(1);
                  }}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-border/70 bg-background text-foreground font-medium"
                >
                  <option value="all">All Categories</option>
                  <option value="auth">Auth & Login</option>
                  <option value="security">Security & Freeze</option>
                  <option value="admin">Admin Actions</option>
                  <option value="crud">CRUD Edits</option>
                  <option value="file">File Operations</option>
                  <option value="profile">Profile Updates</option>
                </select>
              </div>

              {/* Module Filter */}
              <div className="md:col-span-3">
                <select
                  value={moduleFilter}
                  onChange={(e) => {
                    setModuleFilter(e.target.value);
                    setLogsPage(1);
                  }}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-border/70 bg-background text-foreground font-medium"
                >
                  <option value="all">All Modules</option>
                  <option value="Users">User Management</option>
                  <option value="Auth">Authentication</option>
                  <option value="CRM">CRM & Clients</option>
                  <option value="Projects">Projects</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR & Employees</option>
                  <option value="Support">Support</option>
                </select>
              </div>
            </div>

            {/* Date Range Inputs Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-border/40">
              <div className="md:col-span-5 flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">From Timestamp:</span>
                <Input
                  type="datetime-local"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setLogsPage(1);
                  }}
                  className="h-9 text-xs rounded-xl border-border/70"
                />
              </div>

              <div className="md:col-span-5 flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">To Timestamp:</span>
                <Input
                  type="datetime-local"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setLogsPage(1);
                  }}
                  className="h-9 text-xs rounded-xl border-border/70"
                />
              </div>

              <div className="md:col-span-2 flex items-center justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleClearFilters}
                  className="h-9 text-xs font-bold text-muted-foreground hover:text-foreground rounded-xl"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Logs Table */}
        <Card className="rounded-3xl border-border/80 shadow-md">
          <CardContent className="p-6">
            {logsLoading ? (
              <div className="p-12 text-center text-xs text-muted-foreground font-semibold">
                Loading system audit logs...
              </div>
            ) : activityLogs.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground border border-dashed rounded-2xl space-y-2">
                <Info className="w-6 h-6 mx-auto text-muted-foreground/60" />
                <div className="font-bold">No activity log entries found matching your query criteria.</div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="divide-y divide-border/40">
                  {activityLogs.map((log: any) => (
                    <div
                      key={log.id}
                      onClick={() => setSelectedActivity(log)}
                      className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 hover:bg-muted/40 px-3 rounded-2xl transition-all cursor-pointer"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-sm text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {log.action}
                          </span>

                          {log.category && (
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                log.category === "security"
                                  ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                                  : log.category === "auth"
                                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                  : log.category === "admin"
                                  ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                                  : "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20"
                              }`}
                            >
                              {log.category}
                            </span>
                          )}

                          {log.target_entity && (
                            <span className="text-[11px] font-mono font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border/40">
                              {log.target_entity}
                            </span>
                          )}
                        </div>

                        {/* Detailed Exact Timestamp */}
                        <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>{log.formatted_date_time || formatExactDateTime(log.created_at)}</span>
                        </div>

                        {log.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {log.description}
                          </p>
                        )}

                        <div className="text-[11px] text-muted-foreground flex items-center gap-2 flex-wrap">
                          <span>
                            Actor: <strong className="text-foreground">{log.causer_name || "System"}</strong> ({log.causer_role || "Role"})
                          </span>
                          {log.user && (
                            <>
                              <span>•</span>
                              <span>Target User: <strong className="text-foreground">{log.user.name}</strong></span>
                            </>
                          )}
                          {log.ip_address && (
                            <>
                              <span>•</span>
                              <span className="font-mono">IP: {log.ip_address}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 self-center">
                        <Button size="sm" variant="ghost" className="h-8 text-xs font-bold rounded-xl gap-1">
                          <Eye className="w-3.5 h-3.5 text-indigo-600" /> View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Server-Side Pagination Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <div className="text-xs text-muted-foreground font-semibold">
                    Page <span className="text-foreground font-bold">{logsPage}</span> of{" "}
                    <span className="text-foreground font-bold">{logsLastPage}</span> ({logsTotal} Matching System Logs)
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={logsPage <= 1 || logsLoading}
                      onClick={() => setLogsPage((prev) => Math.max(1, prev - 1))}
                      className="font-bold rounded-xl text-xs gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={logsPage >= logsLastPage || logsLoading}
                      onClick={() => setLogsPage((prev) => Math.min(logsLastPage, prev + 1))}
                      className="font-bold rounded-xl text-xs gap-1"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Selected Activity Details Modal */}
      {selectedActivity && (
        <Dialog open={true} onOpenChange={() => setSelectedActivity(null)}>
          <DialogContent className="max-w-2xl rounded-3xl p-6 border-border/80 shadow-2xl space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-black">
                <Activity className="w-6 h-6 text-indigo-600" /> Detailed Audit Log Entry
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                <div className="text-xs font-bold text-indigo-600 uppercase">Action Name</div>
                <div className="text-lg font-black text-foreground">{selectedActivity.action}</div>
                <div className="text-xs font-medium text-muted-foreground">{selectedActivity.description}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                  <div className="text-muted-foreground font-semibold">Exact Timestamp</div>
                  <div className="font-bold text-foreground mt-0.5">{selectedActivity.formatted_date_time || formatExactDateTime(selectedActivity.created_at)}</div>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                  <div className="text-muted-foreground font-semibold">Performed By (Actor)</div>
                  <div className="font-bold text-foreground mt-0.5">{selectedActivity.causer_name || "System"} ({selectedActivity.causer_role || "Role"})</div>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                  <div className="text-muted-foreground font-semibold">Target Record</div>
                  <div className="font-bold text-foreground mt-0.5">{selectedActivity.target_entity || "System"}</div>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                  <div className="text-muted-foreground font-semibold">Module & Category</div>
                  <div className="font-bold text-foreground mt-0.5 capitalize">{selectedActivity.module || "Auth"} / {selectedActivity.category}</div>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                  <div className="text-muted-foreground font-semibold">IP Address</div>
                  <div className="font-mono text-foreground mt-0.5">{selectedActivity.ip_address || "Internal"}</div>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                  <div className="text-muted-foreground font-semibold">User Agent / Client</div>
                  <div className="font-mono text-[10px] text-muted-foreground truncate mt-0.5">{selectedActivity.user_agent || "Web Browser"}</div>
                </div>
              </div>

              {/* Before & After Properties Diff Box */}
              {selectedActivity.properties && (
                <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-2 border border-slate-800">
                  <div className="text-xs font-bold text-indigo-400 font-sans flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> Execution Payload / Diff
                  </div>
                  <pre className="overflow-x-auto p-2 bg-slate-950 rounded-xl text-slate-300">
                    {JSON.stringify(selectedActivity.properties, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setSelectedActivity(null)} variant="secondary" className="font-bold rounded-xl">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
