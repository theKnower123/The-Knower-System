import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm, type FieldDef } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add, update, remove } from "@/mocks/store";
import { makeId, type Payment } from "@/mocks/data";
import { money, shortDate } from "@/lib/format";
import { useAuth } from "@/store/auth";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { ImageIcon } from "lucide-react";
import type { FilterDef } from "@/components/data-table";

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "vodafone_cash", label: "Vodafone Cash" },
  { value: "instapay", label: "InstaPay" },
  { value: "paypal", label: "PayPal" },
  { value: "stripe", label: "Stripe" },
  { value: "other", label: "Other" },
];

export default function PaymentsPage() {
  const { t } = useTranslation();
  const rows = useCollection("payments");
  const invoices = useCollection("invoices");
  const clients = useCollection("clients");
  const { user } = useAuth();

  const [editingRow, setEditingRow] = useState<Payment | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const canEdit = ["super_admin", "ceo", "accountant", "project_manager"].includes(user?.role || "");

  // Filters
  const filters: FilterDef[] = [
    {
      key: "method",
      label: "Method",
      options: PAYMENT_METHODS,
    },
    {
      key: "invoice",
      label: "Invoice",
      options: invoices.map((i) => ({ value: i.id as string, label: i.number || `INV-${i.id}` })),
      accessor: (row: any) => row.invoiceId || row.invoice_id || "",
    },
  ];

  const formFields: FieldDef[] = [
    { name: "invoiceId", label: "Invoice", type: "select", options: invoices.map((i) => {
      const client = clients.find((c) => c.id === i.clientId);
      return { value: i.id as string, label: `${i.number || `INV-${i.id}`} — ${client?.name || "Unknown"} — ${money(i.amount)}` };
    }), required: true },
    { name: "amount", label: "Amount", type: "number", required: true },
    {
      name: "method",
      label: "Payment Method",
      type: "select",
      defaultValue: "bank_transfer",
      options: PAYMENT_METHODS,
    },
    { name: "paidAt", label: "Paid At", type: "date" },
    { name: "reference", label: "Reference / Transaction ID", type: "text" },
    { name: "transfer_proof", label: "Transfer Proof (Screenshot)", type: "file", accept: "image/*" },
    { name: "notes", label: "Notes", type: "textarea" },
  ];

  return (
    <ResourcePage<Payment>
      collectionKey="payments"
      title={t("nav.payments")}
      description="Payments received against invoices — track every transaction with proof"
      rows={rows}
      newLabel="Record payment"
      editingRow={editingRow}
      onCloseEdit={() => setEditingRow(null)}
      filters={filters}
      getSearchable={(r) => {
        const inv = invoices.find((i) => i.id === r.invoiceId);
        return `${inv?.number || ""} ${r.method} ${r.reference || ""} ${r.amount}`;
      }}
      columns={[
        {
          key: "invoice",
          header: "Invoice",
          cell: (r) => {
            const inv = invoices.find((i) => i.id === r.invoiceId);
            const client = inv ? clients.find((c) => c.id === inv.clientId) : null;
            return (
              <div>
                <span className="font-mono text-xs">{inv?.number ?? r.invoiceId}</span>
                {client && <div className="text-[11px] text-muted-foreground">{client.name}</div>}
              </div>
            );
          },
        },
        {
          key: "method",
          header: "Method",
          cell: (r) => {
            const label = PAYMENT_METHODS.find((m) => m.value === r.method)?.label || r.method;
            return <StatusBadge value={label} />;
          },
        },
        {
          key: "amount",
          header: t("common.amount"),
          cell: (r) => <span className="font-semibold tabular-nums">{money(r.amount)}</span>,
        },
        {
          key: "paid",
          header: "Paid at",
          cell: (r) => <span className="text-xs text-muted-foreground">{shortDate(r.paidAt)}</span>,
        },
        {
          key: "ref",
          header: "Reference",
          cell: (r) => <span className="text-xs text-muted-foreground">{r.reference || "—"}</span>,
          hideOnMobile: true,
        },
        {
          key: "proof",
          header: "Proof",
          cell: (r) => {
            const proof = (r as any).transfer_proof;
            if (!proof) return <span className="text-xs text-muted-foreground/50">—</span>;
            return (
              <button
                onClick={() => setProofPreview(typeof proof === "string" ? proof : URL.createObjectURL(proof))}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                View
              </button>
            );
          },
          hideOnMobile: true,
        },
        {
          key: "actions",
          header: "",
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
                        await remove("payments", r.id);
                        toast("Payment deleted.");
                      } catch {
                        toast("Failed to delete payment.");
                      }
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  />
                </>
              )}
            </div>
          ),
        },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={async (v) => {
            try {
              await add("payments", {
                id: makeId("py"),
                invoiceId: v.invoiceId,
                method: (v.method as Payment["method"]) || "bank_transfer",
                amount: Number(v.amount || 0),
                paidAt: v.paidAt ? new Date(v.paidAt).toISOString() : new Date().toISOString(),
                reference: v.reference || "",
                transfer_proof: v.transfer_proof || null,
                notes: v.notes || "",
              });
              toast("Payment recorded successfully.");
              close();
            } catch (err: any) {
              toast(err.response?.data?.message || "Failed to record payment.");
            }
          }}
          fields={formFields}
        />
      )}
      renderEditForm={(row, close) => (
        <QuickForm
          submitLabel="Save Changes"
          initialValues={{
            invoiceId: row.invoiceId || "",
            amount: row.amount || 0,
            method: row.method || "bank_transfer",
            paidAt: row.paidAt ? new Date(row.paidAt).toISOString().split("T")[0] : "",
            reference: row.reference || "",
            transfer_proof: (row as any).transfer_proof || "",
            notes: (row as any).notes || "",
          }}
          onCancel={close}
          onSubmit={async (v) => {
            try {
              await update("payments", row.id, {
                ...row,
                ...v,
                amount: Number(v.amount || 0),
                paidAt: v.paidAt ? new Date(v.paidAt).toISOString() : row.paidAt,
              });
              toast("Payment updated successfully.");
              close();
            } catch (err: any) {
              toast("Failed to update payment.");
            }
          }}
          fields={formFields}
        />
      )}
    />
  );
}
