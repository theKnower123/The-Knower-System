import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm, type FieldDef } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add, update, remove } from "@/mocks/store";
import { makeId, type Expense } from "@/mocks/data";
import { money, shortDate } from "@/lib/format";
import { useAuth } from "@/store/auth";
import { roleHas, type Role } from "@/lib/permissions";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import type { FilterDef } from "@/components/data-table";
import { ImageIcon, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const EXPENSE_CATEGORIES = [
  { value: "Domains & Hosting", label: "Domains & Hosting" },
  { value: "Basics & Utilities", label: "Basics & Utilities" },
  { value: "Office Supplies", label: "Office Supplies" },
  { value: "Software & Subscriptions", label: "Software & Subscriptions" },
  { value: "Marketing & Ads", label: "Marketing & Ads" },
  { value: "Equipment & Hardware", label: "Equipment & Hardware" },
  { value: "Travel & Transportation", label: "Travel & Transportation" },
  { value: "Maintenance & Repairs", label: "Maintenance & Repairs" },
  { value: "Other", label: "Other" },
];

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "vodafone_cash", label: "Vodafone Cash" },
  { value: "instapay", label: "InstaPay" },
  { value: "card", label: "Credit/Debit Card" },
  { value: "paypal", label: "PayPal" },
  { value: "other", label: "Other" },
];

function getProofUrl(proof: any): string | null {
  if (!proof) return null;
  if (proof instanceof File) {
    try {
      return URL.createObjectURL(proof);
    } catch {
      return null;
    }
  }
  if (typeof proof === "string") {
    const str = proof.trim();
    if (!str) return null;
    if (str.startsWith("http://") || str.startsWith("https://") || str.startsWith("data:") || str.startsWith("blob:")) {
      return str;
    }
    const cleanPath = str.startsWith("/") ? str.slice(1) : str;
    if (cleanPath.startsWith("storage/")) {
      return `/${cleanPath}`;
    }
    return `/storage/${cleanPath}`;
  }
  return null;
}

