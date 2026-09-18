import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "sonner";
import { Eye, Ban, BadgeDollarSign, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/store/auth";
import { roleHas, type Role } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { shortDate } from "@/lib/format";

type GP = {
  id: string;
  referenceId: string;
  teamName: string;
  university: string;
  college: string;
  primaryContactName: string;
  primaryContactPhone: string;
  projectType: string;
  serviceType: string;
  status: string;
  quotedPrice: number | null;
  createdAt: string;
};

const STATUSES = [
  "all",
  "pending_review",
  "quoted",
  "in_progress",
  "delivered",
  "cancelled",
  "rejected",
] as const;

function api() {
  const instance = axios.create({
    baseURL: "/api/v1",
    withCredentials: true,
    headers: { Accept: "application/json" },
  });
  const token = localStorage.getItem("auth_token");
  if (token && token !== "undefined" && token !== "null") {
    instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  return instance;
}

function statusVariant(status: string) {
  switch (status) {
    case "pending_review":
      return "secondary";
    case "quoted":
      return "default";
    case "in_progress":
      return "default";
    case "delivered":
      return "outline";
    case "rejected":
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
}

export default function GraduationProjectsIndex() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const canManage = user ? roleHas(user.role as Role, "graduation_projects.manage") : false;

  const [rows, setRows] = useState<GP[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("all");
  const [projectType, setProjectType] = useState<string>("all");
  const [serviceType, setServiceType] = useState<string>("all");
  const [search, setSearch] = useState("");

  const [quoteRow, setQuoteRow] = useState<GP | null>(null);
  const [rejectRow, setRejectRow] = useState<GP | null>(null);
  const [quotedPrice, setQuotedPrice] = useState("");
  const [finalServiceType, setFinalServiceType] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api().get("/graduation-projects", {
        params: {
          status: status === "all" ? undefined : status,
          project_type: projectType === "all" ? undefined : projectType,
          service_type: serviceType === "all" ? undefined : serviceType,
          search: search || undefined,
          per_page: 100,
        },
      });
      setRows(res.data.data || []);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || t("graduation.admin.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [status, projectType, serviceType, search, t]);

  useEffect(() => {
    const tmr = setTimeout(load, 200);
    return () => clearTimeout(tmr);
  }, [load]);

  const sendQuote = async () => {
    if (!quoteRow) return;
    setSaving(true);
    try {
      await api().post(`/graduation-projects/${quoteRow.id}/quote`, {
        quoted_price: Number(quotedPrice),
        final_service_type: finalServiceType || undefined,
      });
      toast.success(t("graduation.admin.quoteSent"));
      setQuoteRow(null);
      setQuotedPrice("");
      setFinalServiceType("");
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || t("graduation.admin.actionFailed"));
    } finally {
      setSaving(false);
    }
  };

  const sendReject = async () => {
    if (!rejectRow) return;
    setSaving(true);
    try {
      await api().post(`/graduation-projects/${rejectRow.id}/reject`, {
        rejection_reason: rejectionReason || undefined,
      });
      toast.success(t("graduation.admin.rejectedOk"));
      setRejectRow(null);
      setRejectionReason("");
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || t("graduation.admin.actionFailed"));
    } finally {
      setSaving(false);
    }
  };

  const title = useMemo(() => t("graduation.admin.title"), [t]);

  return (
    <>
      <div className="space-y-6 p-4 sm:p-6">
        <div>
          <h1 className="font-display text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{t("graduation.admin.description")}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                status === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {t(`graduation.admin.${s}`)}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="ps-9"
              placeholder={t("graduation.admin.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={projectType} onValueChange={setProjectType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("graduation.admin.filterTrack")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("graduation.admin.filterAllTracks")}</SelectItem>
              <SelectItem value="hardware">{t("graduation.admin.hardware")}</SelectItem>
              <SelectItem value="software">{t("graduation.admin.software")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t("graduation.admin.filterService")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("graduation.admin.filterAllServices")}</SelectItem>
              <SelectItem value="consultation">{t("graduation.register.svcConsultation")}</SelectItem>
              <SelectItem value="partial_execution">{t("graduation.register.svcPartial")}</SelectItem>
              <SelectItem value="full_execution">{t("graduation.register.svcFull")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/40 text-start text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">{t("graduation.admin.colReference")}</th>
                <th className="px-4 py-3 font-medium">{t("graduation.admin.colTeam")}</th>
                <th className="px-4 py-3 font-medium">{t("graduation.admin.colUniversity")}</th>
                <th className="px-4 py-3 font-medium">{t("graduation.admin.colContact")}</th>
                <th className="px-4 py-3 font-medium">{t("graduation.admin.colTrack")}</th>
                <th className="px-4 py-3 font-medium">{t("graduation.admin.colStatus")}</th>
                <th className="px-4 py-3 font-medium">{t("graduation.admin.colPrice")}</th>
                <th className="px-4 py-3 font-medium">{t("graduation.admin.colDate")}</th>
                <th className="px-4 py-3 font-medium text-end">{t("graduation.admin.colActions")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                    {t("graduation.admin.noRows")}
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-t border-border hover:bg-muted/20">
                    <td className="px-4 py-3 font-mono text-xs">{r.referenceId}</td>
                    <td className="px-4 py-3 font-medium">{r.teamName}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {r.university}
                      <div className="text-xs">{r.college}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{r.primaryContactName}</div>
                      <div className="text-xs text-muted-foreground">{r.primaryContactPhone}</div>
                    </td>
                    <td className="px-4 py-3">
                      {r.projectType === "hardware"
                        ? t("graduation.admin.hardware")
                        : t("graduation.admin.software")}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant(r.status) as any}>
                        {t(`graduation.admin.${r.status}`)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {r.quotedPrice != null ? `${r.quotedPrice.toLocaleString()} EGP` : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{shortDate(r.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/admin/graduation-projects/${r.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        {canManage && r.status === "pending_review" && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setQuoteRow(r);
                                setQuotedPrice(r.quotedPrice?.toString() || "");
                                setFinalServiceType(r.serviceType);
                              }}
                            >
                              <BadgeDollarSign className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setRejectRow(r)}>
                              <Ban className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!quoteRow} onOpenChange={(o) => !o && setQuoteRow(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("graduation.admin.quickQuote")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>{t("graduation.admin.quotedPrice")}</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={quotedPrice}
                onChange={(e) => setQuotedPrice(e.target.value)}
              />
            </div>
            <div>
              <Label>{t("graduation.admin.finalServiceType")}</Label>
              <Select value={finalServiceType} onValueChange={setFinalServiceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">{t("graduation.register.svcConsultation")}</SelectItem>
                  <SelectItem value="partial_execution">{t("graduation.register.svcPartial")}</SelectItem>
                  <SelectItem value="full_execution">{t("graduation.register.svcFull")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={sendQuote} disabled={saving || !quotedPrice}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : t("graduation.admin.sendQuote")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!rejectRow} onOpenChange={(o) => !o && setRejectRow(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("graduation.admin.quickReject")}</DialogTitle>
          </DialogHeader>
          <div>
            <Label>{t("graduation.admin.rejectReason")}</Label>
            <Textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={sendReject} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : t("graduation.admin.confirmReject")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
