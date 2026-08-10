import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  User,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Key,
  Lock,
  Building2,
  Briefcase,
  Clock,
  Activity,
  CheckCircle2,
  AlertTriangle,
  UserX,
  RotateCcw,
  Trash2,
  Edit,
  Layers,
  Sparkles,
  Award,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Search,
  Filter,
  Calendar,
  Eye,
  FileText,
  Info,
} from "lucide-react";

interface UserInspectModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  extraData?: any;
  loading?: boolean;
  onEdit?: (user: any) => void;
  onToggleFreeze?: (user: any) => void;
  onForceDelete?: (user: any) => void;
}

export function UserInspectModal({
  isOpen,
  onClose,
  user,
  extraData,
  loading,
  onEdit,
  onToggleFreeze,
  onForceDelete,
}: UserInspectModalProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "profile" | "permissions" | "type_details" | "security" | "activity"
  >("overview");

  // Server-side search & filter states for activity logs
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  // Activity logs response state
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [logsPage, setLogsPage] = useState<number>(1);
  const [logsLastPage, setLogsLastPage] = useState<number>(1);
  const [logsTotal, setLogsTotal] = useState<number>(0);
  const [logsLoading, setLogsLoading] = useState<boolean>(false);

  // Activity detail inspection modal state
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);

  // Fetch paginated logs whenever tab, filters, page, or user changes
  useEffect(() => {
    if (user?.id && (activeTab === "activity" || activeTab === "overview")) {
      fetchServerLogs(user.id, logsPage);
    }
  }, [user?.id, activeTab, logsPage, searchQuery, categoryFilter, fromDate, toDate]);

  const fetchServerLogs = async (userId: number, page: number) => {
    try {
      setLogsLoading(true);
      const res = await axios.get(`/api/v1/admin/users/${userId}/activity-logs`, {
        params: {
          page,
          per_page: 10,
          search: searchQuery,
          category: categoryFilter,
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
      console.error("Failed to load activity logs", err);
    } finally {
      setLogsLoading(false);
    }
  };

  if (!user && !loading) return null;

  const permissionsBreakdown = extraData?.permissions_breakdown;
  const security = extraData?.security;
  const typeExtra = extraData?.extra || {};

  const isFrozen = user?.is_frozen || user?.deleted_at != null;

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
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

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setFromDate("");
    setToDate("");
    setLogsPage(1);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0 rounded-3xl border-border/80 shadow-2xl backdrop-blur-2xl flex flex-col">
          {/* ── Top Header Banner ── */}
          <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white border-b border-white/10 shrink-0">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-xl shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 font-black text-2xl flex items-center justify-center text-white border-2 border-white/20 shadow-xl shrink-0">
                    {getInitials(user?.name || "")}
                  </div>
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-black tracking-tight">{user?.name || "Loading User..."}</h2>
                    <span className="text-xs px-3 py-1 rounded-full font-extrabold bg-white/10 border border-white/15 text-indigo-200">
                      ID #{user?.id}
                    </span>
                    {isFrozen ? (
                      <span className="text-xs px-3 py-1 rounded-full font-black bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center gap-1.5">
                        <UserX className="w-3.5 h-3.5" /> Account Frozen (Trashed)
                      </span>
                    ) : (
                      <span className="text-xs px-3 py-1 rounded-full font-black bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active & Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-300 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-400" /> {user?.email}
                    </span>
                    {user?.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-indigo-400" /> {user.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-indigo-400" /> {user?.user_type_label || user?.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                {onEdit && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(user)}
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold rounded-xl gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Profile
                  </Button>
                )}
                {onToggleFreeze && (
                  <Button
                    size="sm"
                    variant={isFrozen ? "default" : "secondary"}
                    onClick={() => onToggleFreeze(user)}
                    className={`font-bold rounded-xl gap-1.5 ${
                      isFrozen
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-amber-600 hover:bg-amber-700 text-white"
                    }`}
                  >
                    {isFrozen ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" /> Restore Account
                      </>
                    ) : (
                      <>
                        <UserX className="w-3.5 h-3.5" /> Freeze Account
                      </>
                    )}
                  </Button>
                )}
                {onForceDelete && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onForceDelete(user)}
                    className="font-bold rounded-xl gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Permanently
                  </Button>
                )}
              </div>
            </div>

            {/* Navigation Tab Strip */}
            <div className="flex items-center gap-1 mt-6 border-t border-white/10 pt-4 overflow-x-auto">
              {[
                { id: "overview", label: "Overview", icon: Layers },
                { id: "profile", label: "Account Profile", icon: User },
                { id: "permissions", label: "Role & Permissions", icon: ShieldCheck },
                { id: "type_details", label: "User Type Info", icon: Building2 },
                { id: "security", label: "Security & Auth", icon: Lock },
                { id: "activity", label: "Activity Log", icon: Activity },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-white text-slate-900 shadow-md scale-105"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Scrollable Modal Body ── */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/50">
            {loading ? (
              <div className="p-12 text-center text-muted-foreground font-semibold">
                Loading comprehensive user details...
              </div>
            ) : (
              <>
                {/* TAB 1: OVERVIEW */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Summary Metric Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Role Privilege
                        </div>
                        <div className="text-lg font-black text-foreground capitalize">
                          {user?.user_type_label || user?.role}
                        </div>
                        <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                          System Designation
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Account Status
                        </div>
                        <div
                          className={`text-lg font-black ${
                            isFrozen ? "text-rose-600" : "text-emerald-600"
                          }`}
                        >
                          {isFrozen ? "Frozen (Trashed)" : "Active"}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {isFrozen ? "Login access blocked" : "Permitted to authenticate"}
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Auth Method
                        </div>
                        <div className="text-lg font-black text-foreground">
                          {security?.auth_method || "Standard"}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {security?.has_google ? "OAuth Enabled" : "Password Protected"}
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Last Active
                        </div>
                        <div className="text-base font-bold text-foreground">
                          {user?.last_login_at
                            ? new Date(user.last_login_at).toLocaleDateString()
                            : "Never Logged In"}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {user?.last_login_at
                            ? new Date(user.last_login_at).toLocaleTimeString()
                            : "No activity recorded"}
                        </div>
                      </div>
                    </div>

                    {/* Frozen Account Detailed Notice */}
                    {isFrozen && (
                      <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 space-y-2">
                        <div className="flex items-center gap-2 font-black text-base">
                          <AlertTriangle className="w-5 h-5 text-rose-600" /> Account Status: Frozen / Blocked
                        </div>
                        <p className="text-xs leading-relaxed">
                          This user account was moved to Trash by a Super Admin on{" "}
                          <strong>{security?.deleted_at ? formatExactDateTime(security.deleted_at) : "Recent"}</strong>.
                          The user is strictly blocked from logging into the web app, client portal, or API using either regular credentials or Google OAuth authentication.
                        </p>
                      </div>
                    )}

                    {/* Overview Grid: Permissions & Type Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-extrabold text-base flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-indigo-600" /> Effective System Privileges
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {permissionsBreakdown?.effective_permissions?.length || 0} Grants
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                          {permissionsBreakdown?.effective_permissions?.map((perm: string) => (
                            <span
                              key={perm}
                              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20"
                            >
                              {perm}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm space-y-4">
                        <h3 className="font-extrabold text-base flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-purple-600" /> User Profile Summary
                        </h3>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between py-1 border-b border-border/40">
                            <span className="text-muted-foreground">User ID / Record Key:</span>
                            <span className="font-bold">#{user?.id}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-border/40">
                            <span className="text-muted-foreground">Email Status:</span>
                            <span className="font-bold text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                            </span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-border/40">
                            <span className="text-muted-foreground">Account Created:</span>
                            <span className="font-bold">
                              {user?.created_at ? formatExactDateTime(user.created_at) : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-muted-foreground">Direct Custom Grants:</span>
                            <span className="font-bold">
                              {permissionsBreakdown?.direct_permissions?.length || 0} Custom Overrides
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: PROFILE & ACCOUNT DETAILS */}
                {activeTab === "profile" && (
                  <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-6">
                    <h3 className="font-black text-lg flex items-center gap-2 border-b border-border/50 pb-3">
                      <User className="w-5 h-5 text-indigo-600" /> Core Account & Identity Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
                      <div className="space-y-1">
                        <div className="text-muted-foreground font-semibold">User System ID</div>
                        <div className="font-black text-sm text-foreground">#{user?.id}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground font-semibold">Full Name</div>
                        <div className="font-black text-sm text-foreground">{user?.name}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground font-semibold">Email Address</div>
                        <div className="font-black text-sm text-foreground">{user?.email}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground font-semibold">Phone Number</div>
                        <div className="font-bold text-sm text-foreground">{user?.phone || "Not Specified"}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground font-semibold">Designated Role</div>
                        <div className="font-bold text-sm text-foreground capitalize">{user?.role}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground font-semibold">Account Status</div>
                        <div className="font-bold text-sm text-emerald-600">
                          {isFrozen ? "Frozen" : "Active & Verified"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground font-semibold">Created Timestamp</div>
                        <div className="font-medium text-foreground">
                          {user?.created_at ? formatExactDateTime(user.created_at) : "N/A"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground font-semibold">Last Updated</div>
                        <div className="font-medium text-foreground">
                          {user?.updated_at ? formatExactDateTime(user.updated_at) : "N/A"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground font-semibold">Google OAuth ID</div>
                        <div className="font-mono text-foreground">
                          {user?.google_id || "Not Linked"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: ROLE & PERMISSIONS */}
                {activeTab === "permissions" && (
                  <div className="space-y-6">
                    <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-900 dark:text-indigo-200 space-y-1">
                      <div className="font-black text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600" /> 3-Tier System Authorization Engine
                      </div>
                      <p className="text-xs leading-relaxed">
                        Effective permissions combine inherited <strong>Role Permissions</strong> and user-specific <strong>Direct Overrides</strong>. Super Admins bypass checks with root access.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm space-y-4">
                        <h4 className="font-extrabold text-sm flex items-center gap-2 border-b border-border/50 pb-2">
                          <Award className="w-4 h-4 text-purple-600" /> Role-Inherited Permissions ({permissionsBreakdown?.role_permissions?.length || 0})
                        </h4>
                        <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto">
                          {permissionsBreakdown?.role_permissions?.map((p: string) => (
                            <span
                              key={p}
                              className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm space-y-4">
                        <h4 className="font-extrabold text-sm flex items-center gap-2 border-b border-border/50 pb-2">
                          <Key className="w-4 h-4 text-emerald-600" /> Direct Custom User Permissions ({permissionsBreakdown?.direct_permissions?.length || 0})
                        </h4>
                        {permissionsBreakdown?.direct_permissions?.length ? (
                          <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto">
                            {permissionsBreakdown.direct_permissions.map((p: string) => (
                              <span
                                key={p}
                                className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground italic p-4 text-center">
                            No custom direct permission overrides assigned. Inheriting all settings from assigned role.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: USER TYPE DETAILS */}
                {activeTab === "type_details" && (
                  <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-6">
                    {typeExtra.client_details && (
                      <div className="space-y-4">
                        <h3 className="font-black text-base text-indigo-600 flex items-center gap-2">
                          <Building2 className="w-5 h-5" /> Client Portal Profile Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                            <div className="text-muted-foreground">Company Name</div>
                            <div className="font-bold text-sm mt-0.5">{typeExtra.client_details.company_name}</div>
                          </div>
                          <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                            <div className="text-muted-foreground">Client Position</div>
                            <div className="font-bold text-sm mt-0.5">{typeExtra.client_details.position}</div>
                          </div>
                          <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                            <div className="text-muted-foreground">Active Projects</div>
                            <div className="font-bold text-sm mt-0.5">{typeExtra.client_details.active_projects} / {typeExtra.client_details.total_projects}</div>
                          </div>
                          <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                            <div className="text-muted-foreground">Invoices</div>
                            <div className="font-bold text-sm mt-0.5">{typeExtra.client_details.total_invoices} Invoices ({typeExtra.client_details.unpaid_invoices} Unpaid)</div>
                          </div>
                          <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                            <div className="text-muted-foreground">Contracts</div>
                            <div className="font-bold text-sm mt-0.5">{typeExtra.client_details.total_contracts} Contracts</div>
                          </div>
                          <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                            <div className="text-muted-foreground">Support Tickets</div>
                            <div className="font-bold text-sm mt-0.5">{typeExtra.client_details.total_tickets} Tickets</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {typeExtra.employee_details && (
                      <div className="space-y-4">
                        <h3 className="font-black text-base text-purple-600 flex items-center gap-2">
                          <Briefcase className="w-5 h-5" /> Staff & Employee Profile Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                            <div className="text-muted-foreground">Department</div>
                            <div className="font-bold text-sm mt-0.5">{typeExtra.employee_details.department}</div>
                          </div>
                          <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                            <div className="text-muted-foreground">Job Title / Position</div>
                            <div className="font-bold text-sm mt-0.5">{typeExtra.employee_details.position}</div>
                          </div>
                          <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                            <div className="text-muted-foreground">Hire Date</div>
                            <div className="font-bold text-sm mt-0.5">{typeExtra.employee_details.hire_date || "N/A"}</div>
                          </div>
                          <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                            <div className="text-muted-foreground">National ID Number</div>
                            <div className="font-bold text-sm mt-0.5">{typeExtra.employee_details.id_number || "Not Registered"}</div>
                          </div>
                          <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                            <div className="text-muted-foreground">Assigned Tasks</div>
                            <div className="font-bold text-sm mt-0.5">{typeExtra.employee_details.assigned_tasks} Tasks</div>
                          </div>
                          <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                            <div className="text-muted-foreground">Assigned Tickets</div>
                            <div className="font-bold text-sm mt-0.5">{typeExtra.employee_details.assigned_tickets} Support Tickets</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {typeExtra.super_admin_details && (
                      <div className="space-y-4 p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30">
                        <h3 className="font-black text-base text-purple-700 dark:text-purple-300 flex items-center gap-2">
                          <ShieldAlert className="w-5 h-5" /> Super Admin Full Root Capabilities
                        </h3>
                        <p className="text-xs leading-relaxed">
                          This user holds the highest system rank with unrestricted execution privileges across all database models, user management modules, finance tools, and system settings.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 5: SECURITY & AUTH */}
                {activeTab === "security" && (
                  <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-6 text-xs">
                    <h3 className="font-black text-base flex items-center gap-2 border-b border-border/50 pb-3">
                      <Lock className="w-5 h-5 text-indigo-600" /> Account Security & Session Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-2">
                        <div className="font-bold text-foreground">Authentication Method</div>
                        <div className="text-muted-foreground">
                          Primary login method: <strong>{security?.auth_method}</strong>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-2">
                        <div className="font-bold text-foreground">Active API Tokens / Sessions</div>
                        <div className="text-muted-foreground">
                          Active Sanctum tokens: <strong>{security?.active_sessions || 0} Active</strong>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-2">
                        <div className="font-bold text-foreground">Two-Factor Authentication (2FA)</div>
                        <div className="text-muted-foreground">Status: <strong>Disabled</strong></div>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-2">
                        <div className="font-bold text-foreground">Password Status</div>
                        <div className="text-muted-foreground">
                          Password setup: <strong>{security?.has_password ? "Configured & Hashed" : "Not Set"}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 6: SERVER-SIDE SEARCHABLE & FILTERABLE ACTIVITY LOG */}
                {activeTab === "activity" && (
                  <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
                      <div>
                        <h3 className="font-black text-base flex items-center gap-2 text-foreground">
                          <Activity className="w-5 h-5 text-indigo-600" /> Audit Trail & User Activity History
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          High-value auditable actions recorded across user lifecycle (Server-side paginated & searchable).
                        </p>
                      </div>

                      <Badge variant="outline" className="text-xs font-bold px-3 py-1 w-fit">
                        {logsTotal} Total Events Recorded
                      </Badge>
                    </div>

                    {/* ── Search & Filter Control Panel ── */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-2xl bg-muted/30 border border-border/50">
                      {/* Search Input */}
                      <div className="md:col-span-4 relative">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Instant search activities, target, actor..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setLogsPage(1);
                          }}
                          className="pl-9 h-9 text-xs rounded-xl border-border/60 bg-background"
                        />
                      </div>

                      {/* Category Filter */}
                      <div className="md:col-span-3">
                        <select
                          value={categoryFilter}
                          onChange={(e) => {
                            setCategoryFilter(e.target.value);
                            setLogsPage(1);
                          }}
                          className="w-full h-9 px-3 text-xs rounded-xl border border-border/60 bg-background text-foreground font-medium"
                        >
                          <option value="all">All Category Types</option>
                          <option value="auth">Authentication & Login</option>
                          <option value="security">Security & Account Freeze</option>
                          <option value="admin">Administrative Actions</option>
                          <option value="crud">Record Operations (CRUD)</option>
                          <option value="file">File Operations</option>
                          <option value="profile">Profile & Credentials</option>
                        </select>
                      </div>

                      {/* Date Range: From */}
                      <div className="md:col-span-2">
                        <Input
                          type="datetime-local"
                          value={fromDate}
                          onChange={(e) => {
                            setFromDate(e.target.value);
                            setLogsPage(1);
                          }}
                          className="h-9 text-[11px] rounded-xl border-border/60 bg-background"
                        />
                      </div>

                      {/* Date Range: To */}
                      <div className="md:col-span-2">
                        <Input
                          type="datetime-local"
                          value={toDate}
                          onChange={(e) => {
                            setToDate(e.target.value);
                            setLogsPage(1);
                          }}
                          className="h-9 text-[11px] rounded-xl border-border/60 bg-background"
                        />
                      </div>

                      {/* Reset Filters */}
                      <div className="md:col-span-1 flex items-center justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleClearFilters}
                          className="h-9 text-xs text-muted-foreground hover:text-foreground font-bold px-2 rounded-xl"
                          title="Reset Search & Date Filters"
                        >
                          Clear
                        </Button>
                      </div>
                    </div>

                    {/* Activity List Container */}
                    {logsLoading ? (
                      <div className="p-12 text-center text-xs text-muted-foreground font-semibold">
                        Querying database activity logs...
                      </div>
                    ) : activityLogs.length === 0 ? (
                      <div className="p-8 text-center text-xs text-muted-foreground border border-dashed rounded-2xl space-y-1">
                        <Info className="w-5 h-5 mx-auto text-muted-foreground/60" />
                        <div>No activity logs matched your current search or date range filters.</div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {activityLogs.map((log: any) => (
                          <div
                            key={log.id}
                            onClick={() => setSelectedActivity(log)}
                            className="group flex flex-col sm:flex-row items-start justify-between gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 text-xs shadow-xs hover:border-indigo-500/40 hover:bg-muted/60 transition-all cursor-pointer"
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-extrabold text-sm text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  {log.action}
                                </span>

                                {log.category && (
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
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
                                <p className="text-muted-foreground leading-relaxed pt-1">
                                  {log.description}
                                </p>
                              )}

                              <div className="text-[11px] text-muted-foreground pt-1 flex items-center gap-2 flex-wrap">
                                <span>
                                  Performed By: <strong className="text-foreground">{log.causer_name || "System"}</strong> ({log.causer_role || "Role"})
                                </span>
                                {log.ip_address && (
                                  <>
                                    <span>•</span>
                                    <span className="font-mono">IP: {log.ip_address}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="shrink-0 self-center opacity-70 group-hover:opacity-100 transition-opacity">
                              <Button size="sm" variant="ghost" className="h-8 text-xs font-bold rounded-xl gap-1">
                                <Eye className="w-3.5 h-3.5 text-indigo-600" /> Details
                              </Button>
                            </div>
                          </div>
                        ))}

                        {/* Server-Side Pagination Bar */}
                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                          <div className="text-xs text-muted-foreground font-semibold">
                            Page <span className="text-foreground font-bold">{logsPage}</span> of{" "}
                            <span className="text-foreground font-bold">{logsLastPage}</span> ({logsTotal} Matching Logs)
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
                  </div>
                )}
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-card border-t border-border/60 flex justify-end shrink-0">
            <Button onClick={onClose} variant="outline" className="font-bold rounded-xl">
              Close Details
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Sub-Modal: Deep Activity Details & Before/After Diff Inspector ── */}
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
                    <FileText className="w-4 h-4" /> Before / After Execution Payload
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
