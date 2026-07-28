import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add } from "@/mocks/store";
import { makeId, type Bug } from "@/mocks/data";
import { shortDate } from "@/lib/format";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/searchable-select";

export default function BugsPage() {
  const { t } = useTranslation();
  const rows = useCollection("bugs");
  const projects = useCollection("projects");
  const clients = useCollection("clients");
  const employees = useCollection("employees");

  // Roles we consider "categories"
  const ROLE_LABELS: Record<string, string> = {
    developer: "Developers",
    designer: "Designers",
    project_manager: "Project Managers",
    qa: "QA Testers",
    accountant: "Accountants",
    hr: "HR",
    support: "Support",
    team_leader: "Team Leaders",
    super_admin: "Admins",
    ceo: "Leadership",
  };

  const employeeOptions = employees.map((e: any) => ({
    value: e.id as string,
    label: e.name,
    category: ROLE_LABELS[(e.role || e.position || "").toLowerCase()] || "Other",
  }));

  const clientOptions = clients.map((c: any) => ({
    value: c.id as string,
    label: c.name,
  }));

  // Inline form state
  const [form, setForm] = useState({
    title: "",
    projectId: "",
    severity: "medium",
    reportedBy: "",
    assignedTo: "",
  });

  const setF = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  return (
    <ResourcePage<Bug>
      title={t("nav.bugs")}
      description="Defects reported across projects"
      rows={rows}
      newLabel="Report bug"
      columns={[
        { key: "title", header: t("common.title"), cell: (r) => <span className="font-medium">{r.title}</span> },
        { key: "project", header: "Project", cell: (r) => projects.find((p) => p.id === r.projectId)?.name ?? "—" },
        { key: "severity", header: "Severity", cell: (r) => <StatusBadge value={r.severity} /> },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
        { key: "assignee", header: "Assigned to", cell: (r) => r.assignedTo },
        { key: "reporter", header: "Reported by", cell: (r) => r.reportedBy },
        { key: "created", header: t("common.created"), cell: (r) => <span className="text-xs text-muted-foreground">{shortDate(r.createdAt)}</span> },
      ]}
      renderForm={(close) => (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            add("bugs", {
              id: makeId("bg"),
              projectId: form.projectId,
              title: form.title,
              severity: (form.severity as Bug["severity"]) || "medium",
              status: "open",
              reportedBy: clientOptions.find((c) => c.value === form.reportedBy)?.label || form.reportedBy || "Unknown",
              assignedTo: employeeOptions.find((emp) => emp.value === form.assignedTo)?.label || form.assignedTo || "Unassigned",
              createdAt: new Date().toISOString(),
            });
            close();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Title */}
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="bug-title">Title *</Label>
              <Input
                id="bug-title"
                required
                value={form.title}
                onChange={(e) => setF("title", e.target.value)}
              />
            </div>

            {/* Project */}
            <div className="space-y-1.5">
              <Label>Project *</Label>
              <Select value={form.projectId} onValueChange={(v) => setF("projectId", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project…" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id as string}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Severity */}
            <div className="space-y-1.5">
              <Label>Severity</Label>
              <Select value={form.severity} onValueChange={(v) => setF("severity", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reported by – searchable clients dropdown */}
            <div className="space-y-1.5">
              <Label>Reported by (Client)</Label>
              <SearchableSelect
                options={clientOptions}
                value={form.reportedBy}
                onChange={(v) => setF("reportedBy", v)}
                placeholder="Select client…"
                searchPlaceholder="Search client name…"
              />
            </div>

            {/* Assign to – searchable employees by category */}
            <div className="space-y-1.5">
              <Label>Assign to (Employee)</Label>
              <SearchableSelect
                options={employeeOptions}
                value={form.assignedTo}
                onChange={(v) => setF("assignedTo", v)}
                placeholder="Select employee…"
                searchPlaceholder="Search employee name…"
                grouped
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={close}>Cancel</Button>
            <Button type="submit">Report Bug</Button>
          </DialogFooter>
        </form>
      )}
    />
  );
}
