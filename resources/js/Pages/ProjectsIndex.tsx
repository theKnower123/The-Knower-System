import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm, type FieldDef } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { useCollection, add, remove, update } from "@/mocks/store";
import { makeId, type Project } from "@/mocks/data";
import { money, shortDate, normalizeExternalUrl, githubRepoLabel } from "@/lib/format";
import { MoreHorizontal, FolderKanban, CheckCircle2, PauseCircle, AlertTriangle, Github, Globe } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/store/auth";
import { roleHas, type Role } from "@/lib/permissions";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { EditIconButton } from "@/components/edit-icon-button";
import { StaggerList } from "@/components/animations/StaggerList";
import type { FilterDef } from "@/components/data-table";

export default function ProjectsPage() {
  const { user } = useAuth();
  const canEdit = user ? roleHas(user.role as Role, "project.manage") : false;
  const isClient = user?.role === "client";

  const { t } = useTranslation();
  const rows = useCollection("projects");
  const clients = useCollection("clients");
  const users = useCollection("employees"); 
  const [editingRow, setEditingRow] = useState<Project | null>(null);

  // Roles that see only their assigned projects (read-only)
  const isReadOnly = user ? ["developer", "designer", "qa"].includes(user.role) : false;

  // Leadership / finance can see budget & deadlines; ICs (devs/designers/QA) cannot.
  const canSeeCommercial = user
    ? ["super_admin", "ceo", "project_manager", "team_leader", "accountant"].includes(user.role)
      || roleHas(user.role as Role, "project.manage")
      || roleHas(user.role as Role, "finance.view")
    : false;

  const teamMemberOptions = useMemo(
    () =>
      users
        .filter((u: any) => u.userId || u.user_id)
        .map((u: any) => ({
          value: String(u.userId || u.user_id),
          label: u.name || u.email || `User ${u.userId || u.user_id}`,
          description: u.email || u.role || undefined,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name || u.email || "TM")}`,
        })),
    [users]
  );

  const visibleRows = useMemo(() => {
    if (!user) return rows;
    if (user.role === "client") {
      return rows.filter((r) => String(r.clientId || (r as any).client_id) === String((user as any).client_id || user.id));
    }
    if (isReadOnly) {
      return rows.filter((r: any) => {
        const assignedIds = r.users ? (Array.isArray(r.users) ? r.users.map((u: any) => typeof u === 'object' ? String(u.id) : String(u)) : []) : [];
        return assignedIds.includes(String(user.id)) || String(r.createdBy || r.created_by) === String(user.id);
      });
    }
    return rows;
  }, [rows, user, isReadOnly]);

  // Mini Dashboard Calculation
  const stats = useMemo(() => {
    const total = visibleRows.length;
    const active = visibleRows.filter((r) => r.status === "active" || r.status === "in_progress").length;
    const completed = visibleRows.filter((r) => r.status === "completed").length;
    const onHold = visibleRows.filter((r) => r.status === "on_hold").length;
    const overdue = visibleRows.filter((r) => r.status === "overdue" || (r.deadline && new Date(r.deadline) < new Date() && r.status !== "completed")).length;

    return { total, active, completed, onHold, overdue };
  }, [visibleRows]);

  const handleStatusChange = async (project: Project, newStatus: string) => {
    if (!canEdit) {
      toast.error("You do not have permission to update project status.");
      return;
    }
    try {
      await update("projects", project.id, { status: newStatus });
      toast.success(`Project status updated to ${newStatus}`);
    } catch (err: any) {
      console.error("Failed to update project status", err);
      toast.error(err?.response?.data?.message || "Failed to update status");
    }
  };

  const handleLandingPageToggle = async (project: Project) => {
    if (!canEdit) {
      toast.error("Only administrators can change project visibility.");
      return;
    }
    const current = Boolean((project as any).is_public ?? (project as any).isPublic ?? (project as any).show_in_portfolio ?? true);
    const updatedValue = !current;
    try {
      await update("projects", project.id, { 
        is_public: updatedValue 
      });
      toast.success(updatedValue ? "Project will appear on the Landing Page" : "Project hidden from Landing Page");
    } catch (err: any) {
      console.error("Failed to toggle landing page visibility", err);
      toast.error(err?.response?.data?.message || "Failed to update visibility");
    }
  };

  const formFields: FieldDef[] = [
    { name: "name", label: "Project Name", type: "text", required: true },
    { name: "client_id", label: "Client (Optional)", type: "select", options: [{ value: "", label: "— No client —" }, ...clients.map((c) => ({ value: c.id as string, label: c.name }))] },
    { 
      name: "users", 
      label: "Assign Team Members (Optional)", 
      type: "multiselect", 
      options: teamMemberOptions,
    },
    { 
      name: "type", 
      label: "Type", 
      type: "select", 
      defaultValue: "Web",
      options: [
        { value: "Web", label: "Web Application" },
        { value: "Mobile Application", label: "Mobile Application" },
        { value: "Desktop", label: "Desktop Application" },
        { value: "Web, Mobile & Desktop", label: "Web, Mobile & Desktop" },
      ]
    },
    { name: "tech_stack", label: "Tech Stack", type: "text", defaultValue: "Laravel + React" },
    { name: "language", label: "Programming Language", type: "text", defaultValue: "PHP / TypeScript" },
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
    {
      name: "is_public",
      label: "Show on Public Landing Page / Portfolio",
      type: "select",
      defaultValue: "true",
      options: [
        { value: "true", label: "Yes — Show on Landing Page" },
        { value: "false", label: "No — Hide from Landing Page" },
      ],
    },
    { name: "budget", label: "Budget (USD)", type: "number" },
    { name: "start_date", label: "Start Date", type: "date" },
    { name: "deadline", label: "Deadline", type: "date" },
    { name: "github_link", label: "GitHub Repository Link", type: "text" },
    { name: "images", label: "Image Assets (Up to 5 images)", type: "image_assets" },
    { name: "description", label: "Details / Description", type: "textarea" },
  ];

  const filters: FilterDef[] = [
    {
      key: "status",
      label: t("common.status"),
      type: "select",
      options: [
        { value: "planning", label: "Planning" },
        { value: "in_progress", label: "In Progress" },
        { value: "on_hold", label: "On Hold" },
        { value: "completed", label: "Completed" },
        { value: "overdue", label: "Overdue" },
      ],
    },
    {
      key: "priority",
      label: t("common.priority"),
      type: "select",
      options: [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
      ],
    },
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
      collectionKey="projects"
      title={t("nav.projects")}
      description={isReadOnly || isClient ? "Your projects & engagements" : "Every engagement from planning to launch"}
      rows={visibleRows}
      getSearchable={(r) => `${r.name} ${r.type} ${r.status} ${r.priority} ${r.description || ""}`}
      newLabel="New project"
      editingRow={editingRow}
      onCloseEdit={() => setEditingRow(null)}
      filters={filters}
      headerContent={dashboardHeader}
      hideNewButton={!canEdit}
      hideTrashButton={!canEdit}
      collectionKey="projects"
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
        ...(isClient ? [] : [{
          key: "client",
          header: "Client",
          cell: (r: any) => clients.find((c) => c.id === r.clientId)?.name ?? <span className="text-muted-foreground/50 italic">Portfolio</span>
        }]),
        { key: "type", header: "Type", cell: (r) => <span className="text-muted-foreground">{r.type}</span> },
        { key: "priority", header: t("common.priority"), cell: (r) => <StatusBadge value={r.priority} /> },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
        ...(canEdit ? [{
          key: "landing",
          header: "Landing Page",
          cell: (r: any) => {
            const isPub = Boolean(r.is_public ?? r.isPublic ?? r.show_in_portfolio ?? true);
            return (
              <Button
                size="sm"
                variant={isPub ? "default" : "outline"}
                className={`h-7 px-2.5 text-xs gap-1.5 ${isPub ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'text-muted-foreground'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLandingPageToggle(r);
                }}
              >
                <Globe className="h-3.5 w-3.5" />
                {isPub ? "On Landing" : "Hidden"}
              </Button>
            );
          }
        }] : []),
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
        ...(canSeeCommercial ? [{ key: "budget", header: "Budget", cell: (r: any) => <span className="tabular-nums">{money(r.budget ?? 0)}</span> }] : []),
        {
          key: "duration",
          header: canSeeCommercial ? "Duration" : "Start",
          cell: (r: any) => (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {canSeeCommercial
                ? `${shortDate(r.start_date || r.startDate)} - ${shortDate(r.deadline)}`
                : shortDate(r.start_date || r.startDate)}
            </span>
          ),
        },
        {
          key: "links",
          header: "GitHub",
          cell: (r) => {
            const raw = (r as any).githubLink || (r as any).github_link;
            const href = normalizeExternalUrl(raw);
            if (!href) return <span className="text-xs text-muted-foreground">—</span>;
            return (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex max-w-[180px] items-center gap-1.5 text-primary hover:underline"
                title={href}
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="h-4 w-4 shrink-0" />
                <span className="truncate text-xs font-medium">{githubRepoLabel(raw)}</span>
              </a>
            );
          }
        },
        ...(canEdit ? [{
          key: "actions",
          header: "",
          cell: (r: any) => (
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
              <EditIconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingRow(r);
                    }}
                  />
              <ConfirmDeleteButton
                onConfirm={async () => {
                  try {
                    await remove('projects', r.id);
                    toast.success('Project moved to Trash');
                  } catch (e) {
                    toast.error('Delete failed');
                  }
                }}
              />
            </div>
          )
        }] : [])
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={async (v) => {
            try {
              await add("projects", {
                ...v,
                client_id: v.client_id || null,
                is_public: v.is_public === "true",
                images: v.images || [],
                start_date: v.start_date ? new Date(v.start_date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
                deadline: v.deadline ? new Date(v.deadline).toISOString().split("T")[0] : new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
                budget: Number(v.budget || 0),
                github_link: normalizeExternalUrl(v.github_link) || null,
                progress: 0,
              });
              toast.success("Project created successfully.");
              close();
            } catch (err: any) {
              console.error("Failed to add project", err);
              const errMsg = err?.response?.data?.message || (err?.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(', ') : err.message || "Failed to save project.");
              toast.error(errMsg);
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
            users: ((row as any).users || []).map((u: any) => String(typeof u === "object" ? u.id : u)),
            priority: row.priority || "medium",
            status: row.status || "planning",
            is_public: ((row as any).is_public ?? (row as any).isPublic ?? true) ? "true" : "false",
            images: (row as any).images || [],
            budget: row.budget || 0,
            start_date: (row as any).start_date || (row as any).startDate ? new Date((row as any).start_date || (row as any).startDate).toISOString().split("T")[0] : "",
            deadline: row.deadline ? new Date(row.deadline).toISOString().split("T")[0] : "",
            github_link: (row as any).github_link || (row as any).githubLink || "",
            description: row.description || "",
          }}
          onCancel={close}
          onSubmit={async (v) => {
            try {
              const isPublicBool = v.is_public === "true";
              await update("projects", row.id, { 
                is_public: isPublicBool,
                name: v.name,
                client_id: v.client_id || null,
                type: v.type,
                tech_stack: v.tech_stack,
                language: v.language,
                users: Array.isArray(v.users) ? v.users.map(String) : [],
                priority: v.priority,
                status: v.status,
                images: v.images || [],
                budget: Number(v.budget || 0),
                start_date: v.start_date || null,
                deadline: v.deadline || null,
                github_link: normalizeExternalUrl(v.github_link) || null,
                description: v.description || null
              });
              toast.success("Project updated successfully.");
              close();
            } catch (err: any) {
              console.error("Failed to update project", err);
              const errMsg = err?.response?.data?.message || (err?.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(', ') : err.message || "Failed to update project.");
              toast.error(errMsg);
            }
          }}
          fields={formFields}
        />
      )}
    />
  );
}
