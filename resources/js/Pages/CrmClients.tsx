import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add } from "@/mocks/store";
import { makeId, type Client } from "@/mocks/data";
import { shortDate } from "@/lib/format";

export default function ClientsPage() {
  const { t } = useTranslation();
  const rows = useCollection("clients");
  const companies = useCollection("companies");

  return (
    <ResourcePage<Client>
      title={t("nav.clients")}
      description="Companies and individuals working with The Knower"
      rows={rows}
      getSearchable={(r) => `${r.name} ${r.email} ${r.position}`}
      newLabel="New client"
      columns={[
        { key: "name", header: t("common.name"), cell: (r) => <div><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.position}</div></div> },
        { key: "company", header: "Company", cell: (r) => companies.find((c) => c.id === r.companyId)?.name ?? "—" },
        { key: "email", header: t("common.email"), cell: (r) => <span className="text-muted-foreground">{r.email}</span> },
        { key: "phone", header: t("common.phone"), cell: (r) => r.phone },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
        { key: "created", header: t("common.created"), cell: (r) => <span className="text-xs text-muted-foreground">{shortDate(r.createdAt)}</span> },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={async (v) => {
            try {
              await add("clients", {
                company_id: v.company_id || null,
                name: v.name,
                email: v.email,
                phone: v.phone,
                position: v.position,
                status: "active",
              });
              close();
            } catch (err: any) {
              console.error("Failed to add client", err);
              alert(err.response?.data?.message || "Failed to save client.");
            }
          }}
          fields={[
            { name: "name", label: t("common.name"), type: "text", required: true },
            { name: "email", label: t("common.email"), type: "email", required: true },
            { name: "phone", label: t("common.phone"), type: "text" },
            { name: "position", label: "Position", type: "text" },
            {
              name: "company_id",
              label: "Company",
              type: "select",
              options: companies.map((c) => ({ value: c.id, label: c.name })),
            },
          ]}
        />
      )}
    />
  );
}
