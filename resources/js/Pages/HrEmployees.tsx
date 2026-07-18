import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add } from "@/mocks/store";
import { makeId, type Employee } from "@/mocks/data";
import { money, shortDate } from "@/lib/format";

export default function EmployeesPage() {
  const { t } = useTranslation();
  const rows = useCollection("employees");
  return (
    <ResourcePage<Employee>
      title={t("nav.employees")}
      description="Team roster"
      rows={rows}
      newLabel="New employee"
      columns={[
        { key: "name", header: t("common.name"), cell: (r) => <div><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.email}</div></div> },
        { key: "dept", header: "Department", cell: (r) => r.department },
        { key: "position", header: "Position", cell: (r) => r.position },
        { key: "salary", header: "Salary", cell: (r) => <span className="tabular-nums">{money(r.salary)}</span> },
        { key: "hire", header: "Hired", cell: (r) => shortDate(r.hireDate) },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={async (v) => {
            try {
              await add("employees", {
                name: v.name,
                email: v.email,
                password: v.password,
                role: v.role || "employee",
                phone: v.phone,
                address: v.address,
                id_number: v.id_number,
                id_photo: v.id_photo,
                department: v.department,
                position: v.position,
                salary: Number(v.salary || 0),
                hire_date: new Date().toISOString().split("T")[0],
                status: "active",
              });
              close();
            } catch (err: any) {
              console.error("Failed to add employee", err);
              alert(err.response?.data?.message || "Failed to save employee.");
            }
          }}
          fields={[
            { name: "name", label: "Full Name", type: "text", required: true },
            { name: "email", label: "Email (Login ID)", type: "email", required: true },
            { name: "password", label: "Initial Password", type: "text", required: true },
            { 
              name: "role", 
              label: "System Role", 
              type: "select", 
              options: [
                { value: "developer", label: "Software Developer" },
                { value: "designer", label: "UI/UX Designer" },
                { value: "project_manager", label: "Project Manager" },
                { value: "qa", label: "QA Tester" },
                { value: "accountant", label: "Accountant" },
                { value: "hr", label: "HR" },
                { value: "support", label: "Support" },
                { value: "team_leader", label: "Team Leader" },
              ]
            },
            { name: "phone", label: "Phone Number", type: "text" },
            { name: "address", label: "Address", type: "text" },
            { name: "id_number", label: "National ID Number", type: "text" },
            { name: "id_photo", label: "ID Photo URL", type: "text" },
            { name: "department", label: "Department", type: "text" },
            { name: "position", label: "Job Position", type: "text" },
            { name: "salary", label: "Salary (USD)", type: "number" },
          ]}
        />
      )}
    />
  );
}
