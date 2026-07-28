import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm, type FieldDef } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/stat-card";
import { useCollection, add, remove, update } from "@/mocks/store";
import { makeId, type Project } from "@/mocks/data";
import { money, shortDate } from "@/lib/format";
import { MoreHorizontal, FolderKanban, CheckCircle2, PauseCircle, AlertTriangle, Github, Link as LinkIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/store/auth";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { StaggerList } from "@/components/animations/StaggerList";
import type { FilterDef } from "@/components/data-table";

export default function ProjectsPage() {
  const { t } = useTranslation();
  const rows = useCollection("projects");
  const clients = useCollection("clients");
  const users = useCollection("employees"); 
  const { user } = useAuth();
  const [editingRow, setEditingRow] = useState<Project | null>(null);

  const canEdit = ["super_admin", "ceo", "project_manager", "team_leader", "hr"].includes(user?.role || "");

  // Dashboard stats
  const stats = useMemo(() => {
    const active = rows.filter((r) => r.status === "active" || r.status === "in_progress").length;
    const completed = rows.filter((r) => r.status === "completed").length;
    const onHold = rows.filter((r) => r.status === "on_hold").length;
    const overdue = rows.filter((r) => r.deadline && new Date(r.deadline) < new Date() && r.status !== "completed").length;
    return { total: rows.length, active, completed, onHold, overdue };
  }, [rows]);

  // Build unique types for filter
  const typeOptions = useMemo(() => {
    const types = [...new Set(rows.map((r) => r.type).filter(Boolean))];
    return types.map((t) => ({ value: t!, label: t! }));
  }, [rows]);

  // Filter definitions
  const filters: FilterDef[] = [
    {
      type: "date-range",
      key: "start_date",
      label: "Start Date",
      accessor: (row: any) => row.start_date || row.startDate || null,
    },
    {
      key: "status",
      label: "Status",
      options: [
        { value: "planning", label: "Planning" },
        { value: "active", label: "Active" },
        { value: "in_progress", label: "In Progress" },
        { value: "on_hold", label: "On Hold" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
      ],
    },
    {
      key: "priority",
      label: "Priority",
      options: [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
        { value: "urgent", label: "Urgent" },
      ],
    },
    {
      key: "client",
      label: "Client",
      options: clients.map((c) => ({ value: c.id as string, label: c.name })),
      accessor: (row: any) => row.clientId || row.client_id || "",
    },
    ...(typeOptions.length > 0 ? [{
      key: "type",
      label: "Type",
      options: typeOptions,
    }] : []),
  ];

  const handleStatusChange = async (project: Project, newStatus: string) => {
    try {
      await update("projects", project.id, { ...project, status: newStatus });
      toast(`Project status changed to ${newStatus}`);
    } catch (err) {
      toast("Failed to update project status.");
    }
  };

  const formFields: FieldDef[] = [
    { name: "name", label: t("common.fields.projectName") || "Project name", type: "text", required: true },
    { name: "client_id", label: t("common.fields.client") + " (Optional)" || "Client (Optional)", type: "select", options: [{ value: "", label: "— No client —" }, ...clients.map((c) => ({ value: c.id as string, label: c.name }))] },
    { 
      name: "users", 
      label: t("common.fields.assignTeam") + " (Optional)" || "Assign Team Members (Optional)", 
      type: "multiselect", 
      options: users.map((u) => ({ 
        value: u.id as string, 
        label: u.name, 
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`,
        description: u.email 
      })) 
    },
    { 
      name: "type", 
      label: t("common.fields.type") || "Type", 
      type: "select", 
      defaultValue: "Web",
      options: [
        { value: "Web", label: "Web Application" },
        { value: "Mobile Application", label: "Mobile Application" },
        { value: "Desktop", label: "Desktop Application" },
        { value: "Web, Mobile & Desktop", label: "Web, Mobile & Desktop" },
      ]
    },
    { name: "tech_stack", label: t("common.fields.techStack") || "Tech Stack", type: "text", defaultValue: "Laravel + React" },
    { name: "language", label: t("common.fields.language") || "Programming Language", type: "text", defaultValue: "PHP / TypeScript" },
    {
      name: "priority",
      label: t("common.fields.priority") || "Priority",
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
      label: t("common.fields.status") || "Status",
      type: "select",
      defaultValue: "planning",
      options: [
        { value: "planning", label: "Planning" },
        { value: "in_progress", label: "In progress" },
        { value: "on_hold", label: "On hold" },
        { value: "completed", label: "Completed" },
      ],
    },
    { name: "budget", label: t("common.fields.budget") || "Budget (USD)", type: "number" },
    { name: "start_date", label: "Start Date", type: "date" },
    { name: "deadline", label: t("common.fields.deadline") || "Deadline", type: "date" },
    { name: "github_link", label: "GitHub Link", type: "text" },
    { name: "assets_link", label: "Assets Link", type: "text" },
    { name: "description", label: t("common.description") || "Description", type: "textarea" },
  ];

  const dashboardHeader = (
    <StaggerList className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" staggerDelay={0.05}>
      <StatCard label="Total Projects" value={stats.total} icon={FolderKanban} />
      <StatCard label="Active" value={stats.active} icon={FolderKanban} accent="primary" />
      <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} accent="success" />
      <StatCard label="On Hold" value={stats.onHold} icon={PauseCircle} accent="warning" />
      <StatCard label="Overdue" value={stats.overdue} icon={AlertTriangle} accent="destructive" />
    </StaggerList>
  );

  return (
    <ResourcePage<Project>
      title={t("nav.projects")}
      description="Every engagement from planning to launch"
      rows={rows}
      getSearchable={(r) => `${r.name} ${r.type} ${r.status} ${r.priority} ${r.description || ""}`}
      newLabel="New project"
      editingRow={editingRow}
      onCloseEdit={() => setEditingRow(null)}
      filters={filters}
      headerContent={dashboardHeader}
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
        { key: "client", header: "Client", cell: (r) => clients.find((c) => c.id === r.clientId)?.name ?? <span className="text-muted-foreground/50 italic">Portfolio</span> },
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
        { key: "duration", header: "Duration", cell: (r) => <span className="text-xs text-muted-foreground whitespace-nowrap">{shortDate((r as any).start_date || (r as any).startDate)} - {shortDate(r.deadline)}</span> },
        {
          key: "links",
          header: "Links",
          cell: (r) => (
            <div className="flex gap-2">
              {((r as any).github_link || (r as any).githubLink) && (
                <a href={(r as any).github_link || (r as any).githubLink} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary" title="GitHub Repository">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {((r as any).assets_link || (r as any).assetsLink) && (
                <a href={(r as any).assets_link || (r as any).assetsLink} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary" title="Project Assets">
                  <LinkIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          )
        },
        {
          key: "actions",
          header: "",
          cell: (r) => (
            <div className="flex items-center justify-end gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-full">
                  <MoreHorizontal className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleStatusChange(r, 'completed')}>Mark as Completed</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange(r, 'on_hold')}>Put on Hold</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange(r, 'active')}>Set to Active</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {canEdit && (
                <>
                  <button
                    className="text-primary hover:underline text-sm font-medium px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingRow(r);
                    }}
                  >
                    {t("common.edit") || "Edit"}
                  </button>
                  <ConfirmDeleteButton
                    onConfirm={async () => {
                      try {
                        await remove('projects', r.id);
                        toast('Project deleted');
                      } catch (e) {
                        toast('Delete failed');
                      }
                    }}
                    className="text-red-500 hover:text-red-700 text-sm font-medium px-2"
                  />
                </>
              )}
            </div>
          )
        }
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={async (v) => {
            try {
              await add("projects", {
                ...v,
                client_id: v.client_id || null,
                start_date: v.start_date ? new Date(v.start_date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
                deadline: v.deadline ? new Date(v.deadline).toISOString().split("T")[0] : new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
                budget: Number(v.budget || 0),
                github_link: v.github_link || null,
                assets_link: v.assets_link || null,
                progress: 0,
              });
              close();
            } catch (err: any) {
              console.error("Failed to add project", err);
              toast(err.response?.data?.message || "Failed to save project.");
            }
          }}
          fields={formFields}
        />
      )}
      renderEditForm={(row, close) => (
        <QuickForm
          submitLabel="Save Changes"
          initialValues={{
            name: row.name,
            client_id: (row as any).clientId || (row as any).client_id || "",
            type: (row as any).type || "",
            tech_stack: (row as any).tech_stack || (row as any).techStack || "",
            language: (row as any).language || "",
            users: (row as any).users || [],
            priority: row.priority || "medium",
            status: row.status || "planning",
            budget: row.budget || 0,
            start_date: (row as any).start_date || (row as any).startDate ? new Date((row as any).start_date || (row as any).startDate).toISOString().split("T")[0] : "",
            deadline: row.deadline ? new Date(row.deadline).toISOString().split("T")[0] : "",
            github_link: (row as any).github_link || (row as any).githubLink || "",
            assets_link: (row as any).assets_link || (row as any).assetsLink || "",
            description: row.description || "",
          }}
          onCancel={close}
          onSubmit={async (v) => {
            try {
              await update("projects", row.id, { ...row, ...v });
              toast("Project updated successfully.");
              close();
            } catch (err: any) {
              console.error("Failed to update project", err);
              toast("Failed to update project.");
            }
          }}
          fields={formFields}
        />
      )}
    />
  );
}
