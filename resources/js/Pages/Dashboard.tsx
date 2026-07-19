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
import { useCollection, seed } from "@/mocks/store";
import { money } from "@/lib/format";
import { useAuth } from "@/store/auth";
import { StatusBadge } from "@/components/status-badge";

interface DashboardProps {
  stats: {
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
  };
  recentProjects: any[];
  recentTickets: any[];
  revenueChart: any[];
  tasksByStatus: Record<string, number>;
}

export default function DashboardPage({ stats, recentProjects, recentTickets, revenueChart, tasksByStatus }: DashboardProps) {
  const { t } = useTranslation();
  const user = useAuth((s) => s.user);
  
  // We'll still need clients and notifications for the recent activity list
  const clients = useCollection("clients");
  const notifications = useCollection("notifications");
  const invoices = useCollection("invoices");
  
  // Filter unpaid invoices for the list
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
            <span className="text-xs text-muted-foreground">Last 8 months</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChart || []}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
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
                <Area type="monotone" dataKey="expense" stroke="var(--chart-3)" strokeWidth={2} fill="url(#exp)" />
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
                <Tooltip
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                />
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
