import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm, type FieldDef } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/stat-card";
import { StaggerList } from "@/components/animations/StaggerList";
import { useCollection, add, update, remove } from "@/mocks/store";
import { makeId, type Payment } from "@/mocks/data";
import { money, shortDate } from "@/lib/format";
import { useAuth } from "@/store/auth";
import { roleHas, type Role } from "@/lib/permissions";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { EditIconButton } from "@/components/edit-icon-button";
import { ImageIcon, X, Wallet, Banknote, ArrowDownRight, Smartphone } from "lucide-react";
import type { FilterDef } from "@/components/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "vodafone_cash", label: "Vodafone Cash" },
  { value: "instapay", label: "InstaPay" },
  { value: "paypal", label: "PayPal" },
  { value: "stripe", label: "Stripe" },
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

export default function PaymentsPage() {
    const { user } = useAuth();
    const canEdit = user ? roleHas(user.role as Role, "payment.manage") : false;

  const { t } = useTranslation();
  const rows = useCollection("payments") || [];
  const invoices = useCollection("invoices") || [];
  const clients = useCollection("clients") || [];
  const [editingRow, setEditingRow] = useState<Payment | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  
  const isReadOnly = !canEdit;

  const visibleRows = isReadOnly
    ? rows.filter((r: any) => {
        if (!r) return false;
        if (user?.role === "client") {
          const inv = invoices.find((i: any) => i && (String(i.id) === String(r.invoiceId) || String(i.id) === String(r.invoice_id)));
          if (!inv) return false;
          const cid = String(user.client_id);
          return String(inv.clientId) === cid || String(inv.client_id) === cid;
        }
        return true;
      })
    : rows;

  // Mini Dashboard Calculation
  const stats = useMemo(() => {
    const totalAmount = visibleRows.reduce((sum, r: any) => sum + (Number(r?.amount) || 0), 0);
    const cashRows = visibleRows.filter((r: any) => r?.method === "cash");
    const cashAmount = cashRows.reduce((sum, r: any) => sum + (Number(r?.amount) || 0), 0);
    const bankRows = visibleRows.filter((r: any) => r?.method === "bank_transfer" || r?.method === "instapay");
    const bankAmount = bankRows.reduce((sum, r: any) => sum + (Number(r?.amount) || 0), 0);
    const vfRows = visibleRows.filter((r: any) => r?.method === "vodafone_cash");
    const vfAmount = vfRows.reduce((sum, r: any) => sum + (Number(r?.amount) || 0), 0);

    return {
      totalCount: visibleRows.length,
      totalAmount,
      cashCount: cashRows.length,
      cashAmount,
      bankCount: bankRows.length,
      bankAmount,
      vfCount: vfRows.length,
      vfAmount,
    };
  }, [visibleRows]);

  const dashboardHeader = (
    <StaggerList className="grid grid-cols-2 gap-3 sm:grid-cols-4" staggerDelay={0.05}>
      <StatCard label="Total Collected" value={money(stats.totalAmount)} icon={Wallet} delta={`${stats.totalCount} transactions`} />
      <StatCard label="Cash Received" value={money(stats.cashAmount)} icon={Banknote} accent="success" delta={`${stats.cashCount} payments`} />
      <StatCard label="Bank / InstaPay" value={money(stats.bankAmount)} icon={ArrowDownRight} accent="primary" delta={`${stats.bankCount} transfers`} />
      <StatCard label="Vodafone Cash" value={money(stats.vfAmount)} icon={Smartphone} accent="warning" delta={`${stats.vfCount} transfers`} />
    </StaggerList>
  );

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
      options: invoices.filter(Boolean).map((i: any) => ({ value: String(i.id), label: i.number || i.invoiceNumber || `INV-${i.id}` })),
      accessor: (row: any) => String(row?.invoiceId || row?.invoice_id || ""),
    },
  ];

  const formFields: FieldDef[] = [
    { 
      name: "invoiceId", 
      label: "Invoice", 
      type: "select", 
      options: invoices.filter(Boolean).map((i: any) => {
        const client = i.client || clients.find((c: any) => c && String(c.id) === String(i.clientId || i.client_id));
        const invNum = i.invoiceNumber || i.number || `INV-${i.id}`;
        const invAmt = i.amount || i.totalAmount || i.total_amount || 0;
        return { value: String(i.id), label: `${invNum} — ${client?.name || "Client #" + (i.clientId || i.client_id || "?")} — ${money(invAmt)}` };
      }), 
      required: true 
    },
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
    <>
      <ResourcePage<Payment>
        hideNewButton={!canEdit}
        hideTrashButton={!canEdit}
        collectionKey="payments"
        title={t("nav.payments")}
        description="Payments received against invoices — track every transaction with proof"
        rows={visibleRows}
        headerContent={dashboardHeader}
        newLabel="Record payment"
        editingRow={editingRow}
        onCloseEdit={() => setEditingRow(null)}
        filters={filters}
        getSearchable={(r: any) => {
          if (!r) return "";
          const inv = invoices.find((i: any) => i && String(i.id) === String(r.invoiceId || r.invoice_id));
          return `${inv?.number || inv?.invoiceNumber || ""} ${r.method || ""} ${r.reference || ""} ${r.amount || ""}`;
        }}
        columns={[
          {
            key: "invoice",
            header: "Invoice",
            cell: (r: any) => {
              if (!r) return null;
              const inv = invoices.find((i: any) => i && String(i.id) === String(r.invoiceId || r.invoice_id));
              const client = inv ? (inv.client || clients.find((c: any) => c && String(c.id) === String(inv.clientId || inv.client_id))) : null;
              return (
                <div>
                  <span className="font-mono text-xs">{inv?.number || inv?.invoiceNumber || r.invoiceId || r.invoice_id || "—"}</span>
                  {client && <div className="text-[11px] text-muted-foreground">{client.name}</div>}
                </div>
              );
            },
          },
          {
            key: "method",
            header: "Method",
            cell: (r: any) => {
              const label = PAYMENT_METHODS.find((m) => m.value === r?.method)?.label || r?.method || "Other";
              return <StatusBadge value={label} />;
            },
          },
          {
            key: "amount",
            header: t("common.amount"),
            cell: (r: any) => <span className="font-semibold tabular-nums">{money(r?.amount || 0)}</span>,
          },
          {
            key: "paid",
            header: "Paid at",
            cell: (r: any) => <span className="text-xs text-muted-foreground">{shortDate(r?.paidAt || r?.paid_at || r?.payment_date || r?.paymentDate)}</span>,
          },
          {
            key: "ref",
            header: "Reference",
            cell: (r: any) => <span className="text-xs text-muted-foreground">{r?.reference || "—"}</span>,
            hideOnMobile: true,
          },
          {
            key: "proof",
            header: "Proof",
            cell: (r: any) => {
              const rawProof = r?.transfer_proof || r?.transferProof || r?.proof;
              const url = getProofUrl(rawProof);
              if (!url) return <span className="text-xs text-muted-foreground/50">—</span>;
              return (
                <button
                  type="button"
                  onClick={() => setProofPreview(url)}
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
            cell: (r: any) => (
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
                          await remove("payments", r.id);
                          toast("Payment deleted.");
                        } catch {
                          toast("Failed to delete payment.");
                        }
                      }}
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
        renderEditForm={(row, close) => {
          const rawDate = row.paidAt || (row as any).paid_at || (row as any).payment_date || (row as any).paymentDate;
          let defaultPaidAt = "";
          if (rawDate) {
            try {
              const d = new Date(rawDate);
              if (!isNaN(d.getTime())) {
                defaultPaidAt = d.toISOString().split("T")[0];
              }
            } catch {}
          }

          return (
            <QuickForm
              submitLabel="Save Changes"
              initialValues={{
                invoiceId: String(row.invoiceId || (row as any).invoice_id || ""),
                amount: row.amount || 0,
                method: row.method || (row as any).payment_method || "bank_transfer",
                paidAt: defaultPaidAt,
                reference: row.reference || "",
                transfer_proof: (row as any).transfer_proof || (row as any).transferProof || "",
                notes: (row as any).notes || "",
              }}
              onCancel={close}
              onSubmit={async (v) => {
                try {
                  await update("payments", row.id, {
                    ...row,
                    ...v,
                    amount: Number(v.amount || 0),
                    paidAt: v.paidAt ? new Date(v.paidAt).toISOString() : (rawDate || new Date().toISOString()),
                  });
                  toast("Payment updated successfully.");
                  close();
                } catch (err: any) {
                  toast("Failed to update payment.");
                }
              }}
              fields={formFields}
            />
          );
        }}
      />

      {/* Proof Preview Dialog */}
      <Dialog open={!!proofPreview} onOpenChange={() => setProofPreview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Payment Transfer Proof
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 bg-muted/20 rounded-lg overflow-hidden">
            {proofPreview && (
              <img
                src={proofPreview}
                alt="Transfer Proof"
                className="max-h-[70vh] object-contain rounded border"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

