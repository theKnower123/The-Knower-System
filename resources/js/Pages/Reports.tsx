import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { money } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText, TrendingUp, Users, FolderKanban, UsersRound, Loader2 } from "lucide-react";
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  headers: { Accept: "application/json" },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const reportCards = [
  { key: "sales", label: "Sales report", icon: TrendingUp, description: "Leads, quotes, and conversion" },
  { key: "finance", label: "Finance report", icon: FileText, description: "Revenue, expenses, and margin" },
  { key: "clients", label: "Clients report", icon: Users, description: "Growth and retention" },
  { key: "projects", label: "Projects report", icon: FolderKanban, description: "Delivery and health" },
  { key: "employees", label: "Employees report", icon: UsersRound, description: "Team performance and load" },
];

export default function ReportsPage() {
  const { t } = useTranslation();

  // ── Fetch all report data ──
  const { data: revenueData, isLoading: revLoading } = useQuery({
    queryKey: ["reports", "revenue"],
    queryFn: async () => {
      const res = await api.get("/reports/revenue");
      return res.data.data;
    },
  });

  const { data: financeData } = useQuery({
    queryKey: ["reports", "finance"],
    queryFn: async () => {
      const res = await api.get("/reports/finance");
      return res.data.data;
    },
  });

  const { data: projectsData } = useQuery({
    queryKey: ["reports", "projects"],
    queryFn: async () => {
      const res = await api.get("/reports/projects");
      return res.data.data;
    },
  });

  const { data: clientsData } = useQuery({
    queryKey: ["reports", "clients"],
    queryFn: async () => {
      const res = await api.get("/reports/clients");
      return res.data.data;
    },
  });

  const { data: employeesData } = useQuery({
    queryKey: ["reports", "employees"],
    queryFn: async () => {
      const res = await api.get("/reports/employees");
      return res.data.data;
    },
  });

  const totalRevenue = revenueData?.total_revenue || 0;
  const totalExpenses = revenueData?.total_expenses || 0;
  const totalClients = clientsData?.summary?.total || 0;
  const totalProjects = projectsData?.summary?.total || 0;
  const totalEmployees = employeesData?.summary?.total || 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("nav.reports")}
        description="Business insight across every module"
        actions={
          <>
            <Button variant="outline"><FileSpreadsheet className="me-1 h-4 w-4" />Excel</Button>
            <Button variant="outline"><Download className="me-1 h-4 w-4" />PDF</Button>
          </>
        }
      />

      {/* ── KPI Summary ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total revenue" value={money(totalRevenue)} icon={TrendingUp} accent="success" />
        <StatCard label="Total expenses" value={money(totalExpenses)} icon={FileText} accent="destructive" />
        <StatCard label="Net profit" value={money(totalRevenue - totalExpenses)} icon={TrendingUp} accent={totalRevenue - totalExpenses > 0 ? "success" : "destructive"} />
        <StatCard label="Unpaid invoices" value={financeData?.unpaid_invoices || 0} icon={FileText} accent="warning" delta={money(financeData?.total_unpaid || 0)} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Clients" value={totalClients} icon={Users} delta={`${clientsData?.summary?.active || 0} active`} />
        <StatCard label="Projects" value={totalProjects} icon={FolderKanban} delta={`${projectsData?.summary?.active || 0} active, ${projectsData?.summary?.overdue || 0} overdue`} />
        <StatCard label="Employees" value={totalEmployees} icon={UsersRound} delta={`${employeesData?.summary?.active || 0} active`} />
      </div>

      {/* ── Revenue Chart (Monthly breakdown) ── */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold">Revenue vs Expenses ({revenueData?.year || new Date().getFullYear()})</h3>
          {revLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData?.monthly || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                formatter={(v: any) => money(Number(v) || 0)}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="revenue" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="var(--chart-5)" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="profit" stroke="var(--chart-3)" strokeWidth={2} dot={{ r: 3 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Report Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reportCards.map((r) => (
          <div key={r.key} className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
            <div className="flex items-start justify-between">
              <div className="rounded-lg bg-primary/10 p-2 text-primary"><r.icon className="h-5 w-5" /></div>
              <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
            </div>
            <h4 className="mt-4 font-display font-semibold">{r.label}</h4>
            <p className="mt-1 text-xs text-muted-foreground">{r.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
