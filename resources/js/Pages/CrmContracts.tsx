import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm, type FieldDef } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add, update, remove } from "@/mocks/store";
import { makeId, type Contract } from "@/mocks/data";
import { shortDate } from "@/lib/format";
import { useAuth } from "@/store/auth";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import type { FilterDef } from "@/components/data-table";

export default function ContractsPage() {
  const { t } = useTranslation();
  const rows = useCollection("contracts");
  const clients = useCollection("clients");
  const { user } = useAuth();
  
  const [editingRow, setEditingRow] = useState<Contract | null>(null);
  const canEdit = ["super_admin", "ceo", "project_manager", "team_leader", "hr"].includes(user?.role || "");

  const formFields: FieldDef[] = [
    { name: "client_id", label: t("common.fields.client") || "Client", type: "select", options: clients.map((c) => ({ value: c.id, label: c.name })), required: true },
    { name: "project_id", label: "Project ID", type: "text", required: true },
    {
      name: "type",
      label: t("common.fields.contractType") || "Contract Type",
      type: "select",
      defaultValue: "handover",
      options: [
        { value: "handover", label: "Project Handover (One-time)" },
        { value: "monthly", label: "Monthly Retainer / Hosting" },
        { value: "annual", label: "Annual Cloud Services" },
      ]
    },
    { name: "startDate", label: t("common.start"), type: "date" },
    { name: "endDate", label: t("common.end"), type: "date" },
    { name: "file", label: t("common.document"), type: "text" },
    {
      name: "status",
      label: t("common.status"),
      type: "select",
      defaultValue: "draft",
      options: [
        { value: "draft", label: t("status.draft") },
        { value: "active", label: t("status.active") },
        { value: "ended", label: t("status.ended") },
      ],
    },
  ];

  return (
    <ResourcePage<Contract>
      title={t("nav.contracts")}
      description={t("contracts.description")}
      rows={rows}
      newLabel={t("contracts.new")}
      editingRow={editingRow}
      onCloseEdit={() => setEditingRow(null)}
      getSearchable={(r) => `${r.number || ""} ${clients.find((c: any) => c.id === (r as any).clientId)?.name || ""} ${(r as any).type || ""} ${r.status}`}
      filters={[
        {
          key: "client",
          label: "Client",
          options: clients.map((c) => ({ value: c.id as string, label: c.name })),
          accessor: (row: any) => row.clientId || row.client_id || "",
        },
        {
          key: "status",
          label: "Status",
          options: [
            { value: "draft", label: "Draft" },
            { value: "active", label: "Active" },
            { value: "ended", label: "Ended" },
          ],
        },
        {
          key: "type",
          label: "Type",
          options: [
            { value: "handover", label: "Project Handover" },
            { value: "monthly", label: "Monthly Retainer" },
            { value: "annual", label: "Annual Cloud" },
          ],
        },
      ] as FilterDef[]}
      columns={[
        { key: "number", header: t("common.number"), cell: (r) => <span className="font-mono text-xs">{r.number}</span> },
        { key: "client", header: t("common.client"), cell: (r) => clients.find((c) => c.id === r.clientId)?.name ?? "—" },
        { key: "start", header: t("common.start"), cell: (r) => shortDate(r.startDate), hideOnMobile: true },
        { key: "end", header: t("common.end"), cell: (r) => shortDate(r.endDate), hideOnMobile: true },
        { key: "type", header: "Type", cell: (r) => <span className="capitalize">{r.type ?? 'handover'}</span> },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
        { key: "file", header: t("common.document"), cell: () => <span className="text-muted-foreground text-xs underline cursor-pointer hover:text-primary">Download</span>, hideOnMobile: true },
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
                        await remove('contracts', r.id);
                        toast('Contract deleted successfully.');
                      } catch (err) {
                        toast('Failed to delete contract.');
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
            const n = rows.length + 1;
            try {
              await add("contracts", {
                number: `CTR-2026-${String(n).padStart(3, "0")}`,
                client_id: v.client_id,
                project_id: v.project_id,
                type: v.type,
                start_date: v.startDate ? new Date(v.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                end_date: v.endDate ? new Date(v.endDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                status: (v.status as Contract["status"]) || "draft",
              });
              close();
            } catch (err: any) {
              console.error("Failed to add contract", err);
              toast(err.response?.data?.message || "Failed to save contract.");
            }
          }}
          fields={formFields}
        />
      )}
      renderEditForm={(row, close) => (
        <QuickForm
          submitLabel="Save Changes"
          initialValues={{
            client_id: (row as any).clientId || (row as any).client_id,
            project_id: (row as any).project_id || (row as any).projectId || "",
            type: (row as any).type || "handover",
            startDate: row.startDate ? new Date(row.startDate).toISOString().split("T")[0] : "",
            endDate: row.endDate ? new Date(row.endDate).toISOString().split("T")[0] : "",
            status: row.status || "draft",
            file: (row as any).file || "",
          }}
          onCancel={close}
          onSubmit={async (v) => {
            try {
              await update("contracts", row.id, { 
                ...row, 
                ...v,
                start_date: v.startDate ? new Date(v.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                end_date: v.endDate ? new Date(v.endDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              });
              toast("Contract updated successfully.");
              close();
            } catch (err: any) {
              toast("Failed to update contract.");
            }
          }}
          fields={formFields}
        />
      )}
    />
  );
}
