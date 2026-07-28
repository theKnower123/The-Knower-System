import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add } from "@/mocks/store";
import { makeId, type HostingAccount } from "@/mocks/data";
import { shortDate } from "@/lib/format";

export default function AccountsPage() {
  const { t } = useTranslation();
  const rows = useCollection("hostingAccounts");
  const clients = useCollection("clients");
  return (
    <ResourcePage<HostingAccount>
      collectionKey="hostingAccounts"
      title={t("nav.hostingAccounts")}
      description="Client hosting plans and expirations"
      rows={rows}
      newLabel="New account"
      columns={[
        { key: "provider", header: "Provider", cell: (r) => <span className="font-medium">{r.provider}</span> },
        { key: "plan", header: "Plan", cell: (r) => r.plan },
        { key: "username", header: "Username", cell: (r) => <span className="font-mono text-xs">{r.username}</span> },
        { key: "client", header: "Client", cell: (r) => clients.find((c) => c.id === r.clientId)?.name ?? "—" },
        { key: "expiry", header: "Expires", cell: (r) => shortDate(r.expiryDate) },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={(v) => {
            add("hostingAccounts", {
              id: makeId("ho"),
              clientId: v.clientId,
              provider: v.provider,
              plan: v.plan,
              username: v.username,
              expiryDate: v.expiryDate ? new Date(v.expiryDate).toISOString() : new Date().toISOString(),
              status: "active",
            });
            close();
          }}
          fields={[
            { name: "provider", label: "Provider", type: "text", required: true },
            { name: "plan", label: "Plan", type: "text" },
            { name: "username", label: "Username", type: "text" },
            { name: "clientId", label: "Client", type: "select", options: clients.map((c) => ({ value: c.id, label: c.name })) },
            { name: "expiryDate", label: "Expires", type: "date" },
          ]}
        />
      )}
    />
  );
}
