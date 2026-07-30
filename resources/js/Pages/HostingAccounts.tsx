import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { useAuth } from "@/store/auth";
import { roleHas, type Role } from "@/lib/permissions";
import { QuickForm } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add, remove } from "@/mocks/store";
import { toast } from "sonner";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { makeId, type HostingAccount } from "@/mocks/data";
import { shortDate } from "@/lib/format";

export default function AccountsPage() {
  const { user } = useAuth();
  const canEdit = user ? roleHas(user.role as Role, "hosting.manage") : false;
  

  const { t } = useTranslation();
  const rows = useCollection("hostingAccounts");
  const clients = useCollection("clients");
  return (
    <ResourcePage<HostingAccount>
      hideNewButton={!canEdit}
      hideTrashButton={!canEdit}
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
        ...(canEdit ? [{
          key: "actions",
          header: "",
          cell: (r: any) => (
            <div className="flex justify-end">
              <ConfirmDeleteButton
                onConfirm={async () => {
                  try {
                    await remove('hostingAccounts', r.id);
                    toast.success('Moved to Trash');
                  } catch (e) {
                    toast.error('Delete failed');
                  }
                }}
                className="text-red-500 hover:text-red-700 text-sm font-medium px-2"
              />
            </div>
          )
        }] : [])
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
