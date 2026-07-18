import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add } from "@/mocks/store";
import { makeId, type Project } from "@/mocks/data";
import { money, shortDate } from "@/lib/format";

export default function ProjectsPage() {
  const { t } = useTranslation();
  const rows = useCollection("projects");
  const clients = useCollection("clients");
  return (
    <ResourcePage<Project>
      title={t("nav.projects")}
      description="Every engagement from planning to launch"
      rows={rows}
      getSearchable={(r) => `${r.name} ${r.type} ${r.status}`}
      newLabel="New project"
      columns={[
        {
          key: "name",
          header: t("common.name"),
          cell: (r) => (
            <Link href={`/projects/${r.id}`}
              className="font-medium hover:text-primary"
            >
              {r.name}
            </Link>
          ),
        },
        { key: "client", header: "Client", cell: (r) => clients.find((c) => c.id === r.clientId)?.name ?? "—" },
        { key: "type", header: "Type", cell: (r) => <span className="text-muted-foreground">{r.type}</span> },
        { key: "priority", header: t("common.priority"), cell: (r) => <StatusBadge value={r.priority} /> },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
        {
          key: "progress",
          header: t("common.progress"),
          cell: (r) => (
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary" style={{ width: `${r.progress}%` }} />
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">{r.progress}%</span>
            </div>
          ),
        },
        { key: "budget", header: "Budget", cell: (r) => <span className="tabular-nums">{money(r.budget)}</span> },
        { key: "deadline", header: "Deadline", cell: (r) => <span className="text-xs text-muted-foreground">{shortDate(r.deadline)}</span> },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={async (v) => {
            try {
              await add("projects", {
                name: v.name,
                client_id: v.client_id || clients[0]?.id || null,
                description: v.description,
                type: v.type,
                status: (v.status as Project["status"]) || "planning",
                priority: (v.priority as Project["priority"]) || "medium",
                start_date: new Date().toISOString().split("T")[0],
                deadline: v.deadline ? new Date(v.deadline).toISOString().split("T")[0] : new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
                budget: Number(v.budget || 0),
                progress: 0,
              });
              close();
            } catch (err: any) {
              console.error("Failed to add project", err);
              alert(err.response?.data?.message || "Failed to save project.");
            }
          }}
          fields={[
            { name: "name", label: "Project name", type: "text", required: true },
            { name: "client_id", label: "Client", type: "select", options: clients.map((c) => ({ value: c.id, label: c.name })) },
            { name: "type", label: "Type", type: "text", defaultValue: "Web App" },
            {
              name: "priority",
              label: "Priority",
              type: "select",
              defaultValue: "medium",
              options: [
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ],
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              defaultValue: "planning",
              options: [
                { value: "planning", label: "Planning" },
                { value: "in_progress", label: "In progress" },
                { value: "on_hold", label: "On hold" },
                { value: "completed", label: "Completed" },
              ],
            },
            { name: "budget", label: "Budget (USD)", type: "number" },
            { name: "deadline", label: "Deadline", type: "date" },
            { name: "description", label: "Description", type: "textarea" },
          ]}
        />
      )}
    />
  );
}
