import { useTranslation } from "react-i18next";
import {
  Users,
  UserPlus,
  FolderKanban,
  Trophy,
  AlertOctagon,
  DollarSign,
  Wallet,
  FileWarning,
  LifeBuoy,
  Signal,
  Globe,
  ShieldAlert,
  ListTodo,
  Bug,
  FileText,
  CreditCard,
  ClipboardList,
  Briefcase,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";
import { StaggerList } from "@/components/animations/StaggerList";
import { StatCard } from "@/components/stat-card";
import { PageHeader } from "@/components/page-header";
import { useCollection } from "@/mocks/store";
import { money, shortDate } from "@/lib/format";
import { useAuth } from "@/store/auth";
import { StatusBadge } from "@/components/status-badge";
import { Link } from "@inertiajs/react";

// ─── Types ──────────────────────────────────────────────────────
interface AdminStats {
  total_clients: number;
  new_clients_this_month: number;
  active_projects: number;
  completed_projects: number;
  overdue_projects: number;
  pending_tasks: number;
  overdue_tasks: number;
  monthly_revenue: number;
  unpaid_invoices: number;
  unpaid_invoices_amount: number;
  open_tickets: number;
  online_employees: number;
  domains_expiring_soon: number;
  hosting_expiring_soon: number;
}

interface ClientStats {
  active_projects: number;
  open_tickets: number;
  unpaid_invoices: number;
  signed_contracts: number;
  total_payments: number;
}

interface DevStats {
  my_tasks_todo: number;
  my_tasks_in_progress: number;
  my_tasks_review: number;
  my_tasks_done: number;
  my_open_bugs: number;
}

interface HrStats {
  total_employees: number;
  online_employees: number;
  pending_leaves: number;
  open_job_postings: number;
}

interface DashboardProps {
  dashboardType: "admin" | "client" | "developer" | "hr";
  // Admin props
  stats?: AdminStats;
  recentProjects?: any[];
  recentTickets?: any[];
  revenueChart?: any[];
  tasksByStatus?: Record<string, number>;
  // Client props
  clientStats?: ClientStats;
  clientProjects?: any[];
  clientInvoices?: any[];
  clientTickets?: any[];
  clientContracts?: any[];
  // Developer props
  devStats?: DevStats;
  myTasks?: any[];
  myBugs?: any[];
  // HR props
  hrStats?: HrStats;
}

export default function DashboardPage(props: DashboardProps) {
  const { dashboardType = "admin" } = props;

  switch (dashboardType) {
    case "client":
      return <ClientDashboard {...props} />;
    case "developer":
      return <DeveloperDashboard {...props} />;
    case "hr":
      return <HRDashboard {...props} />;
    default:
      return <AdminDashboard {...props} />;
  }
}

// ═══════════════════════════════════════════════════════════════
// ADMIN / CEO / MANAGER DASHBOARD
// ═══════════════════════════════════════════════════════════════
function AdminDashboard({ stats, recentProjects, recentTickets, revenueChart, tasksByStatus }: DashboardProps) {
  const { t } = useTranslation();
  const user = useAuth((s) => s.user);
  const clients = useCollection("clients");
  const invoices = useCollection("invoices");
  const unpaid = invoices.filter((i) => i.status === "sent" || i.status === "overdue");

  const statusData = [
    { name: "In progress", value: stats?.active_projects || 0, fill: "var(--chart-1)" },
    { name: "Planning", value: tasksByStatus?.todo || 0, fill: "var(--chart-2)" },
    { name: "Completed", value: stats?.completed_projects || 0, fill: "var(--chart-3)" },
    { name: "Overdue", value: stats?.overdue_projects || 0, fill: "var(--chart-5)" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${t("dashboard.welcome")}, ${user?.name?.split(" ")[0] ?? ""} 👋`}
        description={t("app.tagline")}
      />

      <StaggerList className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.05}>
        <StatCard label={t("dashboard.clients")} value={stats?.total_clients || 0} icon={Users} delta={`+${stats?.new_clients_this_month || 0} this month`} accent="primary" />
        <StatCard label={t("dashboard.activeProjects")} value={stats?.active_projects || 0} icon={FolderKanban} />
        <StatCard label={t("dashboard.completedProjects")} value={stats?.completed_projects || 0} icon={Trophy} accent="success" />
        <StatCard label={t("dashboard.overdueProjects")} value={stats?.overdue_projects || 0} icon={AlertOctagon} accent="destructive" />
        <StatCard label={t("dashboard.monthlyRevenue")} value={money(stats?.monthly_revenue || 0)} icon={DollarSign} accent="success" />
        <StatCard label={t("dashboard.unpaidInvoices")} value={stats?.unpaid_invoices || 0} icon={FileWarning} accent="warning" delta={money(stats?.unpaid_invoices_amount || 0)} />
        <StatCard label={t("dashboard.openTickets")} value={stats?.open_tickets || 0} icon={LifeBuoy} accent="warning" />
        <StatCard label={t("dashboard.onlineEmployees")} value={stats?.online_employees || 0} icon={Signal} accent="success" />
        <StatCard label={t("dashboard.expiringDomains")} value={stats?.domains_expiring_soon || 0} icon={Globe} accent="warning" />
        <StatCard label={t("dashboard.expiringHosting")} value={stats?.hosting_expiring_soon || 0} icon={ShieldAlert} accent="warning" />
      </StaggerList>

      <StaggerList className="grid grid-cols-1 gap-4 lg:grid-cols-3" staggerDelay={0.1}>
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">{t("dashboard.revenueTrend")}</h3>
            <span className="text-xs text-muted-foreground">Last 6 months</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChart || []}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => money(Number(v))}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-display text-base font-semibold">{t("dashboard.projectsByStatus")}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {statusData.map((d, i) => (
                    <Cell key={i} fill={d.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </StaggerList>

      <StaggerList className="grid grid-cols-1 gap-4 lg:grid-cols-2" staggerDelay={0.2}>
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-display text-base font-semibold">{t("dashboard.recentActivity")}</h3>
          <ul className="space-y-3">
            {recentProjects?.map((p) => (
              <li key={p.id} className="flex items-start justify-between gap-3 border-b border-border/40 pb-3 last:border-none last:pb-0">
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.client?.name || "No Client"}</p>
                </div>
                <StatusBadge value={p.status} />
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-display text-base font-semibold">Unpaid invoices</h3>
          <ul className="space-y-3">
            {unpaid.map((i) => {
              const client = clients.find((c) => c.id === i.clientId);
              return (
                <li key={i.id} className="flex items-center justify-between gap-3 border-b border-border/40 pb-3 last:border-none last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{i.number}</p>
                    <p className="text-xs text-muted-foreground">{client?.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold tabular-nums">{money(i.amount)}</span>
                    <StatusBadge value={i.status} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </StaggerList>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CLIENT PORTAL DASHBOARD
// ═══════════════════════════════════════════════════════════════
function ClientDashboard({ clientStats, clientProjects, clientInvoices, clientTickets, clientContracts }: DashboardProps) {
  const { t } = useTranslation();
  const user = useAuth((s) => s.user);
  const stats = clientStats || { active_projects: 0, open_tickets: 0, unpaid_invoices: 0, signed_contracts: 0, total_payments: 0 };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${t("dashboard.welcome")}, ${user?.name?.split(" ")[0] ?? ""} 👋`}
        description="Your client portal — view projects, invoices, and support tickets."
      />

      <StaggerList className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.05}>
        <StatCard label="Active Projects" value={stats.active_projects} icon={FolderKanban} accent="primary" />
        <StatCard label="Open Tickets" value={stats.open_tickets} icon={LifeBuoy} accent="warning" />
        <StatCard label="Unpaid Invoices" value={stats.unpaid_invoices} icon={CreditCard} accent="destructive" />
        <StatCard label="Contracts" value={stats.signed_contracts} icon={FileText} accent="success" />
      </StaggerList>

      <StaggerList className="grid grid-cols-1 gap-4 lg:grid-cols-2" staggerDelay={0.1}>
        {/* My Projects */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">My Projects</h3>
            <Link href="/projects" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <ul className="space-y-3">
            {(clientProjects || []).length === 0 && (
              <p className="text-sm text-muted-foreground">No projects yet.</p>
            )}
            {(clientProjects || []).map((p: any) => (
              <li key={p.id} className="flex items-center justify-between gap-3 border-b border-border/40 pb-3 last:border-none last:pb-0">
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-primary" style={{ width: `${p.progress || 0}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{p.progress || 0}%</span>
                  </div>
                </div>
                <StatusBadge value={p.status} />
              </li>
            ))}
          </ul>
        </div>

        {/* My Invoices */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Recent Invoices</h3>
            <Link href="/finance/invoices" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <ul className="space-y-3">
            {(clientInvoices || []).length === 0 && (
              <p className="text-sm text-muted-foreground">No invoices yet.</p>
            )}
            {(clientInvoices || []).map((inv: any) => (
              <li key={inv.id} className="flex items-center justify-between gap-3 border-b border-border/40 pb-3 last:border-none last:pb-0">
                <div>
                  <p className="text-sm font-medium">{inv.number || `INV-${inv.id}`}</p>
                  <p className="text-xs text-muted-foreground">{shortDate(inv.due_date || inv.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold tabular-nums">{money(inv.amount || 0)}</span>
                  <StatusBadge value={inv.status} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* My Tickets */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Support Tickets</h3>
            <Link href="/support/tickets" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <ul className="space-y-3">
            {(clientTickets || []).length === 0 && (
              <p className="text-sm text-muted-foreground">No tickets.</p>
            )}
            {(clientTickets || []).map((t: any) => (
              <li key={t.id} className="flex items-center justify-between gap-3 border-b border-border/40 pb-3 last:border-none last:pb-0">
                <div>
                  <p className="text-sm font-medium">{t.subject}</p>
                  <p className="text-xs text-muted-foreground">{shortDate(t.created_at)}</p>
                </div>
                <StatusBadge value={t.status} />
              </li>
            ))}
          </ul>
        </div>

        {/* My Contracts */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Contracts</h3>
            <Link href="/crm/contracts" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <ul className="space-y-3">
            {(clientContracts || []).length === 0 && (
              <p className="text-sm text-muted-foreground">No contracts yet.</p>
            )}
            {(clientContracts || []).map((c: any) => (
              <li key={c.id} className="flex items-center justify-between gap-3 border-b border-border/40 pb-3 last:border-none last:pb-0">
                <div>
                  <p className="text-sm font-medium">{c.title || c.name || `Contract #${c.id}`}</p>
                  <p className="text-xs text-muted-foreground">{shortDate(c.start_date || c.created_at)}</p>
                </div>
                <StatusBadge value={c.status} />
              </li>
            ))}
          </ul>
        </div>
      </StaggerList>

      {/* Total payments card */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-display text-base font-semibold mb-2">Total Payments Made</h3>
        <p className="text-3xl font-bold tabular-nums text-primary">{money(stats.total_payments || 0)}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DEVELOPER / DESIGNER / QA DASHBOARD
// ═══════════════════════════════════════════════════════════════
function DeveloperDashboard({ devStats, myTasks, myBugs }: DashboardProps) {
  const { t } = useTranslation();
  const user = useAuth((s) => s.user);
  const stats = devStats || { my_tasks_todo: 0, my_tasks_in_progress: 0, my_tasks_review: 0, my_tasks_done: 0, my_open_bugs: 0 };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${t("dashboard.welcome")}, ${user?.name?.split(" ")[0] ?? ""} 👋`}
        description="Your assigned tasks and bugs at a glance."
      />

      <StaggerList className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5" staggerDelay={0.05}>
        <StatCard label="To Do" value={stats.my_tasks_todo} icon={ListTodo} />
        <StatCard label="In Progress" value={stats.my_tasks_in_progress} icon={FolderKanban} accent="primary" />
        <StatCard label="In Review" value={stats.my_tasks_review} icon={FileWarning} accent="warning" />
        <StatCard label="Done" value={stats.my_tasks_done} icon={Trophy} accent="success" />
        <StatCard label="Open Bugs" value={stats.my_open_bugs} icon={Bug} accent="destructive" />
      </StaggerList>

      <StaggerList className="grid grid-cols-1 gap-4 lg:grid-cols-2" staggerDelay={0.1}>
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-display text-base font-semibold">My Tasks</h3>
          <ul className="space-y-3">
            {(myTasks || []).length === 0 && <p className="text-sm text-muted-foreground">No active tasks.</p>}
            {(myTasks || []).map((t: any) => (
              <li key={t.id} className="flex items-center justify-between gap-3 border-b border-border/40 pb-3 last:border-none last:pb-0">
                <div>
                  <p className="text-sm font-medium">{t.title || t.name}</p>
                  <p className="text-xs text-muted-foreground">Due: {shortDate(t.due_date)}</p>
                </div>
                <StatusBadge value={t.status} />
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-display text-base font-semibold">My Bugs</h3>
          <ul className="space-y-3">
            {(myBugs || []).length === 0 && <p className="text-sm text-muted-foreground">No open bugs.</p>}
            {(myBugs || []).map((b: any) => (
              <li key={b.id} className="flex items-center justify-between gap-3 border-b border-border/40 pb-3 last:border-none last:pb-0">
                <div>
                  <p className="text-sm font-medium">{b.title || b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.priority}</p>
                </div>
                <StatusBadge value={b.status} />
              </li>
            ))}
          </ul>
        </div>
      </StaggerList>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HR DASHBOARD
// ═══════════════════════════════════════════════════════════════
function HRDashboard({ hrStats }: DashboardProps) {
  const { t } = useTranslation();
  const user = useAuth((s) => s.user);
  const stats = hrStats || { total_employees: 0, online_employees: 0, pending_leaves: 0, open_job_postings: 0 };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${t("dashboard.welcome")}, ${user?.name?.split(" ")[0] ?? ""} 👋`}
        description="Human Resources overview."
      />

      <StaggerList className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.05}>
        <StatCard label="Total Employees" value={stats.total_employees} icon={Users} accent="primary" />
        <StatCard label="Online Now" value={stats.online_employees} icon={Signal} accent="success" />
        <StatCard label="Pending Leaves" value={stats.pending_leaves} icon={ClipboardList} accent="warning" />
        <StatCard label="Open Postings" value={stats.open_job_postings} icon={Briefcase} />
      </StaggerList>
    </div>
  );
}
