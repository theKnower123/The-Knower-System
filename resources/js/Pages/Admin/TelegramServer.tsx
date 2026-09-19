import React, { useState, useEffect, useRef } from "react";
import { Head, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "sonner";
import {
  Bot,
  Send,
  RefreshCw,
  Radio,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Users,
  Briefcase,
  Code2,
  Building,
  RotateCcw,
  Search,
  Check,
  AlertTriangle,
  RotateCw,
  UserX,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock,
  Layers,
  FileText,
  Clock,
  KeyRound,
  FolderKanban,
  Receipt,
  LifeBuoy,
  ShieldAlert,
  Loader2,
  Bell,
  HelpCircle,
  GraduationCap,
  MessageSquare,
  Calendar,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BotStatus {
  connected: boolean;
  latency_ms: number | null;
  error: string | null;
  bot_username: string;
  bot_name: string;
  bot_id: string;
  token_scope: string;
}

interface StatGroup {
  linked: number;
  total: number;
  percentage: number;
}

interface Props {
  bot_status: BotStatus;
  stats: {
    total: StatGroup;
    clients: StatGroup;
    team: StatGroup;
    management: StatGroup;
  };
  counts: {
    logs: number;
    linked_accounts: number;
    templates_user: number;
    templates_admin: number;
    security_events: number;
  };
  admin_account: {
    is_linked: boolean;
    telegram_username?: string;
    telegram_chat_id?: string;
  };
  template_types: string[];
}

export default function TelegramServer({
  bot_status: initialBotStatus,
  stats,
  counts: initialCounts,
  admin_account: initialAdminAccount,
  template_types = [],
}: Props) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  // Bot Connection State
  const [botStatus, setBotStatus] = useState<BotStatus>(initialBotStatus);
  const [pinging, setPinging] = useState(false);
  const [syncingWebhook, setSyncingWebhook] = useState(false);

  // Tab Counts
  const [counts, setCounts] = useState(initialCounts);

  // Active Tab
  const [activeTab, setActiveTab] = useState("logs");

  // ─── TAB 1: Delivery Logs ───
  const [logs, setLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsPage, setLogsPage] = useState(1);
  const [logsTotalPages, setLogsTotalPages] = useState(1);
  const [logsTotal, setLogsTotal] = useState(0);
  const [logsFrom, setLogsFrom] = useState(0);
  const [logsTo, setLogsTo] = useState(0);
  const [logStatusFilter, setLogStatusFilter] = useState("all");
  const [logTypeFilter, setLogTypeFilter] = useState("all");
  const [logSearch, setLogSearch] = useState("");
  const [retryingLogId, setRetryingLogId] = useState<number | null>(null);

  const fetchLogs = async (page = 1) => {
    setLogsLoading(true);
    try {
      const res = await axios.get("/admin/telegram-server/logs", {
        params: {
          page,
          status: logStatusFilter,
          type: logTypeFilter,
          search: logSearch,
        },
      });
      const d = res.data.data;
      setLogs(d.data || []);
      setLogsPage(d.current_page || 1);
      setLogsTotalPages(d.last_page || 1);
      setLogsTotal(d.total || 0);
      setLogsFrom(d.from || 0);
      setLogsTo(d.to || 0);
      setCounts((prev) => ({ ...prev, logs: d.total || 0 }));
    } catch {
      toast.error(t("telegram.logs.fetchError", "Failed to load delivery logs."));
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "logs") {
      fetchLogs(1);
    }
  }, [activeTab, logStatusFilter, logTypeFilter, logSearch]);

  const handleRetryLog = async (id: number) => {
    setRetryingLogId(id);
    try {
      const res = await axios.post(`/admin/telegram-server/logs/${id}/retry`);
      if (res.data.ok) {
        toast.success(t("telegram.logs.retrySuccess", "Message successfully resent!"));
        fetchLogs(logsPage);
      } else {
        toast.error(res.data.error || t("telegram.logs.retryFailed", "Retry failed."));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || t("telegram.logs.retryFailed", "Retry failed."));
    } finally {
      setRetryingLogId(null);
    }
  };

  // ─── TAB 2: Linked Accounts ───
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsPage, setAccountsPage] = useState(1);
  const [accountsTotalPages, setAccountsTotalPages] = useState(1);
  const [accountsTotal, setAccountsTotal] = useState(0);
  const [accountRoleFilter, setAccountRoleFilter] = useState("all");
  const [accountSearch, setAccountSearch] = useState("");
  const [disconnectingUser, setDisconnectingUser] = useState<any | null>(null);

  const fetchAccounts = async (page = 1) => {
    setAccountsLoading(true);
    try {
      const res = await axios.get("/admin/telegram-server/linked-accounts", {
        params: {
          page,
          role: accountRoleFilter,
          search: accountSearch,
        },
      });
      const d = res.data.data;
      setAccounts(d.data || []);
      setAccountsPage(d.current_page || 1);
      setAccountsTotalPages(d.last_page || 1);
      setAccountsTotal(d.total || 0);
      setCounts((prev) => ({ ...prev, linked_accounts: d.total || 0 }));
    } catch {
      toast.error(t("telegram.accounts.fetchError", "Failed to load linked accounts."));
    } finally {
      setAccountsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "accounts") {
      fetchAccounts(1);
    }
  }, [activeTab, accountRoleFilter, accountSearch]);

  const handleDisconnectConfirm = async () => {
    if (!disconnectingUser) return;
    try {
      const res = await axios.post(`/admin/telegram-server/users/${disconnectingUser.id}/disconnect`);
      toast.success(res.data?.message || t("telegram.accounts.disconnectSuccess", "Account unlinked."));
      setDisconnectingUser(null);
      fetchAccounts(accountsPage);
    } catch (err: any) {
      toast.error(err.response?.data?.message || t("telegram.accounts.disconnectError", "Failed to unlink account."));
    }
  };

  // ─── TAB 3: Templates ───
  const [templates, setTemplates] = useState<any[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templateCategory, setTemplateCategory] = useState<"user" | "admin">("user");
  const [templateSearch, setTemplateSearch] = useState("");
  const [expandedTemplateId, setExpandedTemplateId] = useState<number | null>(null);
  const [templateEdits, setTemplateEdits] = useState<Record<number, { body_ar: string; isDirty: boolean; saved: boolean }>>({});
  const textareaRefs = useRef<Record<number, HTMLTextAreaElement | null>>({});

  const fetchTemplates = async () => {
    setTemplatesLoading(true);
    try {
      const res = await axios.get("/admin/telegram-server/templates", {
        params: {
          category: templateCategory,
          search: templateSearch,
        },
      });
      const tList = res.data.data || [];
      setTemplates(tList);
      // Initialize edit state
      const edits: Record<number, any> = {};
      tList.forEach((tItem: any) => {
        edits[tItem.id] = {
          body_ar: tItem.body_ar || "",
          isDirty: false,
          saved: false,
        };
      });
      setTemplateEdits(edits);
    } catch {
      toast.error(t("telegram.templates.fetchError", "Failed to load templates."));
    } finally {
      setTemplatesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "templates") {
      fetchTemplates();
    }
  }, [activeTab, templateCategory, templateSearch]);

  const handleTemplateChange = (id: number, val: string) => {
    setTemplateEdits((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        body_ar: val,
        isDirty: true,
        saved: false,
      },
    }));
  };

  const insertVariable = (templateId: number, varName: string) => {
    const el = textareaRefs.current[templateId];
    const currentVal = templateEdits[templateId]?.body_ar ?? "";

    if (el) {
      const start = el.selectionStart ?? currentVal.length;
      const end = el.selectionEnd ?? currentVal.length;
      const placeholder = `{{${varName}}}`;
      const newVal = currentVal.substring(0, start) + placeholder + currentVal.substring(end);
      handleTemplateChange(templateId, newVal);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + placeholder.length, start + placeholder.length);
      }, 50);
    } else {
      handleTemplateChange(templateId, currentVal + ` {{${varName}}}`);
    }
  };

  const handleSaveTemplate = async (id: number) => {
    const edit = templateEdits[id];
    if (!edit || !edit.isDirty) return;

    try {
      await axios.put(`/admin/telegram-server/templates/${id}`, {
        body_ar: edit.body_ar,
      });

      setTemplateEdits((prev) => ({
        ...prev,
        [id]: { ...prev[id], isDirty: false, saved: true },
      }));

      toast.success(t("telegram.templates.saveSuccess", "Template saved successfully!"));
      setTimeout(() => {
        setTemplateEdits((prev) => ({
          ...prev,
          [id]: { ...prev[id], saved: false },
        }));
      }, 2500);
    } catch {
      toast.error(t("telegram.templates.saveError", "Failed to save template."));
    }
  };

  const handleRestoreTemplateDefault = async (id: number) => {
    try {
      const res = await axios.post(`/admin/telegram-server/templates/${id}/restore`);
      const restored = res.data.data;
      setTemplateEdits((prev) => ({
        ...prev,
        [id]: {
          body_ar: restored.body_ar || "",
          isDirty: false,
          saved: false,
        },
      }));
      toast.success(t("telegram.templates.restoreSuccess", "Template restored to original default!"));
      fetchTemplates();
    } catch {
      toast.error(t("telegram.templates.restoreError", "Failed to restore template."));
    }
  };

  // ─── TAB 4: Test Tool ───
  const [testMessage, setTestMessage] = useState(
    "🚀 *[The Knower OS] Telegram Bot Test Alert*\n\nHello! This is a live test notification from your Telegram Server Control Panel.\nConnectivity is verified and fully operational! ✨"
  );
  const [sendingTest, setSendingTest] = useState(false);

  const handleSendTestAlert = async () => {
    setSendingTest(true);
    try {
      const res = await axios.post("/admin/telegram-server/test-alert", {
        message: testMessage,
      });
      toast.success(res.data?.message || t("telegram.test.sent", "Test alert dispatched!"));
    } catch (err: any) {
      toast.error(err.response?.data?.message || t("telegram.test.error", "Failed to send test alert."));
    } finally {
      setSendingTest(false);
    }
  };

  // ─── TAB 5: Security Events ───
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  const [secLoading, setSecLoading] = useState(false);
  const [secPage, setSecPage] = useState(1);
  const [secTotalPages, setSecTotalPages] = useState(1);
  const [secTotal, setSecTotal] = useState(0);
  const [secStatusFilter, setSecStatusFilter] = useState("all");
  const [secEventFilter, setSecEventFilter] = useState("all");
  const [secSearch, setSecSearch] = useState("");

  const fetchSecurityEvents = async (page = 1) => {
    setSecLoading(true);
    try {
      const res = await axios.get("/admin/telegram-server/security-events", {
        params: {
          page,
          status: secStatusFilter,
          event_type: secEventFilter,
          search: secSearch,
        },
      });
      const d = res.data.data;
      setSecurityEvents(d.data || []);
      setSecPage(d.current_page || 1);
      setSecTotalPages(d.last_page || 1);
      setSecTotal(d.total || 0);
      setCounts((prev) => ({ ...prev, security_events: d.total || 0 }));
    } catch {
      toast.error(t("telegram.security.fetchError", "Failed to load security audit log."));
    } finally {
      setSecLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "security") {
      fetchSecurityEvents(1);
    }
  }, [activeTab, secStatusFilter, secEventFilter, secSearch]);

  // ─── Actions: Ping & Sync Webhook ───
  const handlePing = async () => {
    setPinging(true);
    try {
      const res = await axios.get("/admin/telegram-server/ping");
      setBotStatus((prev) => ({
        ...prev,
        connected: res.data.connected,
        latency_ms: res.data.latency_ms,
        error: res.data.error,
        bot_username: res.data.bot?.username || prev.bot_username,
        bot_name: res.data.bot?.first_name || prev.bot_name,
        bot_id: res.data.bot?.id ? String(res.data.bot.id) : prev.bot_id,
      }));

      if (res.data.connected) {
        toast.success(
          t("telegram.ping.success", `Bot API reachable (${res.data.latency_ms} ms latency)`)
        );
      } else {
        toast.error(res.data.error || t("telegram.ping.failed", "Bot API is disconnected."));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || t("telegram.ping.failed", "Bot API ping error."));
    } finally {
      setPinging(false);
    }
  };

  const handleSyncWebhook = async () => {
    setSyncingWebhook(true);
    try {
      const res = await axios.post("/admin/telegram-server/sync-webhook");
      if (res.data.ok) {
        toast.success(res.data.message || t("telegram.webhook.success", "Webhook synced successfully!"));
      } else {
        toast.error(res.data.message || t("telegram.webhook.failed", "Failed to sync webhook."));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || t("telegram.webhook.failed", "Webhook sync failed."));
    } finally {
      setSyncingWebhook(false);
    }
  };

  const getTemplateIcon = (key: string) => {
    if (key.includes("graduation")) return <GraduationCap className="h-4 w-4 text-emerald-600" />;
    if (key.includes("contact") || key.includes("inquiry")) return <MessageSquare className="h-4 w-4 text-blue-500" />;
    if (key.includes("demo")) return <Calendar className="h-4 w-4 text-purple-500" />;
    if (key.includes("job")) return <Briefcase className="h-4 w-4 text-amber-600" />;
    if (key.includes("user") || key.includes("client")) return <UserPlus className="h-4 w-4 text-teal-500" />;
    if (key.includes("task")) return <Check className="h-4 w-4 text-emerald-500" />;
    if (key.includes("invoice") || key.includes("payment")) return <Receipt className="h-4 w-4 text-amber-500" />;
    if (key.includes("project")) return <FolderKanban className="h-4 w-4 text-sky-500" />;
    if (key.includes("password")) return <KeyRound className="h-4 w-4 text-rose-500" />;
    if (key.includes("ticket")) return <LifeBuoy className="h-4 w-4 text-violet-500" />;
    if (key.includes("timesheet")) return <Clock className="h-4 w-4 text-indigo-500" />;
    if (key.includes("test") || key.includes("connection")) return <Sparkles className="h-4 w-4 text-pink-500" />;
    return <Bell className="h-4 w-4 text-primary" />;
  };

  return (
    <TooltipProvider>
      <Head title={t("telegram.pageTitle", "Telegram Server Control")} />

      <div className="space-y-6 pb-12">
        {/* ========================================================================= */}
        {/* 1. PAGE HEADER */}
        {/* ========================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  {t("telegram.header.title", "Telegram Server Control")}
                </h1>
                {botStatus.bot_username && (
                  <Badge variant="secondary" className="font-mono text-xs px-2 py-0.5 font-semibold">
                    @{botStatus.bot_username}
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                {t(
                  "telegram.header.subtitle",
                  "Monitor Bot API status, manage linked accounts, and inspect real-time delivery logs."
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              onClick={handlePing}
              disabled={pinging}
              className="gap-2 shadow-xs"
            >
              {pinging ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              )}
              <span>{t("telegram.actions.ping", "Ping Bot API")}</span>
            </Button>

            <Button
              variant="default"
              onClick={handleSyncWebhook}
              disabled={syncingWebhook}
              className="gap-2 shadow-xs"
            >
              {syncingWebhook ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Radio className="h-4 w-4" />
              )}
              <span>{t("telegram.actions.syncWebhook", "Sync Webhook")}</span>
            </Button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. CONNECTION STATUS PANEL */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {botStatus.connected ? (
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                  <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 px-2.5 py-0.5 font-semibold text-xs">
                    {t("telegram.status.operational", "Operational & Connected")}
                  </Badge>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="inline-flex rounded-full h-3 w-3 bg-destructive" />
                  <Badge variant="destructive" className="px-2.5 py-0.5 font-semibold text-xs">
                    {t("telegram.status.disconnected", "Disconnected")}
                  </Badge>
                </div>
              )}
            </div>

            <Badge variant="outline" className="font-mono text-xs px-2.5 py-1 text-muted-foreground">
              {t("telegram.status.latency", "Latency")}:{" "}
              <strong className="text-foreground ml-1">
                {botStatus.latency_ms !== null ? `${botStatus.latency_ms} ms` : "---"}
              </strong>
            </Badge>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            {t(
              "telegram.status.description",
              "Live ping verification against Telegram Bot API servers using the secure server-side token."
            )}
          </p>

          {/* 4-column Grid Info Cards */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Info Card 1: Bot Username */}
            <div className="rounded-lg border border-border/60 bg-muted/40 p-3.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground block">
                {t("telegram.info.botUsername", "Bot Username")}
              </span>
              <div className="mt-1 flex items-center justify-between">
                {botStatus.bot_username ? (
                  <a
                    href={`https://t.me/${botStatus.bot_username}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-primary hover:underline text-sm flex items-center gap-1.5 truncate"
                  >
                    @{botStatus.bot_username}
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground font-semibold">---</span>
                )}
              </div>
            </div>

            {/* Info Card 2: Bot Display Name */}
            <div className="rounded-lg border border-border/60 bg-muted/40 p-3.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground block">
                {t("telegram.info.botDisplayName", "Bot Display Name")}
              </span>
              <p className="mt-1 text-sm font-semibold text-foreground truncate">
                {botStatus.bot_name || "The Knower Bot"}
              </p>
            </div>

            {/* Info Card 3: Telegram Bot ID */}
            <div className="rounded-lg border border-border/60 bg-muted/40 p-3.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground block">
                {t("telegram.info.botId", "Telegram Bot ID")}
              </span>
              <p className="mt-1 text-sm font-mono font-semibold text-foreground truncate">
                {botStatus.bot_id || "---"}
              </p>
            </div>

            {/* Info Card 4: Token Scope */}
            <div className="rounded-lg border border-border/60 bg-muted/40 p-3.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground block">
                {t("telegram.info.tokenScope", "Token Scope")}
              </span>
              <p className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 truncate">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>{t("telegram.info.serverSideSecret", "Server-Side Secret")}</span>
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. STAT CARDS ROW */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Linked Users */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {stats.total.percentage}%
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="font-display text-2xl font-bold text-foreground">
                  {stats.total.linked}
                </span>
                <span className="text-xs text-muted-foreground">
                  / {stats.total.total} ({stats.total.percentage}%)
                </span>
              </div>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("telegram.stats.totalLinked", "Total Linked Users")}
              </p>
            </div>
            <div className="mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, stats.total.percentage)}%` }}
              />
            </div>
          </div>

          {/* Card 2: Clients */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10 text-sky-500">
                  <Briefcase className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-sky-600 dark:text-sky-400">
                  {stats.clients.percentage}%
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="font-display text-2xl font-bold text-foreground">
                  {stats.clients.linked}
                </span>
                <span className="text-xs text-muted-foreground">
                  / {stats.clients.total} ({stats.clients.percentage}%)
                </span>
              </div>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("telegram.stats.clients", "Clients")}
              </p>
            </div>
            <div className="mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, stats.clients.percentage)}%` }}
              />
            </div>
          </div>

          {/* Card 3: Team */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/10 text-violet-500">
                  <Code2 className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-violet-600 dark:text-violet-400">
                  {stats.team.percentage}%
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="font-display text-2xl font-bold text-foreground">
                  {stats.team.linked}
                </span>
                <span className="text-xs text-muted-foreground">
                  / {stats.team.total} ({stats.team.percentage}%)
                </span>
              </div>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("telegram.stats.team", "Team (Dev & Delivery)")}
              </p>
            </div>
            <div className="mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, stats.team.percentage)}%` }}
              />
            </div>
          </div>

          {/* Card 4: Management */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <Building className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {stats.management.percentage}%
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="font-display text-2xl font-bold text-foreground">
                  {stats.management.linked}
                </span>
                <span className="text-xs text-muted-foreground">
                  / {stats.management.total} ({stats.management.percentage}%)
                </span>
              </div>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("telegram.stats.management", "Management & Ops")}
              </p>
            </div>
            <div className="mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, stats.management.percentage)}%` }}
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. TABS SECTION */}
        {/* ========================================================================= */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted/60 p-1 rounded-xl flex-wrap h-auto gap-1">
            <TabsTrigger value="logs" className="gap-2 rounded-lg data-[state=active]:bg-card shadow-xs">
              <Radio className="h-4 w-4" />
              <span>{t("telegram.tabs.deliveryLogs", "Delivery Logs")}</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                {counts.logs}
              </Badge>
            </TabsTrigger>

            <TabsTrigger value="accounts" className="gap-2 rounded-lg data-[state=active]:bg-card shadow-xs">
              <Users className="h-4 w-4" />
              <span>{t("telegram.tabs.linkedAccounts", "Linked Accounts")}</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                {counts.linked_accounts}
              </Badge>
            </TabsTrigger>

            <TabsTrigger value="templates" className="gap-2 rounded-lg data-[state=active]:bg-card shadow-xs">
              <FileText className="h-4 w-4" />
              <span>{t("telegram.tabs.templates", "Templates")}</span>
            </TabsTrigger>

            <TabsTrigger value="test" className="gap-2 rounded-lg data-[state=active]:bg-card shadow-xs">
              <Sparkles className="h-4 w-4" />
              <span>{t("telegram.tabs.testTool", "Test Tool")}</span>
            </TabsTrigger>

            <TabsTrigger value="security" className="gap-2 rounded-lg data-[state=active]:bg-card shadow-xs">
              <ShieldAlert className="h-4 w-4" />
              <span>{t("telegram.tabs.security", "Security")}</span>
              {counts.security_events > 0 && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-mono">
                  {counts.security_events}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 1: DELIVERY LOGS */}
          {/* ───────────────────────────────────────────────────────────── */}
          <TabsContent value="logs" className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3.5 shadow-xs">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Status Filter */}
                <Select value={logStatusFilter} onValueChange={setLogStatusFilter}>
                  <SelectTrigger className="w-[130px] h-9 text-xs">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("telegram.filters.allStatus", "All Status")}</SelectItem>
                    <SelectItem value="sent">{t("telegram.status.sent", "Sent")}</SelectItem>
                    <SelectItem value="failed">{t("telegram.status.failed", "Failed")}</SelectItem>
                    <SelectItem value="pending">{t("telegram.status.pending", "Pending")}</SelectItem>
                  </SelectContent>
                </Select>

                {/* Type Filter */}
                <Select value={logTypeFilter} onValueChange={setLogTypeFilter}>
                  <SelectTrigger className="w-[160px] h-9 text-xs font-mono">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("telegram.filters.allTypes", "All Types")}</SelectItem>
                    {template_types.map((typeKey) => (
                      <SelectItem key={typeKey} value={typeKey} className="font-mono text-xs">
                        {typeKey}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("telegram.logs.searchPlaceholder", "Search logs...")}
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    className="pl-8 h-9 text-xs"
                  />
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  onClick={() => fetchLogs(logsPage)}
                  disabled={logsLoading}
                >
                  <RotateCw className={`h-4 w-4 ${logsLoading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Logs Table / Mobile Cards */}
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
              {logsLoading ? (
                <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-7 w-7 animate-spin text-primary" />
                  <span className="text-xs">{t("common.loading", "Loading logs...")}</span>
                </div>
              ) : logs.length === 0 ? (
                /* Empty state */
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-3">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">
                    {t("telegram.logs.emptyTitle", "No notification logs found.")}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                    {t(
                      "telegram.logs.emptySubtitle",
                      "All messages, notifications, and alert attempts dispatched via the bot will appear here."
                    )}
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-muted/40 border-b border-border text-muted-foreground font-medium uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3 px-4">{t("telegram.table.status", "Status")}</th>
                          <th className="py-3 px-4">{t("telegram.table.type", "Type")}</th>
                          <th className="py-3 px-4">{t("telegram.table.recipient", "Recipient")}</th>
                          <th className="py-3 px-4">{t("telegram.table.preview", "Message Preview")}</th>
                          <th className="py-3 px-4">{t("telegram.table.date", "Date & Time")}</th>
                          <th className="py-3 px-4 text-right">{t("telegram.table.action", "Action")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {logs.map((log) => (
                          <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                            <td className="py-3 px-4 whitespace-nowrap">
                              {log.status === "sent" ? (
                                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                                  {t("telegram.status.sent", "Sent")}
                                </Badge>
                              ) : log.status === "failed" ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge variant="destructive" className="text-[10px] font-semibold cursor-help">
                                      {t("telegram.status.failed", "Failed")}
                                    </Badge>
                                  </TooltipTrigger>
                                  {log.error_message && (
                                    <TooltipContent className="max-w-xs text-xs">
                                      {log.error_message}
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                              ) : (
                                <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-semibold">
                                  {t("telegram.status.pending", "Pending")}
                                </Badge>
                              )}
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap">
                              <Badge variant="secondary" className="font-mono text-[10px]">
                                {log.type}
                              </Badge>
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap">
                              <div>
                                <span className="font-medium text-foreground block">
                                  {log.user?.name || log.chat_id}
                                </span>
                                {log.user?.email && (
                                  <span className="text-[10px] text-muted-foreground">
                                    {log.user.email}
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3 px-4 max-w-xs">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <p className="truncate text-foreground/80 font-mono text-[11px] cursor-pointer">
                                    {log.preview_text}
                                  </p>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-md whitespace-pre-wrap text-xs font-mono">
                                  {log.preview_text}
                                </TooltipContent>
                              </Tooltip>
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap text-muted-foreground">
                              <span title={log.created_at}>{log.created_at}</span>
                            </td>

                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              {log.status === "failed" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRetryLog(log.id)}
                                  disabled={retryingLogId === log.id}
                                  className="h-7 px-2 text-[11px] gap-1"
                                >
                                  {retryingLogId === log.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <RotateCcw className="h-3 w-3" />
                                  )}
                                  <span>{t("telegram.actions.retry", "Retry")}</span>
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Stacked Card View */}
                  <div className="block md:hidden divide-y divide-border">
                    {logs.map((log) => (
                      <div key={log.id} className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="font-mono text-[10px]">
                            {log.type}
                          </Badge>
                          {log.status === "sent" ? (
                            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px]">
                              {t("telegram.status.sent", "Sent")}
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-[10px]">
                              {t("telegram.status.failed", "Failed")}
                            </Badge>
                          )}
                        </div>

                        <div>
                          <span className="text-xs font-semibold text-foreground">
                            {log.user?.name || log.chat_id}
                          </span>
                          <p className="text-[11px] text-muted-foreground font-mono mt-1 line-clamp-2">
                            {log.preview_text}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground border-t border-border/50">
                          <span>{log.created_at}</span>
                          {log.status === "failed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRetryLog(log.id)}
                              disabled={retryingLogId === log.id}
                              className="h-6 px-2 text-[10px] gap-1"
                            >
                              <RotateCcw className="h-3 w-3" />
                              <span>{t("telegram.actions.retry", "Retry")}</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Pagination Footer */}
              {logs.length > 0 && (
                <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20 text-xs">
                  <span className="text-muted-foreground">
                    {t("common.showing", "Showing")} <strong>{logsFrom}</strong> -{" "}
                    <strong>{logsTo}</strong> of <strong>{logsTotal}</strong>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchLogs(logsPage - 1)}
                      disabled={logsPage <= 1 || logsLoading}
                      className="h-7 text-xs"
                    >
                      {t("common.previous", "Previous")}
                    </Button>
                    <span className="px-2 text-muted-foreground font-mono">
                      {logsPage} / {logsTotalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchLogs(logsPage + 1)}
                      disabled={logsPage >= logsTotalPages || logsLoading}
                      className="h-7 text-xs"
                    >
                      {t("common.next", "Next")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 2: LINKED ACCOUNTS */}
          {/* ───────────────────────────────────────────────────────────── */}
          <TabsContent value="accounts" className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3.5 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Select value={accountRoleFilter} onValueChange={setAccountRoleFilter}>
                  <SelectTrigger className="w-[140px] h-9 text-xs">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("telegram.filters.allRoles", "All Roles")}</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="administrator">Administrator</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="qa">QA</SelectItem>
                    <SelectItem value="project_manager">Project Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("telegram.accounts.searchPlaceholder", "Search user or @username...")}
                    value={accountSearch}
                    onChange={(e) => setAccountSearch(e.target.value)}
                    className="pl-8 h-9 text-xs"
                  />
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  onClick={() => fetchAccounts(accountsPage)}
                  disabled={accountsLoading}
                >
                  <RotateCw className={`h-4 w-4 ${accountsLoading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Accounts Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
              {accountsLoading ? (
                <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-7 w-7 animate-spin text-primary" />
                  <span className="text-xs">{t("common.loading", "Loading linked accounts...")}</span>
                </div>
              ) : accounts.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
                    <UserX className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">
                    {t("telegram.accounts.emptyTitle", "No linked accounts yet.")}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                    {t(
                      "telegram.accounts.emptySubtitle",
                      "Users who link their Telegram account through the bot will appear here."
                    )}
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-muted/40 border-b border-border text-muted-foreground font-medium uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3 px-4">{t("telegram.table.user", "User")}</th>
                          <th className="py-3 px-4">{t("telegram.table.role", "Role")}</th>
                          <th className="py-3 px-4">{t("telegram.table.profile", "Telegram Profile")}</th>
                          <th className="py-3 px-4">{t("telegram.table.chatId", "Chat ID")}</th>
                          <th className="py-3 px-4">{t("telegram.table.linkedDate", "Linked Date")}</th>
                          <th className="py-3 px-4 text-right">{t("telegram.table.action", "Action")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {accounts.map((acc) => (
                          <tr key={acc.id} className="hover:bg-muted/20 transition-colors">
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-2.5">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={acc.avatar_url || acc.avatar} />
                                  <AvatarFallback className="text-xs uppercase bg-primary/10 text-primary">
                                    {acc.name?.slice(0, 2) || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <span className="font-semibold text-foreground block">{acc.name}</span>
                                  <span className="text-[11px] text-muted-foreground">{acc.email}</span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap">
                              <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                                {acc.role}
                              </Badge>
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap">
                              {acc.telegram_username ? (
                                <a
                                  href={`https://t.me/${acc.telegram_username}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-primary hover:underline font-semibold flex items-center gap-1.5"
                                >
                                  <Send className="h-3 w-3 text-sky-500" />
                                  <span>@{acc.telegram_username}</span>
                                </a>
                              ) : (
                                <span className="text-muted-foreground flex items-center gap-1">
                                  <Bot className="h-3 w-3" />
                                  <span>Linked Chat</span>
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap font-mono text-muted-foreground">
                              {acc.telegram_chat_id}
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap text-muted-foreground">
                              {acc.telegram_linked_at || "---"}
                            </td>

                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDisconnectingUser(acc)}
                                className="h-7 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                              >
                                {t("telegram.actions.disconnect", "Disconnect")}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Stacked Card View */}
                  <div className="block md:hidden divide-y divide-border">
                    {accounts.map((acc) => (
                      <div key={acc.id} className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground text-xs">{acc.name}</span>
                          <Badge variant="outline" className="text-[10px] uppercase">
                            {acc.role}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{acc.email}</p>

                        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                          {acc.telegram_username ? (
                            <a
                              href={`https://t.me/${acc.telegram_username}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary font-semibold flex items-center gap-1"
                            >
                              <Send className="h-3 w-3 text-sky-500" />
                              <span>@{acc.telegram_username}</span>
                            </a>
                          ) : (
                            <span className="font-mono text-muted-foreground text-[11px]">
                              {acc.telegram_chat_id}
                            </span>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDisconnectingUser(acc)}
                            className="h-6 px-2 text-[11px] text-destructive hover:bg-destructive/10"
                          >
                            {t("telegram.actions.disconnect", "Disconnect")}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 3: TEMPLATES */}
          {/* ───────────────────────────────────────────────────────────── */}
          <TabsContent value="templates" className="space-y-4">
            {/* Filter Pills & Search */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3.5 shadow-xs">
              <div className="flex items-center gap-2">
                <Button
                  variant={templateCategory === "user" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTemplateCategory("user")}
                  className="h-8 text-xs gap-1.5"
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>{t("telegram.templates.userGroup", "User Notifications")}</span>
                  <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                    {counts.templates_user}
                  </Badge>
                </Button>

                <Button
                  variant={templateCategory === "admin" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTemplateCategory("admin")}
                  className="h-8 text-xs gap-1.5"
                >
                  <Building className="h-3.5 w-3.5" />
                  <span>{t("telegram.templates.adminGroup", "Admin & Management Messages")}</span>
                  <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                    {counts.templates_admin}
                  </Badge>
                </Button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("telegram.templates.searchPlaceholder", "Search templates...")}
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  className="pl-8 h-9 text-xs"
                />
              </div>
            </div>

            {/* Template Accordion List */}
            <div className="space-y-3">
              {templatesLoading ? (
                <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-7 w-7 animate-spin text-primary" />
                  <span className="text-xs">{t("common.loading", "Loading templates...")}</span>
                </div>
              ) : templates.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
                  {t("telegram.templates.noTemplates", "No templates found.")}
                </div>
              ) : (
                templates.map((tpl) => {
                  const isExpanded = expandedTemplateId === tpl.id;
                  const edit = templateEdits[tpl.id] || {
                    body_ar: tpl.body_ar || "",
                    isDirty: false,
                    saved: false,
                  };

                  return (
                    <div
                      key={tpl.id}
                      className="rounded-xl border border-border bg-card overflow-hidden shadow-xs transition-colors"
                    >
                      {/* Accordion Row Header */}
                      <div
                        onClick={() => setExpandedTemplateId(isExpanded ? null : tpl.id)}
                        className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/60 border border-border/50">
                            {getTemplateIcon(tpl.key)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-foreground">{tpl.label}</span>
                              <Badge variant="secondary" className="font-mono text-[10px]">
                                {tpl.key}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {t("telegram.templates.lastEdited", "Last edited")}: {tpl.updated_at || "Default"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {edit.isDirty && (
                            <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/30">
                              Unsaved Changes
                            </Badge>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      {/* Accordion Expanded Body */}
                      {isExpanded && (
                        <div className="border-t border-border p-5 bg-muted/10 space-y-4">
                          {/* Single Arabic Message Body */}
                          <div className="space-y-1.5" dir="rtl">
                            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <span>نص الرسالة (بالعربية)</span>
                              </span>
                              <span className="text-[10px] text-muted-foreground font-normal">يدعم التنسيق الماركداون (Markdown)</span>
                            </label>
                            <Textarea
                              ref={(el) => {
                                textareaRefs.current[tpl.id] = el;
                              }}
                              value={edit.body_ar}
                              onChange={(e) => handleTemplateChange(tpl.id, e.target.value)}
                              rows={6}
                              className="font-mono text-xs leading-relaxed resize-y text-right bg-background"
                              placeholder="اكتب نص القالب باللغة العربية..."
                            />
                          </div>

                          {/* Variable Insertion Pills */}
                          {tpl.available_variables && tpl.available_variables.length > 0 && (
                            <div className="rounded-lg bg-card border border-border/80 p-3 space-y-1.5" dir="rtl">
                              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                                <HelpCircle className="h-3.5 w-3.5" />
                                <span>انقر فوق أي متغير لإدراجه في موضع المؤشر:</span>
                              </span>
                              <div className="flex flex-wrap gap-1.5 pt-1" dir="ltr">
                                {tpl.available_variables.map((varName: string) => (
                                  <Badge
                                    key={varName}
                                    variant="outline"
                                    onClick={() => insertVariable(tpl.id, varName)}
                                    className="font-mono text-[11px] cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors py-0.5"
                                  >
                                    + {`{{${varName}}}`}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRestoreTemplateDefault(tpl.id)}
                              className="text-xs gap-1.5"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              <span>{t("telegram.templates.restoreDefault", "Restore Default")}</span>
                            </Button>

                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleSaveTemplate(tpl.id)}
                              disabled={!edit.isDirty && !edit.saved}
                              className="text-xs gap-1.5 min-w-[90px]"
                            >
                              {edit.saved ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                  <span>{t("common.saved", "Saved!")}</span>
                                </>
                              ) : (
                                <span>{t("common.save", "Save Changes")}</span>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 4: TEST TOOL */}
          {/* ───────────────────────────────────────────────────────────── */}
          <TabsContent value="test" className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6 max-w-3xl">
              {/* Admin status banner */}
              {initialAdminAccount.is_linked ? (
                <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-sm text-foreground block">
                        {t("telegram.test.linkedBannerTitle", "Your personal account is linked and ready to receive test notifications.")}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {initialAdminAccount.telegram_username ? `@${initialAdminAccount.telegram_username}` : initialAdminAccount.telegram_chat_id}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs">
                    Ready
                  </Badge>
                </div>
              ) : (
                <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-sm text-foreground block">
                        {t("telegram.test.unlinkedBannerTitle", "Link your Telegram account first to use the test tool.")}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t("telegram.test.unlinkedBannerDesc", "Open the bot on Telegram and send /start to connect your personal account.")}
                      </span>
                    </div>
                  </div>

                  <Button asChild size="sm" className="gap-1.5 shrink-0">
                    <a
                      href={`https://t.me/${botStatus.bot_username || "Bot"}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Bot className="h-4 w-4" />
                      <span>{t("telegram.test.linkNow", "Link Now")}</span>
                    </a>
                  </Button>
                </div>
              )}

              {/* Message Composer */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                  {t("telegram.test.messageLabel", "Test Message Text:")}
                </label>
                <Textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  disabled={!initialAdminAccount.is_linked || sendingTest}
                  rows={5}
                  className="font-mono text-xs leading-relaxed resize-y"
                  placeholder="Enter custom test message..."
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setTestMessage(
                      "🚀 *[The Knower OS] Telegram Bot Test Alert*\n\nHello! This is a live test notification from your Telegram Server Control Panel.\nConnectivity is verified and fully operational! ✨"
                    )
                  }
                  disabled={!initialAdminAccount.is_linked || sendingTest}
                  className="text-xs"
                >
                  {t("telegram.test.resetTemplate", "Reset Template")}
                </Button>

                <Button
                  variant="default"
                  onClick={handleSendTestAlert}
                  disabled={!initialAdminAccount.is_linked || sendingTest}
                  className="gap-2 text-xs"
                >
                  {sendingTest ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>{t("telegram.test.sendAlert", "Send Test Alert")}</span>
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 5: SECURITY AUDIT LOG */}
          {/* ───────────────────────────────────────────────────────────── */}
          <TabsContent value="security" className="space-y-4">
            {/* Header with counter & refresh */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3.5 shadow-xs">
              <div>
                <h3 className="font-semibold text-sm text-foreground">
                  {t("telegram.security.title", "Security & Password Recovery Audit Log")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {secTotal} {t("telegram.security.subtitle", "security events — password recovery attempts, blocks, and unlinked rejections.")}
                </p>
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => fetchSecurityEvents(secPage)}
                disabled={secLoading}
              >
                <RotateCw className={`h-4 w-4 ${secLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3.5 shadow-xs">
              <div className="flex flex-wrap items-center gap-2.5">
                <Select value={secStatusFilter} onValueChange={setSecStatusFilter}>
                  <SelectTrigger className="w-[130px] h-9 text-xs">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("telegram.filters.allStatus", "All Status")}</SelectItem>
                    <SelectItem value="success">{t("telegram.status.success", "Success")}</SelectItem>
                    <SelectItem value="blocked">{t("telegram.status.blocked", "Blocked")}</SelectItem>
                    <SelectItem value="rejected">{t("telegram.status.rejected", "Rejected")}</SelectItem>
                    <SelectItem value="warning">{t("telegram.status.warning", "Warning")}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={secEventFilter} onValueChange={setSecEventFilter}>
                  <SelectTrigger className="w-[170px] h-9 text-xs font-mono">
                    <SelectValue placeholder="All Events" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("telegram.filters.allEvents", "All Events")}</SelectItem>
                    <SelectItem value="reset_requested">Password Reset Requested</SelectItem>
                    <SelectItem value="reset_expired">Reset Expired / Invalid</SelectItem>
                    <SelectItem value="reset_success">Password Reset Success</SelectItem>
                    <SelectItem value="link_blocked">Account Link Blocked</SelectItem>
                    <SelectItem value="no_linked_account">No Linked Account</SelectItem>
                    <SelectItem value="account_unlinked">Account Unlinked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("telegram.security.searchPlaceholder", "Search by email or role...")}
                  value={secSearch}
                  onChange={(e) => setSecSearch(e.target.value)}
                  className="pl-8 h-9 text-xs"
                />
              </div>
            </div>

            {/* Security Events Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
              {secLoading ? (
                <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-7 w-7 animate-spin text-primary" />
                  <span className="text-xs">{t("common.loading", "Loading security audit log...")}</span>
                </div>
              ) : securityEvents.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-3">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">
                    {t("telegram.security.emptyTitle", "No security events recorded yet")}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                    {t(
                      "telegram.security.emptySubtitle",
                      "Password recovery attempts, link rejections, and access blocks will be audited here."
                    )}
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-muted/40 border-b border-border text-muted-foreground font-medium uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3 px-4">{t("telegram.security.eventType", "Event Type")}</th>
                          <th className="py-3 px-4">{t("telegram.security.email", "Email")}</th>
                          <th className="py-3 px-4">{t("telegram.security.role", "Role")}</th>
                          <th className="py-3 px-4">{t("telegram.security.status", "Status")}</th>
                          <th className="py-3 px-4 text-right">{t("telegram.security.date", "Date & Time")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {securityEvents.map((ev) => {
                          const isBlocked = ev.status === "blocked" || ev.event_type === "link_blocked";
                          const isWarning = ev.status === "rejected" || ev.event_type.includes("expired") || ev.event_type.includes("no_linked");
                          const isSuccess = ev.status === "success";

                          return (
                            <tr key={ev.id} className="hover:bg-muted/20 transition-colors">
                              <td className="py-3 px-4 whitespace-nowrap">
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] font-mono font-semibold ${
                                    isBlocked
                                      ? "bg-destructive/15 text-destructive border-destructive/30"
                                      : isWarning
                                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                                      : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                  }`}
                                >
                                  {ev.event_type}
                                </Badge>
                              </td>

                              <td className="py-3 px-4 whitespace-nowrap font-medium text-foreground">
                                {ev.email || "---"}
                              </td>

                              <td className="py-3 px-4 whitespace-nowrap">
                                <span className="uppercase text-[10px] font-semibold text-muted-foreground">
                                  {ev.role || "---"}
                                </span>
                              </td>

                              <td className="py-3 px-4 whitespace-nowrap">
                                <span
                                  className={`inline-block text-[11px] font-semibold capitalize ${
                                    isBlocked
                                      ? "text-destructive"
                                      : isWarning
                                      ? "text-amber-500"
                                      : "text-emerald-500"
                                  }`}
                                >
                                  {ev.status}
                                </span>
                              </td>

                              <td className="py-3 px-4 text-right whitespace-nowrap text-muted-foreground">
                                {ev.created_at}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Stacked Card View */}
                  <div className="block md:hidden divide-y divide-border">
                    {securityEvents.map((ev) => (
                      <div key={ev.id} className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {ev.event_type}
                          </Badge>
                          <span className="text-[11px] font-semibold capitalize text-muted-foreground">
                            {ev.status}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-foreground">{ev.email || "No email"}</p>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                          <span className="uppercase">{ev.role || "---"}</span>
                          <span>{ev.created_at}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Pagination */}
              {securityEvents.length > 0 && (
                <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20 text-xs">
                  <span className="text-muted-foreground">
                    {t("common.page", "Page")} <strong>{secPage}</strong> / <strong>{secTotalPages}</strong> (<strong>{secTotal}</strong> total)
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchSecurityEvents(secPage - 1)}
                      disabled={secPage <= 1 || secLoading}
                      className="h-7 text-xs"
                    >
                      {t("common.previous", "Previous")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchSecurityEvents(secPage + 1)}
                      disabled={secPage >= secTotalPages || secLoading}
                      className="h-7 text-xs"
                    >
                      {t("common.next", "Next")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Disconnect Account Confirmation Dialog */}
      <AlertDialog
        open={disconnectingUser !== null}
        onOpenChange={(open) => !open && setDisconnectingUser(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("telegram.dialog.disconnectTitle", "Disconnect this account?")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "telegram.dialog.disconnectDesc",
                `Disconnecting ${disconnectingUser?.name} will stop them from receiving Telegram notifications until they re-link their account.`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel", "Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisconnectConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("telegram.actions.disconnect", "Disconnect")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
