import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/stat-card";
import { StaggerList } from "@/components/animations/StaggerList";
import { useCollection } from "@/mocks/store";
import { money } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Download, DollarSign, Users, TrendingUp, BarChart3 } from "lucide-react";

export default function PayrollPage() {
  const { t } = useTranslation();
  const employees = useCollection("employees");

  // Mini Dashboard Calculation
  const stats = useMemo(() => {
    const totalCount = employees.length;
    const totalPayroll = employees.reduce((s, e: any) => s + (Number(e.salary) || 0), 0);
    const avgSalary = totalCount > 0 ? Math.round(totalPayroll / totalCount) : 0;
    const maxSalary = employees.reduce((max, e: any) => Math.max(max, Number(e.salary) || 0), 0);

    return { totalCount, totalPayroll, avgSalary, maxSalary };
  }, [employees]);

  const dashboardHeader = (
    <StaggerList className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6" staggerDelay={0.05}>
      <StatCard label="Total Monthly Payroll" value={money(stats.totalPayroll)} icon={DollarSign} accent="success" />
      <StatCard label="Employees on Payroll" value={stats.totalCount} icon={Users} accent="primary" />
      <StatCard label="Average Salary" value={money(stats.avgSalary)} icon={BarChart3} accent="warning" />
      <StatCard label="Highest Salary" value={money(stats.maxSalary)} icon={TrendingUp} />
    </StaggerList>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("nav.payroll")}
        description="Monthly employee salaries and payroll breakdown"
        actions={
          <Button variant="outline">
            <Download className="me-1 h-4 w-4" />
            Export Payroll
          </Button>
        }
      />

      {dashboardHeader}

      <div className="rounded-xl border border-border bg-card shadow-sm p-4">
        <DataTable
          rows={employees}
          columns={[
            { key: "name", header: t("common.name"), cell: (r) => <span className="font-medium">{r.name}</span> },
            { key: "department", header: "Department", cell: (r) => r.department || "—" },
            { key: "position", header: "Position", cell: (r) => r.position || "—" },
            { key: "salary", header: "Salary", cell: (r) => <span className="font-semibold tabular-nums text-green-600">{money(r.salary)}</span> },
            { key: "status", header: "Status", cell: (r) => <StatusBadge value={r.status || "active"} /> },
          ]}
        />
      </div>
    </div>
  );
}
