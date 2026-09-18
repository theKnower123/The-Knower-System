import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { useCollection } from "@/mocks/store";
import { useAuth } from "@/store/auth";
import { money, shortDate } from "@/lib/format";
import { FolderKanban, FileText, Receipt, LifeBuoy } from "lucide-react";

export default function PortalPage() {
  const user = useAuth((s) => s.user);
  const clients = useCollection("clients");
  const projects = useCollection("projects");
  const invoices = useCollection("invoices");
  const tickets = useCollection("tickets");
  const contracts = useCollection("contracts");

  // Demo: use the first client so the portal has data for any signed-in role.
  const client = clients[0];
  const myProjects = projects.filter((p) => p.clientId === client?.id);
  const myInvoices = invoices.filter((i) => i.clientId === client?.id);
  const myTickets = tickets.filter((t) => t.clientId === client?.id);
  const myContracts = contracts.filter((c) => c.clientId === client?.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user?.name ?? client?.name ?? ""}`}
        description="Your projects, invoices, contracts and support in one place"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Projects" value={myProjects.length} icon={FolderKanban} />
        <StatCard label="Contracts" value={myContracts.length} icon={FileText} />
        <StatCard label="Invoices" value={myInvoices.length} icon={Receipt} />
        <StatCard label="Open tickets" value={myTickets.filter((t) => t.status !== "closed").length} icon={LifeBuoy} accent="warning" />
      </div>

      <section className="space-y-3">
        <h3 className="font-display text-lg font-semibold">Your projects</h3>
        <DataTable
          rows={myProjects}
          searchable={false}
          columns={[
            { key: "name", header: "Name", cell: (r) => <span className="font-medium">{r.name}</span> },
            { key: "status", header: "Status", cell: (r) => <StatusBadge value={r.status} /> },
            {
              key: "progress",
              header: "Progress",
              cell: (r) => (
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${r.progress}%` }} />
                  </div>
                  <span className="text-xs tabular-nums">{r.progress}%</span>
                </div>
              ),
            },
            { key: "deadline", header: "Deadline", cell: (r) => shortDate(r.deadline) },
          ]}
        />
      </section>

      <section className="space-y-3">
        <h3 className="font-display text-lg font-semibold">Your invoices</h3>
        <DataTable
          rows={myInvoices}
          searchable={false}
          columns={[
            { key: "number", header: "Number", cell: (r) => <span className="font-mono text-xs">{r.number}</span> },
            { key: "amount", header: "Amount", cell: (r) => <span className="font-semibold tabular-nums">{money(r.amount)}</span> },
            { key: "status", header: "Status", cell: (r) => <StatusBadge value={r.status} /> },
            { key: "due", header: "Due", cell: (r) => shortDate(r.dueDate) },
          ]}
        />
      </section>
    </div>
  );
}
