import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm, type FieldDef } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/stat-card";
import { StaggerList } from "@/components/animations/StaggerList";
import { useCollection, add, update, remove } from "@/mocks/store";
import { type Quotation } from "@/mocks/data";
import { money, shortDate } from "@/lib/format";
import { useAuth } from "@/store/auth";
import { roleHas, type Role } from "@/lib/permissions";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import type { FilterDef } from "@/components/data-table";
import { FileSpreadsheet, CheckCircle2, Clock, XCircle, DollarSign } from "lucide-react";

export default function QuotationsPage() {
  const { user } = useAuth();
  const canEdit = user ? roleHas(user.role as Role, "quotation.manage") : false;

  const { t } = useTranslation();
  const rows = useCollection("quotations");
  const clients = useCollection("clients");
  const leads = useCollection("leads");
  const [editingRow, setEditingRow] = useState<Quotation | null>(null);

  // Mini Dashboard Calculation
  const stats = useMemo(() => {
    const totalCount = rows.length;
    const totalValue = rows.reduce((sum, r: any) => sum + (Number(r.totalAmount || r.price) || 0), 0);
    const acceptedRows = rows.filter((r: any) => r.status === "accepted");
    const acceptedValue = acceptedRows.reduce((sum, r: any) => sum + (Number(r.totalAmount || r.price) || 0), 0);
    const sentRows = rows.filter((r: any) => r.status === "sent");
    const sentValue = sentRows.reduce((sum, r: any) => sum + (Number(r.totalAmount || r.price) || 0), 0);
    const draftCount = rows.filter((r: any) => r.status === "draft").length;
    const rejectedCount = rows.filter((r: any) => r.status === "rejected").length;

    return { totalCount, totalValue, acceptedCount: acceptedRows.length, acceptedValue, sentCount: sentRows.length, sentValue, draftCount, rejectedCount };
  }, [rows]);

  const dashboardHeader = (
    <StaggerList className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" staggerDelay={0.05}>
      <StatCard label="Total Proposals" value={money(stats.totalValue)} icon={FileSpreadsheet} description={`${stats.totalCount} quotations`} />
      <StatCard label="Accepted Value" value={money(stats.acceptedValue)} icon={CheckCircle2} accent="success" description={`${stats.acceptedCount} accepted`} />
      <StatCard label="Pending Sent" value={money(stats.sentValue)} icon={Clock} accent="primary" description={`${stats.sentCount} sent`} />
      <StatCard label="Draft Quotations" value={stats.draftCount} icon={DollarSign} accent="warning" />
      <StatCard label="Rejected" value={stats.rejectedCount} icon={XCircle} accent="destructive" />
    </StaggerList>
  );

  const targetOptions = [
    ...clients.map((c) => ({ value: `client_${c.id}`, label: `(Client) ${c.name}` })),
    ...leads.map((l) => ({ value: `lead_${l.id}`, label: `(Lead) ${l.name}` })),
  ];

  const formFields: FieldDef[] = [
    { name: "targetId", label: "Client / Lead", type: "select", options: targetOptions, required: true },
    { name: "price", label: "Total Amount", type: "number", required: true },
    { 
      name: "currency", 
      label: "Currency", 
      type: "select", 
      defaultValue: "USD",
      options: [
        { value: "USD", label: "USD – US Dollar" },
        { value: "EUR", label: "EUR – Euro" },
        { value: "GBP", label: "GBP – British Pound" },
        { value: "EGP", label: "EGP – Egyptian Pound" },
        { value: "SAR", label: "SAR – Saudi Riyal" },
        { value: "AED", label: "AED – UAE Dirham" },
        { value: "KWD", label: "KWD – Kuwaiti Dinar" },
        { value: "QAR", label: "QAR – Qatari Riyal" },
        { value: "BHD", label: "BHD – Bahraini Dinar" },
        { value: "OMR", label: "OMR – Omani Rial" },
        { value: "JOD", label: "JOD – Jordanian Dinar" },
        { value: "LBP", label: "LBP – Lebanese Pound" },
        { value: "MAD", label: "MAD – Moroccan Dirham" },
        { value: "TND", label: "TND – Tunisian Dinar" },
        { value: "DZD", label: "DZD – Algerian Dinar" },
        { value: "LYD", label: "LYD – Libyan Dinar" },
        { value: "SDG", label: "SDG – Sudanese Pound" },
        { value: "IQD", label: "IQD – Iraqi Dinar" },
        { value: "SYP", label: "SYP – Syrian Pound" },
        { value: "YER", label: "YER – Yemeni Rial" },
        { value: "TRY", label: "TRY – Turkish Lira" },
        { value: "JPY", label: "JPY – Japanese Yen" },
        { value: "CNY", label: "CNY – Chinese Yuan" },
        { value: "INR", label: "INR – Indian Rupee" },
        { value: "CAD", label: "CAD – Canadian Dollar" },
        { value: "AUD", label: "AUD – Australian Dollar" },
        { value: "CHF", label: "CHF – Swiss Franc" },
        { value: "SEK", label: "SEK – Swedish Krona" },
        { value: "NOK", label: "NOK – Norwegian Krone" },
        { value: "DKK", label: "DKK – Danish Krone" },
        { value: "PLN", label: "PLN – Polish Zloty" },
        { value: "RUB", label: "RUB – Russian Ruble" },
        { value: "BRL", label: "BRL – Brazilian Real" },
        { value: "MXN", label: "MXN – Mexican Peso" },
        { value: "ZAR", label: "ZAR – South African Rand" },
        { value: "NGN", label: "NGN – Nigerian Naira" },
        { value: "KES", label: "KES – Kenyan Shilling" },
        { value: "GHS", label: "GHS – Ghanaian Cedi" },
        { value: "PKR", label: "PKR – Pakistani Rupee" },
        { value: "BDT", label: "BDT – Bangladeshi Taka" },
        { value: "IDR", label: "IDR – Indonesian Rupiah" },
        { value: "MYR", label: "MYR – Malaysian Ringgit" },
        { value: "SGD", label: "SGD – Singapore Dollar" },
        { value: "THB", label: "THB – Thai Baht" },
        { value: "VND", label: "VND – Vietnamese Dong" },
        { value: "KRW", label: "KRW – South Korean Won" },
        { value: "HKD", label: "HKD – Hong Kong Dollar" },
        { value: "NZD", label: "NZD – New Zealand Dollar" },
      ]
    },
    { name: "validUntil", label: "Valid until", type: "date" },
    {
      name: "status",
      label: "Status",
      type: "select",
      defaultValue: "draft",
      options: [
        { value: "draft", label: "Draft" },
        { value: "sent", label: "Sent" },
        { value: "accepted", label: "Accepted" },
        { value: "rejected", label: "Rejected" },
      ],
    },
  ];

  return (
    <ResourcePage<Quotation>
      hideNewButton={!canEdit}
      hideTrashButton={!canEdit}
      collectionKey="quotations"
      title={t("nav.quotations")}
      description="Price proposals & quotations sent to clients"
      rows={rows}
      headerContent={dashboardHeader}
      newLabel="New quotation"
      editingRow={editingRow}
      onCloseEdit={() => setEditingRow(null)}
      getSearchable={(r) => {
        const client = clients.find((c: any) => c.id === r.clientId);
        const lead = leads.find((l: any) => l.id === (r as any).leadId);
        return `${r.number || ""} ${client?.name || ""} ${lead?.name || ""} ${r.status} ${r.currency || ""}`;
      }}
      filters={[
        {
          key: "status",
          label: "Status",
          options: [
            { value: "draft", label: "Draft" },
            { value: "sent", label: "Sent" },
            { value: "accepted", label: "Accepted" },
            { value: "rejected", label: "Rejected" },
          ],
        },
      ] as FilterDef[]}
      columns={[
        { key: "number", header: "Number", cell: (r) => <span className="font-mono text-xs">{r.number}</span> },
        { key: "client", header: "Client / Lead", cell: (r) => {
          const client = clients.find((c) => c.id === r.clientId);
          const lead = leads.find((l) => l.id === (r as any).leadId);
          return client?.name || lead?.name || "—";
        }},
        { key: "price", header: "Price", cell: (r) => <span className="tabular-nums font-semibold">{money(r.price || (r as any).totalAmount || 0, r.currency)}</span> },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
        { key: "valid", header: "Valid until", cell: (r) => shortDate(r.validUntil), hideOnMobile: true },
        { 
          key: "actions", 
          header: t("common.actions") || "Actions", 
          cell: (r) => (
            <div className="flex gap-2 justify-end">
              {canEdit && (
                <>
                  <button 
                    className="text-primary hover:underline text-sm font-medium"
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
                        await remove('quotations', r.id);
                        toast.success('Quotation deleted successfully.');
                      } catch (err) {
                        toast.error('Failed to delete quotation.');
                      }
                    }}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
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
            const isLead = v.targetId?.startsWith('lead_');
            const targetId = v.targetId?.replace('client_', '')?.replace('lead_', '');
            
            try {
              await add("quotations", {
                clientId: isLead ? null : targetId,
                leadId: isLead ? targetId : null,
                totalAmount: Number(v.price || 0),
                currency: v.currency || "USD",
                status: (v.status as Quotation["status"]) || "draft",
                issueDate: new Date().toISOString(),
                validUntil: v.validUntil ? new Date(v.validUntil).toISOString() : new Date().toISOString(),
              });
              toast.success("Quotation created successfully.");
              close();
            } catch (err: any) {
              toast.error(err.response?.data?.message || "Failed to save quotation.");
            }
          }}
          fields={formFields}
        />
      )}
      renderEditForm={(row, close) => {
        const currentTarget = row.clientId 
          ? `client_${row.clientId}` 
          : (row as any).leadId 
            ? `lead_${(row as any).leadId}` 
            : "";
        
        return (
          <QuickForm
            submitLabel="Save Changes"
            initialValues={{
              targetId: currentTarget,
              price: (row as any).totalAmount || row.price || 0,
              currency: row.currency || "USD",
              validUntil: row.validUntil ? new Date(row.validUntil).toISOString().split("T")[0] : "",
              status: row.status || "draft",
            }}
            onCancel={close}
            onSubmit={async (v) => {
              const isLead = v.targetId?.startsWith('lead_');
              const targetId = v.targetId?.replace('client_', '')?.replace('lead_', '');
              
              try {
                await update("quotations", row.id, {
                  ...row,
                  clientId: isLead ? null : targetId,
                  leadId: isLead ? targetId : null,
                  totalAmount: Number(v.price || 0),
                  currency: v.currency || "USD",
                  status: v.status,
                  validUntil: v.validUntil ? new Date(v.validUntil).toISOString() : row.validUntil,
                });
                toast.success("Quotation updated successfully.");
                close();
              } catch (err: any) {
                toast.error("Failed to update quotation.");
              }
            }}
            fields={formFields}
          />
        );
      }}
    />
  );
}
