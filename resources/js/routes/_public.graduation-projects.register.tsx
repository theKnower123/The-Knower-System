import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Plus, Trash2 } from "lucide-react";
import { Section, SectionHeading } from "@/components/public/blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_public/graduation-projects/register")({
  head: () => ({
    meta: [{ title: "Register Graduation Project — The Knower" }],
  }),
  component: GraduationRegisterPage,
});

type MemberDraft = { name: string; email: string; phone: string; role_in_team: string };

const COUNTRY_CODES = [
  { code: "+20", label: "EG +20" },
  { code: "+966", label: "SA +966" },
  { code: "+971", label: "AE +971" },
  { code: "+962", label: "JO +962" },
  { code: "+1", label: "US +1" },
];

function GraduationRegisterPage() {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<{ referenceId: string; teamName: string } | null>(null);

  const [teamName, setTeamName] = useState("");
  const [university, setUniversity] = useState("");
  const [college, setCollege] = useState("");
  const [teamSize, setTeamSize] = useState("1");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+20");
  const [contactPhone, setContactPhone] = useState("");
  const [members, setMembers] = useState<MemberDraft[]>([]);
  const [projectType, setProjectType] = useState<"hardware" | "software">("hardware");
  const [serviceType, setServiceType] = useState("consultation");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  const { data: socialData } = useQuery({
    queryKey: ["public", "social-links"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/public/social-links");
      return (res.data.links || []) as { platform: string; url: string | null }[];
    },
    staleTime: 5 * 60 * 1000,
  });

  /** Prefer CMS Social Links WhatsApp URL (wa.me, chat.whatsapp.com, or any stored URL). */
  const whatsappLink = useMemo(() => {
    const raw = socialData?.find((l) => l.platform?.toLowerCase() === "whatsapp")?.url?.trim();
    if (!raw) return null;
    return raw;
  }, [socialData]);

  const buildWhatsAppHref = (referenceId: string, team: string) => {
    if (!whatsappLink) return null;
    const message = `Hi, we submitted graduation project ${referenceId} for team ${team}.`;
    const lower = whatsappLink.toLowerCase();
    if (lower.includes("wa.me") || lower.includes("api.whatsapp.com/send")) {
      const base = whatsappLink.split("?")[0];
      const params = new URLSearchParams(whatsappLink.includes("?") ? whatsappLink.split("?")[1] : "");
      params.set("text", message);
      return `${base}?${params.toString()}`;
    }
    return whatsappLink;
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!teamName.trim()) next.teamName = t("graduation.register.errorsRequired");
    if (!university.trim()) next.university = t("graduation.register.errorsRequired");
    if (!college.trim()) next.college = t("graduation.register.errorsRequired");
    if (!contactName.trim()) next.contactName = t("graduation.register.errorsRequired");
    if (!contactEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      next.contactEmail = t("graduation.register.errorsEmail");
    }
    if (!contactPhone.trim()) next.contactPhone = t("graduation.register.errorsRequired");
    if (!description.trim()) next.description = t("graduation.register.errorsRequired");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("team_name", teamName.trim());
      form.append("university", university.trim());
      form.append("college", college.trim());
      form.append("team_size", teamSize);
      form.append("primary_contact_name", contactName.trim());
      form.append("primary_contact_email", contactEmail.trim());
      form.append("primary_contact_phone", `${countryCode}${contactPhone.replace(/\s+/g, "")}`);
      form.append("project_type", projectType);
      form.append("service_type", serviceType);
      form.append("description", description.trim());
      if (deadline) form.append("deadline", deadline);
      if (attachment) form.append("brief_attachment", attachment);
      form.append("members", JSON.stringify(members.filter((m) => m.name.trim())));

      const res = await axios.post("/api/v1/public/graduation-projects/register", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess({
        referenceId: res.data.data.referenceId,
        teamName: res.data.data.teamName,
      });
    } catch (err: any) {
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors) {
        const mapped: Record<string, string> = {};
        Object.entries(apiErrors).forEach(([k, v]) => {
          mapped[k] = Array.isArray(v) ? String(v[0]) : String(v);
        });
        setErrors(mapped);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    const waUrl = buildWhatsAppHref(success.referenceId, success.teamName);

    return (
      <Section>
        <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
          <h1 className="mt-4 font-display text-2xl font-semibold">{t("graduation.register.successTitle")}</h1>
          <p className="mt-2 text-muted-foreground">{t("graduation.register.successBody")}</p>
          <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-3">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {t("graduation.register.referenceLabel")}
            </div>
            <div className="mt-1 font-mono text-xl font-bold tracking-wide">{success.referenceId}</div>
          </div>
          {waUrl ? (
            <Button asChild className="mt-6 w-full bg-[#25D366] text-white hover:bg-[#1ebe5d]">
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                {t("graduation.register.whatsappCta")}
              </a>
            </Button>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">
              {t("graduation.register.whatsappUnavailable", {
                defaultValue: "WhatsApp contact will appear once a WhatsApp link is set in Social Links.",
              })}
            </p>
          )}
          <div className="mt-8 text-start">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t("graduation.register.nextStepsTitle")}
            </h2>
            <ol className="mt-3 list-decimal space-y-1 ps-5 text-sm text-muted-foreground">
              <li>{t("graduation.register.next1")}</li>
              <li>{t("graduation.register.next2")}</li>
              <li>{t("graduation.register.next3")}</li>
            </ol>
          </div>
          <Button asChild variant="outline" className="mt-8">
            <Link to="/graduation-projects">{t("graduation.register.backHome")}</Link>
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <div>
      <Section>
        <SectionHeading
          align="center"
          title={t("graduation.register.title")}
          subtitle={t("graduation.register.subtitle")}
        />
        <form onSubmit={onSubmit} className="mx-auto mt-10 max-w-3xl space-y-10">
          <fieldset className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <legend className="px-1 font-display text-lg font-semibold">{t("graduation.register.teamSection")}</legend>
            <Field label={t("graduation.register.teamName")} error={errors.teamName || errors.team_name}>
              <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("graduation.register.university")} error={errors.university}>
                <Input value={university} onChange={(e) => setUniversity(e.target.value)} />
              </Field>
              <Field label={t("graduation.register.college")} error={errors.college}>
                <Input value={college} onChange={(e) => setCollege(e.target.value)} />
              </Field>
            </div>
            <Field label={t("graduation.register.teamSize")}>
              <Input
                type="number"
                min={1}
                max={20}
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <legend className="px-1 font-display text-lg font-semibold">{t("graduation.register.contactSection")}</legend>
            <Field label={t("graduation.register.contactName")} error={errors.contactName || errors.primary_contact_name}>
              <Input value={contactName} onChange={(e) => setContactName(e.target.value)} />
            </Field>
            <Field label={t("graduation.register.contactEmail")} error={errors.contactEmail || errors.primary_contact_email}>
              <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
              <Field label={t("graduation.register.countryCode")}>
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY_CODES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label={t("graduation.register.contactPhone")} error={errors.contactPhone || errors.primary_contact_phone}>
                <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="10XXXXXXXX" />
              </Field>
            </div>
          </fieldset>

          <fieldset className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <legend className="px-1 font-display text-lg font-semibold">{t("graduation.register.membersSection")}</legend>
            {members.map((m, idx) => (
              <div key={idx} className="grid gap-3 rounded-xl border border-border/70 p-4 sm:grid-cols-2">
                <Input
                  placeholder={t("graduation.register.memberName")}
                  value={m.name}
                  onChange={(e) => {
                    const next = [...members];
                    next[idx] = { ...next[idx], name: e.target.value };
                    setMembers(next);
                  }}
                />
                <Input
                  placeholder={t("graduation.register.memberRole")}
                  value={m.role_in_team}
                  onChange={(e) => {
                    const next = [...members];
                    next[idx] = { ...next[idx], role_in_team: e.target.value };
                    setMembers(next);
                  }}
                />
                <Input
                  placeholder={t("graduation.register.memberEmail")}
                  value={m.email}
                  onChange={(e) => {
                    const next = [...members];
                    next[idx] = { ...next[idx], email: e.target.value };
                    setMembers(next);
                  }}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder={t("graduation.register.memberPhone")}
                    value={m.phone}
                    onChange={(e) => {
                      const next = [...members];
                      next[idx] = { ...next[idx], phone: e.target.value };
                      setMembers(next);
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setMembers(members.filter((_, i) => i !== idx))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => setMembers([...members, { name: "", email: "", phone: "", role_in_team: "" }])}
            >
              <Plus className="me-2 h-4 w-4" />
              {t("graduation.register.addMember")}
            </Button>
          </fieldset>

          <fieldset className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <legend className="px-1 font-display text-lg font-semibold">{t("graduation.register.scopeSection")}</legend>
            <div>
              <Label className="mb-2 block">{t("graduation.register.projectType")}</Label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    ["hardware", t("graduation.register.typeHardware")],
                    ["software", t("graduation.register.typeSoftware")],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setProjectType(value)}
                    className={cn(
                      "rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                      projectType === value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <Field label={t("graduation.register.serviceType")}>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">{t("graduation.register.svcConsultation")}</SelectItem>
                  <SelectItem value="partial_execution">{t("graduation.register.svcPartial")}</SelectItem>
                  <SelectItem value="full_execution">{t("graduation.register.svcFull")}</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label={t("graduation.register.deadline")}>
              <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </Field>
            <Field label={t("graduation.register.description")} error={errors.description}>
              <Textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("graduation.register.descriptionPlaceholder")}
              />
            </Field>
            <Field label={t("graduation.register.attachment")}>
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg"
                onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
              />
            </Field>
          </fieldset>

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
                {t("graduation.register.submitting")}
              </>
            ) : (
              t("graduation.register.submit")
            )}
          </Button>
        </form>
      </Section>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
