import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm, type FieldDef } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { type Lead } from "@/mocks/data";
import { money, shortDate } from "@/lib/format";
import { useCollection, add, update, remove } from "@/mocks/store";
import { toast } from "sonner";
import { useAuth } from "@/store/auth";
import { roleHas, type Role } from "@/lib/permissions";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import type { FilterDef } from "@/components/data-table";

export default function LeadsPage() {
    const { user } = useAuth();
    const canEdit = user ? roleHas(user.role as Role, "lead.manage") : false;

  const { t } = useTranslation();
    const [editingRow, setEditingRow] = useState<Lead | null>(null);
  
  const rows = useCollection("leads");
  const employees = useCollection("employees");

  const leadsFilters: FilterDef[] = [
    {
      type: "select",
      key: "assignedTo",
      label: "Assigned To",
      options: employees.map((e) => ({ value: e.name, label: e.name })),
      accessor: (r: any) => r.assignedTo || r.assigned_to || "",
    },
    {
      type: "date-range",
      key: "createdAt",
      label: "Date Created",
      accessor: (r: any) => r.createdAt || r.created_at || null,
    }
  ];

  const formFields: FieldDef[] = [
    { name: "name", label: t("common.name") || "Name", type: "text", required: true },
    { name: "email", label: t("common.email") || "Email", type: "email", required: true },
    { name: "phone", label: t("common.phone") || "Phone", type: "text" },
  ];

  return (
    <ResourcePage<Lead>
      hideNewButton={!canEdit}
      hideTrashButton={!canEdit}
      collectionKey="leads"
      title={t("nav.leads")}
      description="Prospects moving through the sales pipeline"
      rows={rows}
      getSearchable={(r) => `${r.name} ${r.email}`}
      newLabel="New lead"
      editingRow={editingRow}
      onCloseEdit={() => setEditingRow(null)}
      filters={leadsFilters}
      columns={[
        { key: "name", header: t("common.name"), cell: (r) => <span className="font-medium">{r.name}</span> },
        { key: "email", header: t("common.email"), cell: (r) => <span className="text-muted-foreground">{r.email}</span>, hideOnMobile: true },
        { key: "created", header: t("common.created"), cell: (r) => <span className="text-xs text-muted-foreground">{shortDate(r.createdAt || r.created_at || "")}</span> },
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
                        await remove("leads", r.id);
                        toast.success("Lead deleted successfully.");
                      } catch(e) {
                        toast.error("Failed to delete lead.");
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
              await add("leads", v);
              toast.success("Lead created successfully.");
              close();
            } catch(err: any) {
              toast.error(err.response?.data?.message || "Failed to create lead.");
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
            phone: row.phone || "",
          }}
          onCancel={close}
          onSubmit={async (v) => {
            try {
              await update("leads", row.id, { ...row, ...v });
              toast.success("Lead updated successfully.");
              close();
            } catch(err: any) {
              toast.error(err.response?.data?.message || "Failed to update lead.");
            }
          }}
          fields={formFields}
        />
      )}
    />
  );
}
