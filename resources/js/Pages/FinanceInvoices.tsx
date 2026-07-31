import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm, type FieldDef } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/stat-card";
import { StaggerList } from "@/components/animations/StaggerList";
import { useCollection, add, update, remove } from "@/mocks/store";
import { type Invoice } from "@/mocks/data";
import { money, shortDate } from "@/lib/format";
import { useAuth } from "@/store/auth";
import { roleHas, type Role } from "@/lib/permissions";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { EditIconButton } from "@/components/edit-icon-button";
import type { FilterDef } from "@/components/data-table";
import { FileText, CheckCircle2, Clock, AlertTriangle, CreditCard } from "lucide-react";

export default function InvoicesPage() {
  const { user } = useAuth();
  const canEdit = user ? roleHas(user.role as Role, "invoice.manage") : false;

  const { t } = useTranslation();
  const rows = useCollection("invoices");
  const clients = useCollection("clients");
  const projects = useCollection("projects");
  const [editingRow, setEditingRow] = useState<Invoice | null>(null);

  const isReadOnly = !canEdit;

  const visibleRows = isReadOnly
    ? rows.filter((r: any) => {
        if (user?.role === "client") {
          const cid = String(user.client_id);
          return String(r.clientId) === cid || String(r.client_id) === cid;
        }
        return true;
      })
    : rows;

  // Mini Dashboard Calculation
  const stats = useMemo(() => {
    const totalAmount = visibleRows.reduce((sum, r: any) => sum + (Number(r.amount) || 0), 0);
    const paidRows = visibleRows.filter((r: any) => r.status === "paid");
    const paidAmount = paidRows.reduce((sum, r: any) => sum + (Number(r.paidAmount || r.amount) || 0), 0);
    const unpaidRows = visibleRows.filter((r: any) => r.status === "sent" || r.status === "partial" || r.status === "unpaid");
    const unpaidAmount = unpaidRows.reduce((sum, r: any) => sum + ((Number(r.amount) || 0) - (Number(r.paidAmount) || 0)), 0);
    const overdueCount = visibleRows.filter((r: any) => r.status === "overdue").length;
    const draftCount = visibleRows.filter((r: any) => r.status === "draft").length;

    return {
      totalCount: visibleRows.length,
      totalAmount,
      paidCount: paidRows.length,
      paidAmount,
      unpaidCount: unpaidRows.length,
      unpaidAmount,
      overdueCount,
      draftCount,
    };
  }, [visibleRows]);

  const dashboardHeader = (
    <StaggerList className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" staggerDelay={0.05}>
      <StatCard label="Total Billed" value={money(stats.totalAmount)} icon={FileText} description={`${stats.totalCount} total invoices`} />
      <StatCard label="Collected / Paid" value={money(stats.paidAmount)} icon={CheckCircle2} accent="success" description={`${stats.paidCount} paid`} />
      <StatCard label="Pending Payment" value={money(stats.unpaidAmount)} icon={Clock} accent="warning" description={`${stats.unpaidCount} unpaid/partial`} />
      <StatCard label="Overdue Invoices" value={stats.overdueCount} icon={AlertTriangle} accent="destructive" />
      <StatCard label="Draft Invoices" value={stats.draftCount} icon={CreditCard} />
    </StaggerList>
  );

  const formFields: FieldDef[] = [
    { name: "clientId", label: "Client", type: "select", options: clients.map((c) => ({ value: String(c.id), label: c.name })), required: true },
    { name: "projectId", label: "Project", type: "select", options: projects.map((p) => ({ value: String(p.id), label: p.name })) },
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
      hideNewButton={!canEdit}
      hideTrashButton={!canEdit}
      collectionKey="invoices"
      title={t("nav.invoices")}
      description="Bills issued to clients"
      rows={visibleRows}
      headerContent={dashboardHeader}
      newLabel="New invoice"
      editingRow={editingRow}
      onCloseEdit={() => setEditingRow(null)}
      getSearchable={(r) => `${r.invoiceNumber || r.number || ""} ${r.client?.name || clients.find((c: any) => String(c.id) === String(r.clientId || r.client_id))?.name || ""} ${r.project?.name || projects.find((p: any) => String(p.id) === String(r.projectId || r.project_id))?.name || ""} ${r.status}`}
      filters={[
        {
          key: "client",
          label: "Client",
          options: clients.map((c) => ({ value: String(c.id), label: c.name })),
          accessor: (row: any) => String(row.clientId || row.client_id || ""),
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
          options: projects.map((p) => ({ value: String(p.id), label: p.name })),
          accessor: (row: any) => String(row.projectId || row.project_id || ""),
        },
        {
          type: "date-range",
          key: "dueDate",
          label: "Due Date",
          accessor: (row: any) => row.dueDate || null,
        },
        {
          type: "date-range",
          key: "createdAt",
          label: "Date Created",
          accessor: (row: any) => row.createdAt || row.created_at || null,
        }
      ] as FilterDef[]}
      columns={[
        { key: "number", header: "Number", cell: (r) => <span className="font-mono text-xs">{r.invoiceNumber || r.number || "—"}</span> },
        { key: "client", header: "Client", cell: (r) => r.client?.name || clients.find((c) => String(c.id) === String(r.clientId || r.client_id))?.name || "—" },
        { key: "project", header: "Project", cell: (r) => r.project?.name || projects.find((p) => String(p.id) === String(r.projectId || r.project_id))?.name || "—", hideOnMobile: true },
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
                  <EditIconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingRow(r);
                    }}
                  />
                  <ConfirmDeleteButton
                    onConfirm={async () => {
                      try {
                        await remove('invoices', r.id);
                        toast.success('Invoice deleted successfully.');
                      } catch (err) {
                        toast.error('Failed to delete invoice.');
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
              toast.success("Invoice created successfully.");
              close();
            } catch (err: any) {
              toast.error(err.response?.data?.message || "Failed to save invoice.");
            }
          }}
          fields={formFields}
        />
      )}
      renderEditForm={(row, close) => (
        <QuickForm
          submitLabel="Save Changes"
          initialValues={{
            clientId: String(row.clientId || row.client_id || ""),
            projectId: row.projectId || row.project_id ? String(row.projectId || row.project_id) : "",
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
              toast.success("Invoice updated successfully.");
              close();
            } catch (err: any) {
              toast.error("Failed to update invoice.");
            }
          }}
          fields={formFields}
        />
      )}
    />
  );
}
