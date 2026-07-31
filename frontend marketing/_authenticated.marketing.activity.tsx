import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { MarketingNav } from "@/components/marketing";
import { DataTable } from "@/components/data-table";
import { useMarketing } from "@/mocks/marketing-ops";
import { shortDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/marketing/activity")({
  head: () => ({
    meta: [
      { title: "Marketing Activity Log — The Knower OS" },
      { name: "description", content: "Accountability trail of every visibility, approval and account change." },
    ],
  }),
  component: ActivityPage,
});

function ActivityPage() {
  const logs = useMarketing("activityLogs");
  return (
    <div>
      <PageHeader title="Activity Log" description="Who changed what, and when" />
      <MarketingNav />
      <DataTable
        rows={logs}
        getSearchable={(l) => `${l.actor} ${l.action} ${l.target}`}
        columns={[
          { key: "actor", header: "Actor", cell: (l) => <span className="font-medium">{l.actor}</span> },
          { key: "action", header: "Action", cell: (l) => l.action },
          { key: "target", header: "Target", cell: (l) => <span className="text-muted-foreground">{l.target}</span> },
          { key: "at", header: "When", cell: (l) => shortDate(l.at) },
        ]}
      />
    </div>
  );
}
