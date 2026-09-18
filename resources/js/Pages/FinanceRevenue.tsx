import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StaggerList } from "@/components/animations/StaggerList";
import { useCollection } from "@/mocks/store";
import { money } from "@/lib/format";
import { DollarSign, TrendingUp, TrendingDown, Percent, Wallet, CreditCard, ArrowDownRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function RevenuePage() {
  const { t } = useTranslation();
  const invoices = useCollection("invoices") || [];
  const payments = useCollection("payments") || [];
  const expenses = useCollection("expenses") || [];

  // Compute live revenue metrics
  const stats = useMemo(() => {
    // Total Paid collected from actual payments
    const totalCollected = payments.reduce((sum, p: any) => sum + (Number(p.amount) || 0), 0);

    // Paid from invoices if payments is empty
    const invoicePaidTotal = invoices.reduce((sum, i: any) => {
      if (i.status === "paid") return sum + (Number(i.amount) || 0);
      return sum + (Number(i.paidAmount || i.paid_amount) || 0);
    }, 0);

    const actualPaid = totalCollected > 0 ? totalCollected : invoicePaidTotal;

    // Outstanding amount from open/sent/partial/overdue invoices
    const outstanding = invoices.reduce((sum, i: any) => {
      if (i.status === "paid") return sum;
      const total = Number(i.amount) || 0;
      const paid = Number(i.paidAmount || i.paid_amount) || 0;
      return sum + Math.max(0, total - paid);
    }, 0);

    // Total Invoiced (Billed)
    const totalBilled = invoices.reduce((sum, i: any) => sum + (Number(i.amount) || 0), 0);

    // Total Expenses
    const totalExpenses = expenses.reduce((sum, e: any) => sum + (Number(e.amount) || 0), 0);

    // Gross Margin %
    const netProfit = actualPaid - totalExpenses;
    const margin = actualPaid > 0 ? Math.round((netProfit / actualPaid) * 100) : 0;

    return {
      actualPaid,
      outstanding,
      totalBilled,
      totalExpenses,
      netProfit,
      margin,
    };
  }, [invoices, payments, expenses]);

  // Compute Monthly Breakdown from actual payments and expenses
  const monthlySeries = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();

    const dataMap: Record<string, { month: string; revenue: number; expense: number }> = {};
    months.forEach((m) => {
      dataMap[m] = { month: m, revenue: 0, expense: 0 };
    });

    // Populate revenue from payments
    payments.forEach((p: any) => {
      const d = p.paidAt || p.paid_at || p.payment_date || p.createdAt || p.created_at;
      if (d) {
        const dateObj = new Date(d);
        if (!isNaN(dateObj.getTime())) {
          const mName = months[dateObj.getMonth()];
          if (dataMap[mName]) {
            dataMap[mName].revenue += Number(p.amount) || 0;
          }
        }
      }
    });

    // Fallback to invoices paid date if no payments registered
    if (payments.length === 0) {
      invoices.forEach((i: any) => {
        const d = i.paidAt || i.dueDate || i.createdAt || i.created_at;
        if (d && (i.status === "paid" || i.paidAmount > 0)) {
          const dateObj = new Date(d);
          if (!isNaN(dateObj.getTime())) {
            const mName = months[dateObj.getMonth()];
            if (dataMap[mName]) {
              dataMap[mName].revenue += Number(i.paidAmount || i.amount) || 0;
            }
          }
        }
      });
    }

    // Populate expenses
    expenses.forEach((e: any) => {
      const d = e.expense_date || e.date || e.createdAt || e.created_at;
      if (d) {
        const dateObj = new Date(d);
        if (!isNaN(dateObj.getTime())) {
          const mName = months[dateObj.getMonth()];
          if (dataMap[mName]) {
            dataMap[mName].expense += Number(e.amount) || 0;
          }
        }
      }
    });

    return Object.values(dataMap);
  }, [invoices, payments, expenses]);

  return (
    <div className="space-y-6">
      <PageHeader title={t("nav.revenue")} description="Live revenue, expenses, profit margin and financial metrics" />

      <StaggerList className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.05}>
        <StatCard label="Collected Revenue" value={money(stats.actualPaid)} icon={Wallet} accent="success" description="Total actual cash received" />
        <StatCard label="Outstanding Invoices" value={money(stats.outstanding)} icon={TrendingDown} accent="warning" description="Pending to collect" />
        <StatCard label="Total Billed" value={money(stats.totalBilled)} icon={TrendingUp} accent="primary" description="All issued invoices" />
        <StatCard label="Gross Margin" value={`${stats.margin}%`} icon={Percent} accent={stats.margin >= 0 ? "success" : "destructive"} description={`Net Profit: ${money(stats.netProfit)}`} />
      </StaggerList>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
          <div>
            <h3 className="font-display text-base font-semibold">Revenue vs Expenses</h3>
            <p className="text-xs text-muted-foreground">Monthly breakdown of income received vs expenses logged</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-[var(--chart-1)]" />
              <span className="text-muted-foreground">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-[var(--chart-3)]" />
              <span className="text-muted-foreground">Expenses</span>
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlySeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => `$${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`} />
              <Tooltip
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                formatter={(v) => money(Number(v))}
              />
              <Bar name="Revenue" dataKey="revenue" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              <Bar name="Expenses" dataKey="expense" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
