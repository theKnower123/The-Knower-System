import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add } from "@/mocks/store";
import { makeId, type Ticket } from "@/mocks/data";
import { shortDate } from "@/lib/format";

export default function TicketsPage() {
  const { t } = useTranslation();
  const rows = useCollection("tickets");
  const clients = useCollection("clients");
  return (
    <ResourcePage<Ticket>
      title={t("nav.tickets")}
      description="Client support conversations"
      rows={rows}
      newLabel="New ticket"
      columns={[
        { key: "number", header: "Number", cell: (r) => <Link href={`/support/tickets/${r.id}`} className="font-mono text-xs hover:text-primary">{r.number}</Link> },
        { key: "subject", header: "Subject", cell: (r) => <span className="font-medium">{r.subject}</span> },
        { key: "client", header: "Client", cell: (r) => clients.find((c) => c.id === r.clientId)?.name ?? "—" },
        { key: "priority", header: "Priority", cell: (r) => <StatusBadge value={r.priority} /> },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
        { key: "created", header: t("common.created"), cell: (r) => <span className="text-xs text-muted-foreground">{shortDate(r.createdAt)}</span> },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={(v) => {
            const n = 1002 + rows.length;
            add("tickets", {
              id: makeId("tc"),
              number: `TCK-${n}`,
              clientId: v.clientId,
              subject: v.subject,
              priority: (v.priority as Ticket["priority"]) || "medium",
              status: "open",
              assignedTo: "Support",
              createdAt: new Date().toISOString(),
              messages: [{ id: makeId("m"), sender: "Client", message: v.message || "New issue", createdAt: new Date().toISOString() }],
            });
            close();
          }}
          fields={[
            { name: "subject", label: "Subject", type: "text", required: true },
            { name: "clientId", label: "Client", type: "select", options: clients.map((c) => ({ value: c.id, label: c.name })), required: true },
            {
              name: "priority",
              label: "Priority",
              type: "select",
              defaultValue: "medium",
              options: [
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
                { value: "urgent", label: "Urgent" },
              ],
            },
            { name: "message", label: "First message", type: "textarea" },
          ]}
        />
      )}
    />
  );
}
