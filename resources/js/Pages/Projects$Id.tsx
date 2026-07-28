import { Link } from "@inertiajs/react";
import { ArrowLeft, Github, ExternalLink, Code2, Layers, Users } from "lucide-react";
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
import { useAuth } from "@/store/auth";

export default function ProjectDetail() {
  const id = window.location.pathname.split("/").pop();
  const projects = useCollection("projects");
  const clients = useCollection("clients");
  const employees = useCollection("employees");
  const milestones = useCollection("milestones").filter((m) => m.projectId === id);
  const tasks = useCollection("tasks").filter((t) => t.projectId === id);
  const bugs = useCollection("bugs").filter((b) => b.projectId === id);
  const files = useCollection("files").filter((f) => f.projectId === id);
  const project = projects.find((p) => p.id === id);

  const { user } = useAuth();
  const isReadOnly = ["developer", "designer", "qa", "support", "accountant", "sales"].includes(user?.role || "");

  // Check if project exists and user is assigned if read-only
  const isAssigned = project
    ? ((project as any).users || []).some(
        (uid: string) => uid === String(user?.id) || uid === user?.name || uid === user?.email
      )
    : false;

  if (!project || (isReadOnly && !isAssigned)) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" asChild>
          <Link href="/projects">
            <ArrowLeft className="me-1 h-4 w-4" />
            Back to projects
          </Link>
        </Button>
        <p className="text-muted-foreground">
          {!project ? "Project not found." : "You do not have access to view this project."}
        </p>
      </div>
    );
  }

  const client = clients.find((c) => c.id === project.clientId);

  // Map assigned user IDs/names to employee details
  const teamMembers = ((project as any).users || [])
    .map((uid: string) => employees.find((e) => e.id === uid || e.name === uid || e.email === uid)?.name || uid)
    .filter(Boolean);

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
        {!isReadOnly && (
          <StatCard label="Budget" value={money(project.budget)} icon={DollarSign} />
        )}
        <StatCard label="Progress" value={`${project.progress || 0}%`} icon={Layers} accent="primary" />
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

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-display text-base font-semibold">Overview</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Client</dt><dd>{client?.name || "Portfolio"}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Type</dt><dd>{project.type}</dd></div>
              {(project as any).techStack || (project as any).tech_stack ? (
                <div className="flex justify-between"><dt className="text-muted-foreground">Tech Stack</dt><dd>{(project as any).techStack || (project as any).tech_stack}</dd></div>
              ) : null}
              {(project as any).language ? (
                <div className="flex justify-between"><dt className="text-muted-foreground">Language</dt><dd>{(project as any).language}</dd></div>
              ) : null}
              <div className="flex justify-between"><dt className="text-muted-foreground">Start</dt><dd>{shortDate((project as any).startDate || (project as any).start_date)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Deadline</dt><dd>{shortDate(project.deadline)}</dd></div>
              {!isReadOnly && (
                <div className="flex justify-between"><dt className="text-muted-foreground">Budget</dt><dd className="tabular-nums">{money(project.budget)}</dd></div>
              )}
              <div className="flex justify-between"><dt className="text-muted-foreground">Priority</dt><dd><StatusBadge value={project.priority} /></dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd><StatusBadge value={project.status} /></dd></div>
            </dl>
          </div>

          {/* Links & Repository Box */}
          {((project as any).github_link || (project as any).githubLink || (project as any).assets_link || (project as any).assetsLink) && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-3">
              <h3 className="font-display text-base font-semibold flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" /> Project Resources
              </h3>
              <div className="space-y-2">
                {((project as any).github_link || (project as any).githubLink) && (
                  <a
                    href={(project as any).github_link || (project as any).githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-2.5 text-xs transition-colors hover:border-primary hover:bg-muted"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <Github className="h-4 w-4" /> GitHub Repository
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                )}
                {((project as any).assets_link || (project as any).assetsLink) && (
                  <a
                    href={(project as any).assets_link || (project as any).assetsLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-2.5 text-xs transition-colors hover:border-primary hover:bg-muted"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <ExternalLink className="h-4 w-4" /> Project Assets / Files
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Team Members Box */}
          {teamMembers.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-3">
              <h3 className="font-display text-base font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Team Assigned ({teamMembers.length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {teamMembers.map((m: string, idx: number) => (
                  <span key={idx} className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

