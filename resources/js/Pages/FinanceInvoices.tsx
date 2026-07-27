import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm, type FieldDef } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add, update, remove } from "@/mocks/store";
import { type Invoice } from "@/mocks/data";
import { money, shortDate } from "@/lib/format";
import { useAuth } from "@/store/auth";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import type { FilterDef } from "@/components/data-table";

export default function InvoicesPage() {
  const { t } = useTranslation();
  const rows = useCollection("invoices");
  const clients = useCollection("clients");
  const projects = useCollection("projects");
  const { user } = useAuth();
  
  const [editingRow, setEditingRow] = useState<Invoice | null>(null);
  const canEdit = ["super_admin", "ceo", "accountant", "project_manager"].includes(user?.role || "");

  const formFields: FieldDef[] = [
    { name: "clientId", label: "Client", type: "select", options: clients.map((c) => ({ value: c.id, label: c.name })), required: true },
    { name: "projectId", label: "Project", type: "select", options: projects.map((p) => ({ value: p.id, label: p.name })) },
    { name: "amount", label: "Amount (USD)", type: "number", required: true },
    { name: "paidAmount", label: "Paid Amount (USD)", type: "number", defaultValue: 0 },
    { name: "dueDate", label: "Due date", type: "date" },
    {
      name: "status",
      label: "Status",
      type: "select",
      defaultValue: "draft",
      options: [
        { value: "draft", label: "Draft" },
        { value: "sent", label: "Sent" },
        { value: "partial", label: "Partial" },
        { value: "paid", label: "Paid" },
        { value: "overdue", label: "Overdue" },
      ],
    },
  ];

  return (
    <ResourcePage<Invoice>
      title={t("nav.invoices")}
      description="Bills issued to clients"
      rows={rows}
      newLabel="New invoice"
      editingRow={editingRow}
      onCloseEdit={() => setEditingRow(null)}
      getSearchable={(r) => `${r.number || ""} ${clients.find((c: any) => c.id === r.clientId)?.name || ""} ${projects.find((p: any) => p.id === r.projectId)?.name || ""} ${r.status}`}
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
            { value: "sent", label: "Sent" },
            { value: "partial", label: "Partial" },
            { value: "paid", label: "Paid" },
            { value: "overdue", label: "Overdue" },
          ],
        },
        {
          key: "project",
          label: "Project",
          options: projects.map((p) => ({ value: p.id as string, label: p.name })),
          accessor: (row: any) => row.projectId || row.project_id || "",
        },
      ] as FilterDef[]}
      columns={[
        { key: "number", header: "Number", cell: (r) => <span className="font-mono text-xs">{r.number}</span> },
        { key: "client", header: "Client", cell: (r) => clients.find((c) => c.id === r.clientId)?.name ?? "—" },
        { key: "project", header: "Project", cell: (r) => projects.find((p) => p.id === r.projectId)?.name ?? "—", hideOnMobile: true },
        { key: "amount", header: t("common.amount"), cell: (r) => (
          <div>
            <div className="font-semibold tabular-nums">{money(r.amount)}</div>
            {r.paidAmount > 0 && <div className="text-xs text-green-600">Paid: {money(r.paidAmount)}</div>}
          </div>
        ) },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
        { key: "due", header: "Due", cell: (r) => shortDate(r.dueDate), hideOnMobile: true },
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
                        await remove('invoices', r.id);
                        toast('Invoice deleted successfully.');
                      } catch (err) {
                        toast('Failed to delete invoice.');
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
            let status = (v.status as Invoice["status"]) || "draft";
            const paidAmount = Number(v.paidAmount || 0);
            const amount = Number(v.amount || 0);
            
            if (status === "paid" && paidAmount < amount && paidAmount > 0) {
                status = "partial" as Invoice["status"];
            }

            try {
              await add("invoices", {
                number: `INV-2026-${String(n).padStart(3, "0")}`,
                clientId: v.clientId,
                projectId: v.projectId,
                amount: amount,
                paidAmount: paidAmount,
                status: status,
                dueDate: v.dueDate ? new Date(v.dueDate).toISOString() : new Date().toISOString(),
              });
              close();
            } catch (err: any) {
              toast(err.response?.data?.message || "Failed to save invoice.");
            }
          }}
          fields={formFields}
        />
      )}
      renderEditForm={(row, close) => (
        <QuickForm
          submitLabel="Save Changes"
          initialValues={{
            clientId: row.clientId,
            projectId: row.projectId || "",
            amount: row.amount || 0,
            paidAmount: row.paidAmount || 0,
            dueDate: row.dueDate ? new Date(row.dueDate).toISOString().split("T")[0] : "",
            status: row.status || "draft",
          }}
          onCancel={close}
          onSubmit={async (v) => {
            try {
              let status = (v.status as Invoice["status"]) || "draft";
              const paidAmount = Number(v.paidAmount || 0);
              const amount = Number(v.amount || 0);
              
              if (status === "paid" && paidAmount < amount && paidAmount > 0) {
                  status = "partial" as Invoice["status"];
              }

              await update("invoices", row.id, {
                ...row,
                clientId: v.clientId,
                projectId: v.projectId,
                amount: amount,
                paidAmount: paidAmount,
                dueDate: v.dueDate ? new Date(v.dueDate).toISOString() : row.dueDate,
                status: status,
              });
              toast("Invoice updated successfully.");
              close();
            } catch (err: any) {
              toast("Failed to update invoice.");
            }
          }}
          fields={formFields}
        />
      )}
    />
  );
}