export default function ExpensesPage() {
  const { user } = useAuth();
  const canEdit = user ? roleHas(user.role as Role, "expense.manage") : false;

  const { t } = useTranslation();
  const rows = useCollection("expenses") || [];
  const [editingRow, setEditingRow] = useState<Expense | null>(null);
  const [previewModal, setPreviewModal] = useState<{ title: string; url: string } | null>(null);

  // Build unique categories for filter
  const categoryOptions = useMemo(() => {
    const existing = [...new Set(rows.map((r: any) => r.category).filter(Boolean))];
    const all = Array.from(new Set([...EXPENSE_CATEGORIES.map(c => c.value), ...existing]));
    return all.map((c) => ({ value: c, label: c }));
  }, [rows]);

  const filters: FilterDef[] = [
    {
      key: "category",
      label: "Category",
      options: categoryOptions,
    },
    {
      key: "method",
      label: "Payment Method",
      options: PAYMENT_METHODS,
      accessor: (r: any) => r.method || r.payment_method || "",
    },
  ];

  const formFields: FieldDef[] = [
    { name: "title", label: "Title", type: "text", required: true },
    { 
      name: "category", 
      label: "Category", 
      type: "select", 
      defaultValue: "Basics & Utilities",
      options: categoryOptions 
    },
    { name: "unit_price", label: "Unit Price", type: "number", required: true },
    { name: "quantity", label: "Quantity", type: "number", defaultValue: 1, required: true },
    { name: "amount", label: "Total Amount (Calculated automatically if empty)", type: "number" },
    {
      name: "method",
      label: "Payment Method",
      type: "select",
      defaultValue: "cash",
      options: PAYMENT_METHODS,
    },
    { name: "expense_date", label: "Expense Date", type: "date" },
    { 
      name: "transfer_proof", 
      label: "Transfer Screenshot (Required for Non-Cash)", 
      type: "file", 
      accept: "image/*" 
    },
    { 
      name: "invoice_proof", 
      label: "Expense Invoice / Receipt Screenshot", 
      type: "file", 
      accept: "image/*" 
    },
    { name: "notes", label: "Notes", type: "textarea" },
  ];

  return (
    <>
      <ResourcePage<Expense>
        hideNewButton={!canEdit}
        hideTrashButton={!canEdit}
        collectionKey="expenses"
        title={t("nav.expenses")}
        description="Track company costs, domains, office basics, invoices, and transfer proofs"
        rows={rows}
        newLabel="New expense"
        editingRow={editingRow}
        onCloseEdit={() => setEditingRow(null)}
        filters={filters}
        getSearchable={(r: any) => {
          if (!r) return "";
          return `${r.title || ""} ${r.category || ""} ${r.method || r.payment_method || ""} ${r.amount || ""} ${r.notes || ""}`;
        }}
        columns={[
          { 
            key: "title", 
            header: t("common.title"), 
            cell: (r: any) => (
              <div>
                <span className="font-medium text-foreground">{r.title}</span>
                {r.notes && <div className="text-[11px] text-muted-foreground line-clamp-1">{r.notes}</div>}
              </div>
            ) 
          },
          { 
            key: "category", 
            header: "Category", 
            cell: (r: any) => (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                {r.category || "General"}
              </span>
            ) 
          },
          { 
            key: "amount", 
            header: t("common.amount"), 
            cell: (r: any) => {
              const qty = Number(r.quantity || 1);
              const unitPrice = Number(r.unit_price || r.unitPrice || (qty > 0 ? (r.amount / qty) : r.amount));
              const total = Number(r.amount || (unitPrice * qty));
              return (
                <div>
                  <div className="font-semibold tabular-nums text-foreground">{money(total)}</div>
                  {qty > 1 && (
                    <div className="text-[11px] text-muted-foreground">
                      {qty} × {money(unitPrice)}
                    </div>
                  )}
                </div>
              );
            } 
          },
          { 
            key: "method", 
            header: "Payment Method", 
            cell: (r: any) => {
              const methodVal = r.method || r.payment_method || "cash";
              const label = PAYMENT_METHODS.find((m) => m.value === methodVal)?.label || methodVal;
              return <StatusBadge value={label} />;
            } 
          },
          {
            key: "transfer_proof",
            header: "Transfer Proof",
            cell: (r: any) => {
              const rawProof = r.transfer_proof || r.transferProof;
              const url = getProofUrl(rawProof);
              if (!url) return <span className="text-xs text-muted-foreground/50">—</span>;
              return (
                <button
                  type="button"
                  onClick={() => setPreviewModal({ title: "Transfer Screenshot", url })}
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  Transfer
                </button>
              );
            },
            hideOnMobile: true,
          },
          {
            key: "invoice_proof",
            header: "Invoice Proof",
            cell: (r: any) => {
              const rawProof = r.receipt_path || r.receiptPath || r.invoice_proof || r.invoiceProof;
              const url = getProofUrl(rawProof);
              if (!url) return <span className="text-xs text-muted-foreground/50">—</span>;
              return (
                <button
                  type="button"
                  onClick={() => setPreviewModal({ title: "Invoice / Receipt", url })}
                  className="flex items-center gap-1 text-xs text-emerald-600 hover:underline"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Receipt
                </button>
              );
            },
            hideOnMobile: true,
          },
          { 
            key: "date", 
            header: "Date Listed", 
            cell: (r: any) => <span className="text-xs text-muted-foreground">{shortDate(r.expense_date || r.expenseDate || r.date || r.created_at || r.createdAt)}</span> 
          },
          {
            key: "actions",
            header: "",
            cell: (r: any) => (
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
                          await remove("expenses", r.id);
                          toast("Expense deleted.");
                        } catch {
                          toast("Failed to delete expense.");
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
                const qty = Number(v.quantity || 1);
                const unitPrice = Number(v.unit_price || 0);
                const totalAmount = v.amount ? Number(v.amount) : (unitPrice * qty);

                let formattedDate = null;
                if (v.expense_date) {
                  formattedDate = v.expense_date;
                }

                await add("expenses", {
                  title: v.title,
                  category: v.category || "Basics & Utilities",
                  unit_price: unitPrice,
                  quantity: qty,
                  amount: totalAmount,
                  method: v.method || "cash",
                  payment_method: v.method || "cash",
                  expense_date: formattedDate,
                  date: formattedDate,
                  transfer_proof: v.transfer_proof || null,
                  receipt_path: v.invoice_proof || v.receipt_path || null,
                  invoice_proof: v.invoice_proof || null,
                  notes: v.notes || "",
                });
                toast("Expense recorded successfully.");
                close();
              } catch (err: any) {
                const errMsg = err.response?.data?.message || (err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(" ") : null) || err.message || "Failed to save expense.";
                toast(errMsg);
              }
            }}
            fields={formFields}
          />
        )}
        renderEditForm={(row: any, close) => {
          const rawDate = row.expense_date || row.expenseDate || row.date || row.created_at || row.createdAt;
          let defaultDate = "";
          if (rawDate) {
            try {
              const d = new Date(rawDate);
              if (!isNaN(d.getTime())) {
                defaultDate = d.toISOString().split("T")[0];
              }
            } catch {}
          }

          const qty = Number(row.quantity || 1);
          const unitPrice = Number(row.unit_price || row.unitPrice || (qty > 0 ? (row.amount / qty) : row.amount));

          return (
            <QuickForm
              submitLabel="Save Changes"
              initialValues={{
                title: row.title || "",
                category: row.category || "Basics & Utilities",
                unit_price: unitPrice || 0,
                quantity: qty || 1,
                amount: row.amount || (unitPrice * qty),
                method: row.method || row.payment_method || "cash",
                expense_date: defaultDate,
                transfer_proof: row.transfer_proof || row.transferProof || "",
                invoice_proof: row.receipt_path || row.receiptPath || row.invoice_proof || "",
                notes: row.notes || "",
              }}
              onCancel={close}
              onSubmit={async (v) => {
                try {
                  const submitQty = Number(v.quantity || 1);
                  const submitUnitPrice = Number(v.unit_price || 0);
                  const submitTotal = v.amount ? Number(v.amount) : (submitUnitPrice * submitQty);

                  await update("expenses", row.id, {
                    ...row,
                    ...v,
                    unit_price: submitUnitPrice,
                    quantity: submitQty,
                    amount: submitTotal,
                    expense_date: v.expense_date || defaultDate || null,
                  });
                  toast("Expense updated successfully.");
                  close();
                } catch (err: any) {
                  const errMsg = err.response?.data?.message || (err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(" ") : null) || err.message || "Failed to update expense.";
                  toast(errMsg);
                }
              }}
              fields={formFields}
            />
          );
        }}
      />

      {/* Proof Preview Dialog */}
      <Dialog open={!!previewModal} onOpenChange={() => setPreviewModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewModal?.title || "Screenshot Preview"}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 bg-muted/20 rounded-lg overflow-hidden max-h-[75vh]">
            {previewModal?.url && (
              <img
                src={previewModal.url}
                alt={previewModal.title}
                className="max-h-[70vh] object-contain rounded border"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
