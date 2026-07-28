import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm, type FieldDef } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add, update, remove } from "@/mocks/store";
import { type Client } from "@/mocks/data";
import { shortDate } from "@/lib/format";
import { useAuth } from "@/store/auth";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import type { FilterDef } from "@/components/data-table";

export default function ClientsPage() {
  const { t } = useTranslation();
  const rows = useCollection("clients");
  const { user } = useAuth();

  const [editingRow, setEditingRow] = useState<Client | null>(null);

  const canEdit = ["super_admin", "ceo", "project_manager", "team_leader", "hr"].includes(user?.role || "");

  const formFields: FieldDef[] = [
    { name: "name", label: t("common.name") || "Name", type: "text", required: true },
    { name: "email", label: t("common.email") || "Email", type: "email", required: true },
    { name: "phone", label: t("common.phone") || "Phone", type: "text" },
    { name: "position", label: t("common.fields.jobPosition") || "Position", type: "text" },
    { name: "password", label: "Portal Password (Optional)", type: "password" },
  ];

  const clientFilters: FilterDef[] = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
    {
      key: "company",
      label: "Company",
      type: "select",
      options: [
        { value: "Acme Corp", label: "Acme Corp" },
        { value: "Globex", label: "Globex" },
      ],
      accessor: (r: any) => r.company || "",
    },
    {
      key: "country",
      label: "Country",
      type: "select",
      options: [
        { value: "USA", label: "USA" },
        { value: "UK", label: "UK" },
        { value: "Canada", label: "Canada" },
      ],
      accessor: (r: any) => r.country || "",
    },
    {
      key: "createdAt",
      label: "Created Date",
      type: "date-range",
    }
  ];

  return (
    <ResourcePage<Client>
      collectionKey="clients"
      title={t("nav.clients")}
      description="Clients and individuals working with The Knower"
      rows={rows}
      getSearchable={(r) => `${r.name} ${r.email} ${r.position}`}
      newLabel="New client"
      editingRow={editingRow}
      onCloseEdit={() => setEditingRow(null)}
      filters={clientFilters}
      columns={[
        { key: "name", header: t("common.name"), cell: (r) => <div><div className="font-medium flex items-center gap-2">{r.name} {(r as any).password && <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/15 text-primary px-1.5 py-0.5 rounded-sm">Portal User</span>}</div><div className="text-xs text-muted-foreground">{r.position}</div></div> },
        { key: "email", header: t("common.email"), cell: (r) => <span className="text-muted-foreground">{r.email}</span>, hideOnMobile: true },
        { key: "phone", header: t("common.phone"), cell: (r) => r.phone, hideOnMobile: true },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
        { key: "created", header: t("common.created"), cell: (r) => <span className="text-xs text-muted-foreground">{shortDate(r.createdAt)}</span> },
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
                        await remove('clients', r.id);
                        toast('Client deleted successfully.');
                      } catch (err) {
                        toast('Failed to delete client.');
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
              await add("clients", { ...v, status: "active" });
              close();
            } catch (err: any) {
              console.error("Failed to add client", err);
              toast(err.response?.data?.message || "Failed to save client.");
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
            position: row.position || "",
            password: (row as any).password || "",
          }}
          onCancel={close}
          onSubmit={async (v) => {
            try {
              await update("clients", row.id, { ...row, ...v });
              toast("Client updated successfully.");
              close();
            } catch (err: any) {
              console.error("Failed to update client", err);
              toast("Failed to update client.");
            }
          }}
          fields={formFields}
        />
      )}
    />
  );
}
