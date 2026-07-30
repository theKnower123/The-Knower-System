import { useMemo } from 'react';
import { toast } from 'sonner';
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { useAuth } from "@/store/auth";
import { roleHas, type Role } from "@/lib/permissions";
import { QuickForm } from "@/components/quick-form";
import { StatCard } from "@/components/stat-card";
import { StaggerList } from "@/components/animations/StaggerList";
import { useCollection, add, remove } from "@/mocks/store";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { type Department } from "@/mocks/data";
import { Building2, Users, UserCheck, BarChart3 } from "lucide-react";

export default function DepartmentsPage() {
  const { user } = useAuth();
  const canEdit = user ? roleHas(user.role as Role, "hr.manage") : false;

  const { t } = useTranslation();
  const rows = useCollection("departments");
  const employees = useCollection("employees");

  // Mini Dashboard Calculation
  const stats = useMemo(() => {
    const totalCount = rows.length;
    const totalHeadcount = rows.reduce((sum, r: any) => sum + (Number(r.employeeCount || r.employee_count) || 0), 0) || employees.length;
    const deptsWithHead = rows.filter((r: any) => r.head && r.head.trim() !== "").length;
    const avgStaff = totalCount > 0 ? Math.round(totalHeadcount / totalCount) : 0;

    return { totalCount, totalHeadcount, deptsWithHead, avgStaff };
  }, [rows, employees]);

  const dashboardHeader = (
    <StaggerList className="grid grid-cols-2 gap-3 sm:grid-cols-4" staggerDelay={0.05}>
      <StatCard label="Total Departments" value={stats.totalCount} icon={Building2} />
      <StatCard label="Total Staff Assigned" value={stats.totalHeadcount} icon={Users} accent="primary" />
      <StatCard label="Departments w/ Head" value={stats.deptsWithHead} icon={UserCheck} accent="success" />
      <StatCard label="Avg. Staff per Dept" value={stats.avgStaff} icon={BarChart3} accent="warning" />
    </StaggerList>
  );

  // Only team leaders can be department heads
  const teamLeaderOptions = [
    { value: "", label: "— No Head Assigned —" },
    ...employees
      .filter((e: any) => e.role === "team_leader" || e.role === "ceo" || e.role === "project_manager")
      .map((e: any) => ({ value: e.name, label: e.name })),
  ];

  return (
    <ResourcePage<Department>
      hideNewButton={!canEdit}
      hideTrashButton={!canEdit}
      collectionKey="departments"
      title={t("nav.departments")}
      description="Company org chart & departmental breakdown"
      rows={rows}
      headerContent={dashboardHeader}
      newLabel="New department"
      columns={[
        { key: "name", header: t("common.name"), cell: (r) => <span className="font-medium">{r.name}</span> },
        { key: "head", header: "Head", cell: (r) => r.head || "—" },
        { key: "count", header: "Employees", cell: (r) => r.employeeCount ?? (r as any).employee_count ?? 0 },
        ...(canEdit ? [{
          key: "actions",
          header: "",
          cell: (r: any) => (
            <div className="flex justify-end">
              <ConfirmDeleteButton
                onConfirm={async () => {
                  try {
                    await remove('departments', r.id);
                    toast.success('Moved to Trash');
                  } catch (e) {
                    toast.error('Delete failed');
                  }
                }}
                className="text-red-500 hover:text-red-700 text-sm font-medium px-2"
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
              await add("departments", { 
                name: v.name, 
                head: v.head || "", 
                employee_count: Number(v.employeeCount || 0) 
              });
              toast.success("Department created successfully.");
              close();
            } catch (err: any) {
              console.error("Failed to add department", err);
              toast.error(err.response?.data?.message || "Failed to save department.");
            }
          }}
          fields={[
            { name: "name", label: "Department name", type: "text", required: true },
            { 
              name: "head", 
              label: "Head (Team Leader)", 
              type: "select",
              options: teamLeaderOptions,
            },
            { name: "employeeCount", label: "Employee count", type: "number", defaultValue: 0 },
          ]}
        />
      )}
    />
  );
}
