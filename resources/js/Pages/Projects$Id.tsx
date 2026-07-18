import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/stat-card";
import { useCollection } from "@/mocks/store";
import { money, shortDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { DollarSign, Calendar, ListTodo, Bug } from "lucide-react";
import { DataTable } from "@/components/data-table";

export default function ProjectDetail() {
  const id = window.location.pathname.split("/").pop();
  const projects = useCollection("projects");
  const clients = useCollection("clients");
  const milestones = useCollection("milestones").filter((m) => m.projectId === id);
  const tasks = useCollection("tasks").filter((t) => t.projectId === id);
  const bugs = useCollection("bugs").filter((b) => b.projectId === id);
  const files = useCollection("files").filter((f) => f.projectId === id);
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" asChild>
          <Link href="/projects">
            <ArrowLeft className="me-1 h-4 w-4" />
            Back to projects
          </Link>
        </Button>
        <p className="text-muted-foreground">Project not found.</p>
      </div>
    );
  }
  const client = clients.find((c) => c.id === project.clientId);

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="w-fit">
        <Link href="/projects">
          <ArrowLeft className="me-1 h-4 w-4" />
          Back to projects
        </Link>
      </Button>

      <PageHeader
        title={project.name}
        description={project.description}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge value={project.priority} />
            <StatusBadge value={project.status} />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Budget" value={money(project.budget)} icon={DollarSign} />
        <StatCard label="Deadline" value={shortDate(project.deadline)} icon={Calendar} />
        <StatCard label="Tasks" value={tasks.length} icon={ListTodo} />
        <StatCard label="Bugs" value={bugs.length} icon={Bug} accent="destructive" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 font-display text-base font-semibold">Progress</h3>
          <div className="mb-6">
            <div className="mb-2 flex justify-between text-xs text-muted-foreground">
              <span>{project.progress}% complete</span>
              <span>{shortDate(project.deadline)}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-gradient-to-r from-primary to-primary/60" style={{ width: `${project.progress}%` }} />
            </div>
          </div>

          <Tabs defaultValue="milestones">
            <TabsList>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="bugs">Bugs</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>
            <TabsContent value="milestones" className="mt-4">
              <DataTable
                rows={milestones}
                searchable={false}
                columns={[
                  { key: "title", header: "Title", cell: (r) => <span className="font-medium">{r.title}</span> },
                  { key: "deadline", header: "Deadline", cell: (r) => shortDate(r.deadline) },
                  { key: "progress", header: "Progress", cell: (r) => `${r.progress}%` },
                  { key: "status", header: "Status", cell: (r) => <StatusBadge value={r.status} /> },
                ]}
              />
            </TabsContent>
            <TabsContent value="tasks" className="mt-4">
              <DataTable
                rows={tasks}
                searchable={false}
                columns={[
                  { key: "title", header: "Task", cell: (r) => <span className="font-medium">{r.title}</span> },
                  { key: "assignee", header: "Assignee", cell: (r) => r.assignee },
                  { key: "due", header: "Due", cell: (r) => shortDate(r.dueDate) },
                  { key: "priority", header: "Priority", cell: (r) => <StatusBadge value={r.priority} /> },
                  { key: "status", header: "Status", cell: (r) => <StatusBadge value={r.status} /> },
                ]}
              />
            </TabsContent>
            <TabsContent value="bugs" className="mt-4">
              <DataTable
                rows={bugs}
                searchable={false}
                columns={[
                  { key: "title", header: "Bug", cell: (r) => <span className="font-medium">{r.title}</span> },
                  { key: "severity", header: "Severity", cell: (r) => <StatusBadge value={r.severity} /> },
                  { key: "status", header: "Status", cell: (r) => <StatusBadge value={r.status} /> },
                  { key: "assignee", header: "Assigned to", cell: (r) => r.assignedTo },
                ]}
              />
            </TabsContent>
            <TabsContent value="files" className="mt-4">
              <DataTable
                rows={files}
                searchable={false}
                columns={[
                  { key: "name", header: "File", cell: (r) => <span className="font-medium">{r.name}</span> },
                  { key: "type", header: "Type", cell: (r) => r.type },
                  { key: "size", header: "Size", cell: (r) => `${(r.size / 1024).toFixed(0)} KB` },
                  { key: "uploader", header: "By", cell: (r) => r.uploadedBy },
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 font-display text-base font-semibold">Overview</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Client</dt><dd>{client?.name}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Type</dt><dd>{project.type}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Start</dt><dd>{shortDate(project.startDate)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Deadline</dt><dd>{shortDate(project.deadline)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Budget</dt><dd className="tabular-nums">{money(project.budget)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Priority</dt><dd><StatusBadge value={project.priority} /></dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd><StatusBadge value={project.status} /></dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
}
