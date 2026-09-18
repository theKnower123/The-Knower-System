import { useCallback, useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "sonner";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  MessageCircle,
  Phone,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { useAuth } from "@/store/auth";
import { roleHas, type Role } from "@/lib/permissions";
import { shortDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type Milestone = {
  id: string;
  title: string;
  status: string;
  progress: number;
  deadline?: string | null;
  completedAt?: string | null;
};

type Member = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  roleInTeam?: string | null;
  isPrimary: boolean;
};

type GP = {
  id: string;
  referenceId: string;
  teamName: string;
  university: string;
  college: string;
  teamSize: number;
  description?: string | null;
  deadline?: string | null;
  briefAttachmentUrl?: string | null;
  projectType: string;
  serviceType: string;
  finalServiceType?: string | null;
  status: string;
  quotedPrice: number | null;
  rejectionReason?: string | null;
  hardwareHandedOver: boolean;
  outcome?: string | null;
  outcomeNotes?: string | null;
  isShowcased: boolean;
  primaryContactName: string;
  primaryContactPhone: string;
  primaryContactEmail: string;
  linkedProjectId?: string | null;
  depositInvoiceId?: string | null;
  finalInvoiceId?: string | null;
  members?: Member[];
  milestones?: Milestone[];
  createdAt: string;
};

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

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 font-display text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function GraduationProjectShow() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const canManage = user ? roleHas(user.role as Role, "graduation_projects.manage") : false;
  const page = usePage<{ id: string }>();
  const id = String(page.props.id);

  const [gp, setGp] = useState<GP | null>(null);
  const [loading, setLoading] = useState(true);
  const [quotedPrice, setQuotedPrice] = useState("");
  const [finalServiceType, setFinalServiceType] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [finalAmount, setFinalAmount] = useState("");
  const [hardwareHandedOver, setHardwareHandedOver] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [outcome, setOutcome] = useState("unknown");
  const [outcomeNotes, setOutcomeNotes] = useState("");
  const [isShowcased, setIsShowcased] = useState(false);
  const [testimonialQuote, setTestimonialQuote] = useState("");
  const [approveOpen, setApproveOpen] = useState(false);
  const [deliverOpen, setDeliverOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api().get(`/graduation-projects/${id}`);
      const data = res.data.data as GP;
      setGp(data);
      setQuotedPrice(data.quotedPrice?.toString() || "");
      setFinalServiceType(data.finalServiceType || data.serviceType);
      setHardwareHandedOver(data.hardwareHandedOver);
      setOutcome(data.outcome || "unknown");
      setOutcomeNotes(data.outcomeNotes || "");
      setIsShowcased(data.isShowcased);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || t("graduation.admin.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (fn: () => Promise<void>, okKey: string) => {
    setSaving(true);
    try {
      await fn();
      toast.success(t(okKey));
      await load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || t("graduation.admin.actionFailed"));
    } finally {
      setSaving(false);
    }
  };

  if (loading || !gp) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const phoneDigits = gp.primaryContactPhone.replace(/[^0-9]/g, "");
  const waHref = phoneDigits ? `https://wa.me/${phoneDigits}` : null;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 -ms-2">
            <Link href="/admin/graduation-projects">
              <ArrowLeft className="me-1 h-4 w-4" />
              {t("graduation.admin.back")}
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold">{gp.teamName}</h1>
            <Badge>{gp.projectType === "hardware" ? t("graduation.admin.hardware") : t("graduation.admin.software")}</Badge>
            <Badge variant="secondary">{t(`graduation.admin.${gp.status}`)}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {gp.referenceId} · {shortDate(gp.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title={t("graduation.register.teamSection")}>
          <dl className="grid gap-2 text-sm">
            <Row label={t("graduation.register.university")} value={gp.university} />
            <Row label={t("graduation.register.college")} value={gp.college} />
            <Row label={t("graduation.register.deadline")} value={gp.deadline || "—"} />
            <Row
              label={t("graduation.register.serviceType")}
              value={gp.finalServiceType || gp.serviceType}
            />
          </dl>
          <div className="mt-4 rounded-lg border border-border p-3">
            <div className="font-medium">{gp.primaryContactName}</div>
            <div className="text-sm text-muted-foreground">{gp.primaryContactEmail}</div>
            <div className="text-sm text-muted-foreground">{gp.primaryContactPhone}</div>
            <div className="mt-2 flex gap-2">
              {waHref && (
                <Button asChild size="sm" variant="outline">
                  <a href={waHref} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="me-1 h-4 w-4" /> {t("graduation.admin.whatsapp")}
                  </a>
                </Button>
              )}
              <Button asChild size="sm" variant="outline">
                <a href={`tel:${gp.primaryContactPhone}`}>
                  <Phone className="me-1 h-4 w-4" /> {t("graduation.admin.call")}
                </a>
              </Button>
            </div>
          </div>
          {gp.members && gp.members.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-start text-xs text-muted-foreground">
                    <th className="py-1">{t("graduation.register.memberName")}</th>
                    <th className="py-1">{t("graduation.register.memberRole")}</th>
                    <th className="py-1">{t("graduation.register.memberEmail")}</th>
                  </tr>
                </thead>
                <tbody>
                  {gp.members.map((m) => (
                    <tr key={m.id} className="border-t border-border/60">
                      <td className="py-1.5">{m.name}{m.isPrimary ? " ★" : ""}</td>
                      <td className="py-1.5 text-muted-foreground">{m.roleInTeam || "—"}</td>
                      <td className="py-1.5 text-muted-foreground">{m.email || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">{gp.description}</p>
          {gp.briefAttachmentUrl && (
            <Button asChild variant="link" className="mt-2 px-0">
              <a href={gp.briefAttachmentUrl} target="_blank" rel="noopener noreferrer">
                {t("graduation.admin.downloadBrief")} <ExternalLink className="ms-1 h-3.5 w-3.5" />
              </a>
            </Button>
          )}
        </Card>

        {canManage && (gp.status === "pending_review" || gp.status === "quoted") && (
          <Card title={t("graduation.admin.quickQuote")}>
            <div className="space-y-3">
              <div>
                <Label>{t("graduation.admin.quotedPrice")}</Label>
                <Input type="number" min={0} step="0.01" value={quotedPrice} onChange={(e) => setQuotedPrice(e.target.value)} />
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
              <Button
                disabled={saving || !quotedPrice}
                onClick={() =>
                  run(
                    () =>
                      api().post(`/graduation-projects/${gp.id}/quote`, {
                        quoted_price: Number(quotedPrice),
                        final_service_type: finalServiceType,
                      }),
                    "graduation.admin.quoteSent",
                  )
                }
              >
                {t("graduation.admin.sendQuote")}
              </Button>
              {gp.status === "pending_review" && (
                <div className="border-t border-border pt-3">
                  <Label>{t("graduation.admin.rejectReason")}</Label>
                  <Textarea className="mt-1" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
                  <Button
                    className="mt-2"
                    variant="destructive"
                    disabled={saving}
                    onClick={() =>
                      run(
                        () =>
                          api().post(`/graduation-projects/${gp.id}/reject`, {
                            rejection_reason: rejectionReason || undefined,
                          }),
                        "graduation.admin.rejectedOk",
                      )
                    }
                  >
                    {t("graduation.admin.confirmReject")}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}

        {canManage && gp.status === "quoted" && (
          <Card title={t("graduation.admin.approveTitle")}>
            <p className="mb-3 text-sm text-muted-foreground">
              {t("graduation.admin.approveConfirm")}
            </p>
            <Button onClick={() => setApproveOpen(true)}>{t("graduation.admin.approveTitle")}</Button>
          </Card>
        )}

        {(gp.linkedProjectId || gp.depositInvoiceId || gp.finalInvoiceId) && (
          <Card title={t("graduation.admin.links")}>
            <div className="flex flex-wrap gap-2">
              {gp.linkedProjectId && (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/projects/${gp.linkedProjectId}`}>{t("graduation.admin.openProject")}</Link>
                </Button>
              )}
              {gp.depositInvoiceId && (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/finance/invoices`}>{t("graduation.admin.openDepositInvoice")} #{gp.depositInvoiceId}</Link>
                </Button>
              )}
              {gp.finalInvoiceId && (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/finance/invoices`}>{t("graduation.admin.openFinalInvoice")} #{gp.finalInvoiceId}</Link>
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>

      {gp.milestones && gp.milestones.length > 0 && (
        <Card title={t("graduation.admin.milestones")}>
          <ol className="space-y-3">
            {gp.milestones.map((m, i) => (
              <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
                <div>
                  <div className="text-xs font-mono text-muted-foreground">{String(i + 1).padStart(2, "0")}</div>
                  <div className="font-medium">{m.title}</div>
                </div>
                <Select
                  value={m.status}
                  disabled={!canManage}
                  onValueChange={(status) =>
                    run(
                      () => api().patch(`/graduation-projects/${gp.id}/milestones/${m.id}`, { status }),
                      "Milestone updated",
                    )
                  }
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{t("graduation.admin.milestonePending")}</SelectItem>
                    <SelectItem value="in_progress">{t("graduation.admin.milestoneInProgress")}</SelectItem>
                    <SelectItem value="completed">{t("graduation.admin.milestoneCompleted")}</SelectItem>
                  </SelectContent>
                </Select>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {canManage && gp.status === "in_progress" && (
        <Card title={t("graduation.admin.deliverTitle")}>
          <div className="space-y-3">
            <div>
              <Label>{t("graduation.admin.uploadDeliverables")}</Label>
              <Input type="file" multiple className="mt-1" onChange={(e) => setFiles(e.target.files)} />
            </div>
            {gp.projectType === "hardware" && (
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={hardwareHandedOver} onCheckedChange={setHardwareHandedOver} />
                {t("graduation.admin.hardwareHandedOver")}
              </label>
            )}
            <Button onClick={() => setDeliverOpen(true)}>
              <Upload className="me-2 h-4 w-4" />
              {t("graduation.admin.markDelivered")}
            </Button>
          </div>
        </Card>
      )}

      {(gp.status === "delivered" || gp.status === "in_progress") && canManage && (
        <Card title={t("graduation.admin.outcomeTitle")}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>{t("graduation.admin.outcome")}</Label>
              <Select value={outcome} onValueChange={setOutcome}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passed">{t("graduation.admin.passed")}</SelectItem>
                  <SelectItem value="failed">{t("graduation.admin.failed")}</SelectItem>
                  <SelectItem value="unknown">{t("graduation.admin.unknown")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center gap-2 self-end text-sm">
              <Switch checked={isShowcased} onCheckedChange={setIsShowcased} />
              {t("graduation.admin.showcase")}
            </label>
          </div>
          <div className="mt-3">
            <Label>{t("graduation.admin.outcomeNotes")}</Label>
            <Textarea value={outcomeNotes} onChange={(e) => setOutcomeNotes(e.target.value)} />
          </div>
          <Button
            className="mt-3"
            disabled={saving}
            onClick={() =>
              run(
                () =>
                  api().post(`/graduation-projects/${gp.id}/outcome`, {
                    outcome,
                    outcome_notes: outcomeNotes,
                    is_showcased: isShowcased,
                  }),
                "graduation.admin.outcomeSaved",
              )
            }
          >
            {t("graduation.admin.saveOutcome")}
          </Button>

          <div className="mt-6 border-t border-border pt-4">
            <h3 className="mb-2 text-sm font-semibold">{t("graduation.admin.testimonialTitle")}</h3>
            <Textarea
              placeholder={t("graduation.admin.testimonialQuote")}
              value={testimonialQuote}
              onChange={(e) => setTestimonialQuote(e.target.value)}
            />
            <Button
              className="mt-2"
              variant="outline"
              disabled={saving || !testimonialQuote.trim()}
              onClick={() =>
                run(async () => {
                  await api().post(`/graduation-projects/${gp.id}/testimonials`, {
                    quote: testimonialQuote,
                  });
                  setTestimonialQuote("");
                }, "graduation.admin.testimonialCreated")
              }
            >
              {t("graduation.admin.createTestimonial")}
            </Button>
          </div>
        </Card>
      )}

      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("graduation.admin.approveTitle")}</DialogTitle>
          </DialogHeader>
          <div>
            <Label>{t("graduation.admin.depositAmount")}</Label>
            <Input type="number" min={0} step="0.01" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
          </div>
          <DialogFooter>
            <Button
              disabled={saving || !depositAmount}
              onClick={() =>
                run(async () => {
                  await api().post(`/graduation-projects/${gp.id}/approve`, {
                    deposit_amount: Number(depositAmount),
                  });
                  setApproveOpen(false);
                }, "graduation.admin.projectStarted")
              }
            >
              {t("graduation.admin.approveConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deliverOpen} onOpenChange={setDeliverOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("graduation.admin.markDelivered")}</DialogTitle>
          </DialogHeader>
          <div>
            <Label>{t("graduation.admin.finalAmount")}</Label>
            <Input type="number" min={0} step="0.01" value={finalAmount} onChange={(e) => setFinalAmount(e.target.value)} />
          </div>
          <DialogFooter>
            <Button
              disabled={saving}
              onClick={() =>
                run(async () => {
                  const form = new FormData();
                  if (finalAmount) form.append("final_amount", finalAmount);
                  form.append("hardware_handed_over", hardwareHandedOver ? "1" : "0");
                  if (files) {
                    Array.from(files).forEach((f) => form.append("files[]", f));
                  }
                  await api().post(`/graduation-projects/${gp.id}/deliver`, form, {
                    headers: { "Content-Type": "multipart/form-data" },
                  });
                  setDeliverOpen(false);
                }, "graduation.admin.deliveredOk")
              }
            >
              {t("graduation.admin.markDelivered")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className={cn("grid grid-cols-[140px_1fr] gap-2")}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
