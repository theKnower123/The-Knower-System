import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm, type FieldDef } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/stat-card";
import { StaggerList } from "@/components/animations/StaggerList";
import { useCollection, add, update, remove } from "@/mocks/store";
import { type Employee } from "@/mocks/data";
import { money, shortDate } from "@/lib/format";
import { useAuth } from "@/store/auth";
import { roleHas, type Role } from "@/lib/permissions";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { EditIconButton } from "@/components/edit-icon-button";
import { Users, UserCheck, DollarSign, CalendarOff } from "lucide-react";

export default function EmployeesPage() {
  const { user } = useAuth();
  const canEdit = user ? roleHas(user.role as Role, "hr.manage") : false;

  const { t } = useTranslation();
  const rows = useCollection("employees");
  const departments = useCollection("departments");
  const [editingRow, setEditingRow] = useState<Employee | null>(null);

  // Mini Dashboard Calculation
  const stats = useMemo(() => {
    const totalCount = rows.length;
    const activeCount = rows.filter((r: any) => !r.status || r.status === "active").length;
    const onLeaveCount = rows.filter((r: any) => r.status === "on_leave").length;
    const totalMonthlySalary = rows.reduce((sum, r: any) => sum + (Number(r.salary) || 0), 0);

    return { totalCount, activeCount, onLeaveCount, totalMonthlySalary };
  }, [rows]);

  const dashboardHeader = (
    <StaggerList className="grid grid-cols-2 gap-3 sm:grid-cols-4" staggerDelay={0.05}>
      <StatCard label="Total Employees" value={stats.totalCount} icon={Users} />
      <StatCard label="Active Staff" value={stats.activeCount} icon={UserCheck} accent="success" />
      <StatCard label="Monthly Payroll Cost" value={money(stats.totalMonthlySalary)} icon={DollarSign} accent="primary" />
      <StatCard label="On Leave" value={stats.onLeaveCount} icon={CalendarOff} accent="warning" />
    </StaggerList>
  );

  const formFields: FieldDef[] = [
    { name: "name", label: t("common.fields.fullName") || "Full Name", type: "text", required: true },
    { name: "email", label: t("common.fields.emailLogin") || "Email (Login ID)", type: "email", required: true },
    { name: "password", label: t("common.fields.passwordBlank") || "Password (leave blank to keep current)", type: "text" },
    { 
      name: "role", 
      label: t("common.fields.systemRole") || "System Role", 
      type: "select", 
      options: [
        { value: "developer", label: t("roles.developer") || "Software Developer" },
        { value: "designer", label: t("roles.designer") || "UI/UX Designer" },
        { value: "project_manager", label: t("roles.project_manager") || "Project Manager" },
        { value: "qa", label: t("roles.qa") || "QA Tester" },
        { value: "accountant", label: t("roles.accountant") || "Accountant" },
        { value: "hr", label: t("roles.hr") || "HR" },
        { value: "support", label: t("roles.support") || "Support" },
        { value: "team_leader", label: t("roles.team_leader") || "Team Leader" },
      ]
    },
    { name: "phone", label: t("common.fields.phoneNumber") || "Phone Number", type: "text" },
    { name: "address", label: t("common.fields.address") || "Address", type: "text" },
    { name: "id_number", label: t("common.fields.nationalId") || "National ID Number", type: "text" },
    { name: "id_photo", label: t("common.fields.idPhoto") || "ID / Employee Photo", type: "file", accept: "image/*" },
    { 
      name: "department", 
      label: t("common.fields.department") || "Department", 
      type: "select",
      options: [
        { value: "", label: "— No Department —" },
        ...departments.map((d: any) => ({ value: d.name, label: d.name })),
      ]
    },
    { 
      name: "position", 
      label: t("common.fields.jobPosition") || "Job Title", 
      type: "select",
      options: [
        { value: "Software Developer", label: "Software Developer" },
        { value: "Senior Software Developer", label: "Senior Software Developer" },
        { value: "Lead Developer", label: "Lead Developer" },
        { value: "Full-Stack Developer", label: "Full-Stack Developer" },
        { value: "Frontend Developer", label: "Frontend Developer" },
        { value: "Backend Developer", label: "Backend Developer" },
        { value: "Mobile Developer", label: "Mobile Developer" },
        { value: "UI/UX Designer", label: "UI/UX Designer" },
        { value: "Graphic Designer", label: "Graphic Designer" },
        { value: "Project Manager", label: "Project Manager" },
        { value: "Senior Project Manager", label: "Senior Project Manager" },
        { value: "QA Engineer", label: "QA Engineer" },
        { value: "QA Lead", label: "QA Lead" },
        { value: "DevOps Engineer", label: "DevOps Engineer" },
        { value: "System Administrator", label: "System Administrator" },
        { value: "Network Engineer", label: "Network Engineer" },
        { value: "Data Analyst", label: "Data Analyst" },
        { value: "Business Analyst", label: "Business Analyst" },
        { value: "Team Leader", label: "Team Leader" },
        { value: "Technical Lead", label: "Technical Lead" },
        { value: "HR Specialist", label: "HR Specialist" },
        { value: "HR Manager", label: "HR Manager" },
        { value: "Recruiter", label: "Recruiter" },
        { value: "Accountant", label: "Accountant" },
        { value: "Financial Analyst", label: "Financial Analyst" },
        { value: "Sales Executive", label: "Sales Executive" },
        { value: "Account Manager", label: "Account Manager" },
        { value: "Customer Support Specialist", label: "Customer Support Specialist" },
        { value: "Content Writer", label: "Content Writer" },
        { value: "Marketing Specialist", label: "Marketing Specialist" },
        { value: "SEO Specialist", label: "SEO Specialist" },
        { value: "CEO", label: "CEO" },
        { value: "CTO", label: "CTO" },
        { value: "COO", label: "COO" },
        { value: "Other", label: "Other" },
      ]
    },
    { name: "salary", label: t("common.fields.salary") || "Salary (USD)", type: "number" },
  ];

  return (
    <ResourcePage<Employee>
      hideNewButton={!canEdit}
      hideTrashButton={!canEdit}
      collectionKey="employees"
      title={t("nav.employees")}
      description="Team roster & employee profiles"
      rows={rows}
      headerContent={dashboardHeader}
      newLabel="New employee"
      editingRow={editingRow}
      onCloseEdit={() => setEditingRow(null)}
      filters={[
        {
          key: "department",
          label: "Department",
          type: "select",
          options: departments.map((d: any) => ({ value: d.name, label: d.name })),
          accessor: (r: any) => r.department || "",
        },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "active", label: "Active" },
            { value: "on_leave", label: "On Leave" },
            { value: "terminated", label: "Terminated" },
          ],
        },
        {
          key: "position",
          label: "Position",
          type: "select",
          options: Array.from(new Set(rows.map(r => r.position).filter(Boolean))).map(p => ({ value: p as string, label: p as string })),
        }
      ]}
      columns={[
        { key: "name", header: t("common.name"), cell: (r) => <div><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.email}</div></div> },
        { key: "dept", header: "Department", cell: (r) => r.department, hideOnMobile: true },
        { key: "position", header: "Position", cell: (r) => r.position },
        { key: "salary", header: "Salary", cell: (r) => <span className="tabular-nums font-semibold">{money(r.salary)}</span>, hideOnMobile: true },
        { key: "hire", header: "Hired", cell: (r) => shortDate(r.hireDate), hideOnMobile: true },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status || "active"} /> },
        { 
          key: "actions", 
          header: t("common.actions") || "Actions", 
          cell: (r) => (
            <div className="flex gap-2 justify-end">
              {canEdit && (
                <>
                  <EditIconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingRow(r);
                    }}
                  />
                  <ConfirmDeleteButton
                    onConfirm={async () => {
                      try {
                        await remove('employees', r.id);
                        toast.success('Employee deleted successfully.');
                      } catch (err) {
                        toast.error('Failed to delete employee.');
                      }
                    }}
                  />
                </>
              )}
            </div>
          ) 
        },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={async (v) => {
            try {
              if (!v.password) {
                toast.error("Password is required for new employees");
                return;
              }
              await add("employees", {
                ...v,
                role: v.role || "employee",
                salary: Number(v.salary || 0),
                hire_date: new Date().toISOString().split("T")[0],
                status: "active",
              });
              toast.success("Employee added successfully.");
              close();
            } catch (err: any) {
              console.error("Failed to add employee", err);
              toast.error(err.response?.data?.message || "Failed to save employee.");
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
            email: row.email,
            password: "",
            role: row.role || "employee",
            phone: row.phone || "",
            address: row.address || "",
            id_number: row.idNumber || row.id_number || "",
            id_photo: row.idPhoto || row.id_photo || "",
            department: row.department || "",
            position: row.position || "",
            salary: row.salary || 0,
          }}
          onCancel={close}
          onSubmit={async (v) => {
            try {
              const dataToUpdate = { ...row, ...v };
              if (!v.password) {
                delete dataToUpdate.password;
              }
              dataToUpdate.salary = Number(v.salary || 0);
              
              await update("employees", row.id, dataToUpdate);
              toast.success("Employee updated successfully.");
              close();
            } catch (err: any) {
              toast.error("Failed to update employee.");
            }
          }}
          fields={formFields}
        />
      )}
    />
  );
}
