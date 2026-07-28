import { toast } from 'sonner';
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { useCollection, add } from "@/mocks/store";
import { makeId, type Department } from "@/mocks/data";

export default function DepartmentsPage() {
  const { t } = useTranslation();
  const rows = useCollection("departments");
  const employees = useCollection("employees");

  // Only team leaders can be department heads
  const teamLeaderOptions = [
    { value: "", label: "— No Head Assigned —" },
    ...employees
      .filter((e: any) => e.role === "team_leader" || e.role === "ceo" || e.role === "project_manager")
      .map((e: any) => ({ value: e.name, label: e.name })),
  ];

  return (
    <ResourcePage<Department>
      collectionKey="departments"
      title={t("nav.departments")}
      description="Company org chart"
      rows={rows}
      newLabel="New department"
      columns={[
        { key: "name", header: t("common.name"), cell: (r) => <span className="font-medium">{r.name}</span> },
        { key: "head", header: "Head", cell: (r) => r.head || "—" },
        { key: "count", header: "Employees", cell: (r) => r.employeeCount },
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
              close();
            } catch (err: any) {
              console.error("Failed to add department", err);
              toast(err.response?.data?.message || "Failed to save department.");
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
