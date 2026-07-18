import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add } from "@/mocks/store";
import { makeId, type Contract } from "@/mocks/data";
import { shortDate } from "@/lib/format";

export default function ContractsPage() {
  const { t } = useTranslation();
  const rows = useCollection("contracts");
  const clients = useCollection("clients");
  return (
    <ResourcePage<Contract>
      title={t("nav.contracts")}
      description={t("contracts.description")}
      rows={rows}
      newLabel={t("contracts.new")}
      columns={[
        { key: "number", header: t("common.number"), cell: (r) => <span className="font-mono text-xs">{r.number}</span> },
        { key: "client", header: t("common.client"), cell: (r) => clients.find((c) => c.id === r.clientId)?.name ?? "—" },
        { key: "start", header: t("common.start"), cell: (r) => shortDate(r.startDate) },
        { key: "end", header: t("common.end"), cell: (r) => shortDate(r.endDate) },
        { key: "amount", header: t("common.amount"), cell: (r) => `$${r.amount?.toLocaleString() ?? 0}` },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
        { key: "file", header: t("common.document"), cell: () => <span className="text-muted-foreground text-xs underline cursor-pointer hover:text-primary">Download</span> }
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
                start_date: v.startDate ? new Date(v.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                end_date: v.endDate ? new Date(v.endDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                amount: Number(v.amount) || 0,
                status: (v.status as Contract["status"]) || "draft",
              });
              close();
            } catch (err: any) {
              console.error("Failed to add contract", err);
              alert(err.response?.data?.message || "Failed to save contract.");
            }
          }}
          fields={[
            { name: "client_id", label: t("common.client"), type: "select", options: clients.map((c) => ({ value: c.id, label: c.name })), required: true },
            { name: "startDate", label: t("common.start"), type: "date" },
            { name: "endDate", label: t("common.end"), type: "date" },
            { name: "amount", label: t("common.amount"), type: "text" },
            { name: "file", label: t("common.document"), type: "file" },
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
          ]}
        />
      )}
    />
  );
}
