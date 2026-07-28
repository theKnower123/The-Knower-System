import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/stat-card";
import { useCollection, add, update, remove } from "@/mocks/store";
import { makeId, type Task } from "@/mocks/data";
import { shortDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/auth";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { QuickForm, type FieldDef } from "@/components/quick-form";
import { DataTable, type FilterDef } from "@/components/data-table";
import { StaggerList } from "@/components/animations/StaggerList";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  ListTodo,
  CheckCircle2,
  Clock,
  AlertTriangle,
  LayoutGrid,
  List,
  MoreHorizontal,
} from "lucide-react";

const COLUMNS: Array<{ key: Task["status"]; label: string }> = [
  { key: "todo", label: "To do" },
  { key: "in_progress", label: "In progress" },
  { key: "review", label: "Review" },
  { key: "done", label: "Done" },
];

export default function TasksPage() {
  const { t } = useTranslation();
  const allTasks = useCollection("tasks");
  const projects = useCollection("projects");
  const users = useCollection("employees");
  const departments = useCollection("departments");
  const { user } = useAuth();

  // Determine the current user's department from employee records
  const currentEmployee = users.find((u: any) => u.email === user?.email || u.name === user?.name);
  const currentDepartment = (currentEmployee as any)?.department || null;

  // Admins see all tasks; others see only tasks for their department
  const canSeeAllTasks = ["super_admin", "ceo", "project_manager"].includes(user?.role || "");
  const tasks = canSeeAllTasks
    ? allTasks
    : allTasks.filter((t: any) => !t.departmentId || t.departmentId === currentDepartment);

  const [viewMode, setViewMode] = useState<"kanban" | "table">("table");
  const [formOpen, setFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Task | null>(null);

  const canEdit = ["super_admin", "ceo", "project_manager", "team_leader", "hr"].includes(user?.role || "");

  // Stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === "todo").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const review = tasks.filter((t) => t.status === "review").length;
    const done = tasks.filter((t) => t.status === "done").length;
    const overdue = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done").length;
    return { total, todo, inProgress, review, done, overdue };
  }, [tasks]);

  const move = (id: string, status: Task["status"]) => update("tasks", id, { status });

  // Filters for table view
  const filters: FilterDef[] = [
    {
      key: "project",
      label: "Project",
      options: projects.map((p) => ({ value: p.id as string, label: p.name })),
      accessor: (row: any) => row.projectId || row.project_id || "",
    },
    {
      key: "status",
      label: "Status",
      options: [
        { value: "todo", label: "To Do" },
        { value: "in_progress", label: "In Progress" },
        { value: "review", label: "Review" },
        { value: "done", label: "Done" },
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
    ...(canSeeAllTasks ? [{
      key: "departmentId",
      label: "Department",
      options: departments.map((d: any) => ({ value: d.name, label: d.name })),
      accessor: (row: any) => row.departmentId || "",
    }] : []),
  ];

  const formFields: FieldDef[] = [
    { name: "title", label: "Task Title", type: "text", required: true },
    { name: "projectId", label: "Project", type: "select", options: projects.map((p) => ({ value: p.id as string, label: p.name })), required: true },
    { 
      name: "departmentId", 
      label: "Department", 
      type: "select", 
      options: [
        { value: "", label: "— All Departments —" },
        ...departments.map((d: any) => ({ value: d.name, label: d.name }))
      ],
      defaultValue: currentDepartment || "",
    },
    { name: "assigned_to", label: "Assignee", type: "select", options: [{ value: "", label: "— Unassigned —" }, ...users.map((u) => ({ value: u.id as string, label: u.name }))] },
    {
      name: "priority",
      label: "Priority",
      type: "select",
      defaultValue: "medium",
      options: [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
        { value: "urgent", label: "Urgent" },
      ],
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      defaultValue: "todo",
      options: [
        { value: "todo", label: "To Do" },
        { value: "in_progress", label: "In Progress" },
        { value: "review", label: "Review" },
        { value: "done", label: "Done" },
      ],
    },
    { name: "due_date", label: "Due Date", type: "date" },
    { name: "estimated_hours", label: "Estimated Hours", type: "number" },
    { name: "description", label: "Details", type: "textarea" },
  ];

  // Grouped tasks for kanban
  const groupedTasks = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const pId = task.projectId || "unassigned";
    if (!acc[pId]) acc[pId] = [];
    acc[pId].push(task);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("nav.tasks")}
        description="Manage all tasks across your projects"
        actions={
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center rounded-lg border border-border bg-muted/30 p-0.5">
              <button
                onClick={() => setViewMode("table")}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  viewMode === "table" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  viewMode === "kanban" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>

            {canEdit && (
              <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="me-1 h-4 w-4" />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>New Task</DialogTitle>
                    <DialogDescription>Fill the details below.</DialogDescription>
                  </DialogHeader>
                  <QuickForm
                    onCancel={() => setFormOpen(false)}
                    onSubmit={async (v) => {
                      try {
                        await add("tasks", {
                          id: makeId("tk"),
                          title: v.title,
                          projectId: v.projectId,
                          departmentId: v.departmentId || currentDepartment || "",
                          assignee: users.find((u) => u.id === v.assigned_to)?.name || "Unassigned",
                          assigned_to: v.assigned_to || null,
                          priority: v.priority || "medium",
                          status: v.status || "todo",
                          dueDate: v.due_date ? new Date(v.due_date).toISOString() : null,
                          estimated_hours: Number(v.estimated_hours || 0),
                          description: v.description || "",
                        });
                        toast("Task created successfully.");
                        setFormOpen(false);
                      } catch (err: any) {
                        toast(err.response?.data?.message || "Failed to create task.");
                      }
                    }}
                    fields={formFields}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        }
      />

      {/* Stats Dashboard */}
      <StaggerList className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" staggerDelay={0.05}>
        <StatCard label="Total Tasks" value={stats.total} icon={ListTodo} />
        <StatCard label="To Do" value={stats.todo} icon={ListTodo} accent="primary" />
        <StatCard label="In Progress" value={stats.inProgress} icon={Clock} accent="warning" />
        <StatCard label="In Review" value={stats.review} icon={Clock} />
        <StatCard label="Completed" value={stats.done} icon={CheckCircle2} accent="success" />
        <StatCard label="Overdue" value={stats.overdue} icon={AlertTriangle} accent="destructive" />
      </StaggerList>

      {/* Table View */}
      {viewMode === "table" && (
        <DataTable
          rows={tasks}
          getSearchable={(r) => `${r.title} ${r.assignee || ""} ${r.status} ${r.priority}`}
          filters={filters}
          columns={[
            { key: "title", header: "Task", cell: (r) => <span className="font-medium">{r.title}</span> },
            {
              key: "project",
              header: "Project",
              cell: (r) => {
                const p = projects.find((p) => p.id === r.projectId);
                return <span className="text-muted-foreground text-xs">{p?.name || "—"}</span>;
              },
              hideOnMobile: true,
            },
            { key: "assignee", header: "Assignee", cell: (r) => r.assignee || "—", hideOnMobile: true },
            { key: "priority", header: "Priority", cell: (r) => <StatusBadge value={r.priority} /> },
            { key: "status", header: "Status", cell: (r) => <StatusBadge value={r.status} /> },
            { key: "due", header: "Due Date", cell: (r) => <span className="text-xs text-muted-foreground">{shortDate(r.dueDate)}</span>, hideOnMobile: true },
            {
              key: "actions",
              header: "",
              cell: (r) => (
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-full">
                    <MoreHorizontal className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {COLUMNS.filter((c) => c.key !== r.status).map((c) => (
                      <DropdownMenuItem key={c.key} onClick={() => move(r.id, c.key)}>
                        Move to {c.label}
                      </DropdownMenuItem>
                    ))}
                    {canEdit && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setEditingRow(r)}>Edit Task</DropdownMenuItem>
                        <ConfirmDeleteButton
                          asChild
                          onConfirm={async () => {
                            try {
                              await remove("tasks", r.id);
                              toast("Task deleted.");
                            } catch {
                              toast("Failed to delete task.");
                            }
                          }}
                        >
                          <DropdownMenuItem
                            className="text-red-600 focus:bg-red-50"
                            onSelect={(e) => e.preventDefault()}
                          >
                            Delete Task
                          </DropdownMenuItem>
                        </ConfirmDeleteButton>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ),
            },
          ]}
        />
      )}

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="space-y-10">
          {Object.entries(groupedTasks).map(([projectId, projectTasks]) => {
            const project = projects.find((p) => p.id === projectId);
            const projectName = project ? project.name : "Unassigned Tasks";
            
            return (
              <div key={projectId} className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <h2 className="font-display text-lg font-bold text-foreground">{projectName}</h2>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {projectTasks.length} {t("nav.tasks")}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {COLUMNS.map((col) => {
                    const items = projectTasks.filter((t) => t.status === col.key);
                    return (
                      <div key={col.key} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="font-display text-sm font-semibold">{col.label}</h3>
                          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{items.length}</span>
                        </div>
                        <div className="space-y-2">
                          {items.length === 0 && (
                            <p className="rounded-md border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
                              Empty
                            </p>
                          )}
                          {items.map((task) => (
                            <div
                              key={task.id}
                              className="group rounded-lg border border-border bg-background p-3 transition-colors hover:border-primary/40"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-medium leading-snug">{task.title}</p>
                                <StatusBadge value={task.priority} />
                              </div>
                              {(task as any).description && (
                                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                                  {(task as any).description}
                                </p>
                              )}
                              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                                <span>{task.assignee}</span>
                                <span>{shortDate(task.dueDate)}</span>
                              </div>
                              <div className="mt-3 flex gap-1">
                                {COLUMNS.filter((c) => c.key !== task.status).map((c) => (
                                  <button
                                    key={c.key}
                                    onClick={() => move(task.id, c.key)}
                                    className={cn(
                                      "flex-1 rounded border border-border/60 py-1 text-[10px] transition-colors hover:border-primary hover:text-primary opacity-0 transition-opacity group-hover:opacity-100",
                                    )}
                                  >
                                    → {c.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {Object.keys(groupedTasks).length === 0 && (
            <div className="rounded-xl border border-dashed border-border/60 p-10 text-center text-muted-foreground">
              No tasks yet. Create your first task to get started.
            </div>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      {editingRow && (
        <Dialog open={!!editingRow} onOpenChange={(v) => !v && setEditingRow(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <QuickForm
              submitLabel="Save Changes"
              initialValues={{
                title: editingRow.title,
                projectId: editingRow.projectId || "",
                assigned_to: (editingRow as any).assigned_to || "",
                priority: editingRow.priority || "medium",
                status: editingRow.status || "todo",
                due_date: editingRow.dueDate ? new Date(editingRow.dueDate).toISOString().split("T")[0] : "",
                estimated_hours: (editingRow as any).estimated_hours || "",
                description: (editingRow as any).description || "",
              }}
              onCancel={() => setEditingRow(null)}
              onSubmit={async (v) => {
                try {
                  await update("tasks", editingRow.id, {
                    ...editingRow,
                    ...v,
                    assignee: users.find((u) => u.id === v.assigned_to)?.name || editingRow.assignee || "Unassigned",
                    dueDate: v.due_date ? new Date(v.due_date).toISOString() : editingRow.dueDate,
                  });
                  toast("Task updated successfully.");
                  setEditingRow(null);
                } catch (err: any) {
                  toast("Failed to update task.");
                }
              }}
              fields={formFields}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
