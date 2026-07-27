import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm, type FieldDef } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add, update, remove } from "@/mocks/store";
import { makeId, type Employee } from "@/mocks/data";
import { money, shortDate } from "@/lib/format";
import { useAuth } from "@/store/auth";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";

export default function EmployeesPage() {
  const { t } = useTranslation();
  const rows = useCollection("employees");
  const { user } = useAuth();
  
  const [editingRow, setEditingRow] = useState<Employee | null>(null);
  const canEdit = ["super_admin", "ceo", "hr"].includes(user?.role || "");

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
    { name: "id_photo", label: t("common.fields.idPhoto") || "ID Photo URL", type: "text" },
    { name: "department", label: t("common.fields.department") || "Department", type: "text" },
    { name: "position", label: t("common.fields.jobPosition") || "Job Position", type: "text" },
    { name: "salary", label: t("common.fields.salary") || "Salary (USD)", type: "number" },
  ];

  return (
    <ResourcePage<Employee>
      title={t("nav.employees")}
      description="Team roster"
      rows={rows}
      newLabel="New employee"
      editingRow={editingRow}
      onCloseEdit={() => setEditingRow(null)}
      columns={[
        { key: "name", header: t("common.name"), cell: (r) => <div><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.email}</div></div> },
        { key: "dept", header: "Department", cell: (r) => r.department, hideOnMobile: true },
        { key: "position", header: "Position", cell: (r) => r.position },
        { key: "salary", header: "Salary", cell: (r) => <span className="tabular-nums">{money(r.salary)}</span>, hideOnMobile: true },
        { key: "hire", header: "Hired", cell: (r) => shortDate(r.hireDate), hideOnMobile: true },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
        { 
          key: "actions", 
          header: t("common.actions") || "Actions", 
          cell: (r) => (
            <div className="flex gap-2 justify-end">
              {canEdit && (
                <>
                  <button 
                    className="text-primary hover:underline text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingRow(r);
                    }}
                  >
                    {t("common.edit")}
                  </button>
                  <ConfirmDeleteButton
                    onConfirm={async () => {
                      try {
                        await remove('employees', r.id);
                        toast('Employee deleted successfully.');
                      } catch (err) {
                        toast('Failed to delete employee.');
                      }
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
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
              close();
            } catch (err: any) {
              console.error("Failed to add employee", err);
              toast(err.response?.data?.message || "Failed to save employee.");
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
              toast("Employee updated successfully.");
              close();
            } catch (err: any) {
              toast("Failed to update employee.");
            }
          }}
          fields={formFields}
        />
      )}
    />
  );
}
