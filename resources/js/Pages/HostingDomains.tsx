import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm, type FieldDef } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/stat-card";
import { StaggerList } from "@/components/animations/StaggerList";
import { useCollection, add, update, remove } from "@/mocks/store";
import { makeId, type Domain } from "@/mocks/data";
import { shortDate } from "@/lib/format";
import { useAuth } from "@/store/auth";
import { roleHas, type Role } from "@/lib/permissions";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import type { FilterDef } from "@/components/data-table";
import { Globe, ShieldCheck, Clock, AlertOctagon, RefreshCw } from "lucide-react";

export default function DomainsPage() {
  const { user } = useAuth();
  const canEdit = user ? roleHas(user.role as Role, "domain.manage") : false;

  const { t } = useTranslation();
  const rows = useCollection("domains");
  const clients = useCollection("clients");
  const projects = useCollection("projects");
  const [editingRow, setEditingRow] = useState<Domain | null>(null);

  // Mini Dashboard Calculation
  const stats = useMemo(() => {
    const totalCount = rows.length;
    const activeCount = rows.filter((r: any) => r.status === "active").length;
    const expiredCount = rows.filter((r: any) => r.status === "expired").length;
    const autoRenewCount = rows.filter((r: any) => r.autoRenew).length;
    
    // Expiring within 30 days
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const expiringSoonCount = rows.filter((r: any) => {
      if (!r.expiryDate || r.status === "expired") return false;
      const exp = new Date(r.expiryDate);
      return exp >= now && exp <= in30Days;
    }).length;

    return { totalCount, activeCount, expiredCount, autoRenewCount, expiringSoonCount };
  }, [rows]);

  const dashboardHeader = (
    <StaggerList className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" staggerDelay={0.05}>
      <StatCard label="Total Domains" value={stats.totalCount} icon={Globe} />
      <StatCard label="Active Domains" value={stats.activeCount} icon={ShieldCheck} accent="success" />
      <StatCard label="Expiring Soon" value={stats.expiringSoonCount} icon={Clock} accent="warning" description="Within 30 days" />
      <StatCard label="Expired Domains" value={stats.expiredCount} icon={AlertOctagon} accent="destructive" />
      <StatCard label="Auto-Renew On" value={stats.autoRenewCount} icon={RefreshCw} accent="primary" />
    </StaggerList>
  );

  // Filters
  const filters: FilterDef[] = [
    {
      key: "client",
      label: "Client",
      options: clients.map((c) => ({ value: c.id as string, label: c.name })),
      accessor: (row: any) => row.clientId || row.client_id || "",
    },
    {
      key: "project",
      label: "Project",
      options: projects.map((p) => ({ value: p.id as string, label: p.name })),
      accessor: (row: any) => row.projectId || row.project_id || "",
    },
    {
      key: "status",
      label: "Status",
      options: [
        { value: "active", label: "Active" },
        { value: "expired", label: "Expired" },
        { value: "transferred", label: "Transferred" },
        { value: "pending", label: "Pending" },
      ],
    },
  ];

  const formFields: FieldDef[] = [
    { name: "domain", label: "Domain", type: "text", required: true },
    { name: "clientId", label: "Client", type: "select", options: [{ value: "", label: "— No client —" }, ...clients.map((c) => ({ value: c.id as string, label: c.name }))] },
    { name: "projectId", label: "Project", type: "select", options: [{ value: "", label: "— No project —" }, ...projects.map((p) => ({ value: p.id as string, label: p.name }))] },
    { name: "registrar", label: "Registrar", type: "text", defaultValue: "Namecheap" },
    { name: "expiryDate", label: "Expires", type: "date" },
    { name: "autoRenew", label: "Auto-renew", type: "select", defaultValue: "yes", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }] },
    {
      name: "status",
      label: "Status",
      type: "select",
      defaultValue: "active",
      options: [
        { value: "active", label: "Active" },
        { value: "expired", label: "Expired" },
        { value: "transferred", label: "Transferred" },
        { value: "pending", label: "Pending" },
      ],
    },
  ];

  return (
    <ResourcePage<Domain>
      hideNewButton={!canEdit}
      hideTrashButton={!canEdit}
      collectionKey="domains"
      title={t("nav.domains")}
      description="Registered domains & renewals — linked to clients and projects"
      rows={rows}
      headerContent={dashboardHeader}
      newLabel="Add domain"
      editingRow={editingRow}
      onCloseEdit={() => setEditingRow(null)}
      filters={filters}
      getSearchable={(r) => `${r.domain} ${r.registrar || ""} ${r.status} ${clients.find((c) => c.id === r.clientId)?.name || ""}`}
      columns={[
        { key: "domain", header: "Domain", cell: (r) => <span className="font-mono">{r.domain}</span> },
        { key: "client", header: "Client", cell: (r) => clients.find((c) => c.id === r.clientId)?.name ?? <span className="text-muted-foreground/50">—</span> },
        {
          key: "project",
          header: "Project",
          cell: (r) => {
            const proj = projects.find((p) => p.id === (r as any).projectId);
            return proj ? <span className="text-xs">{proj.name}</span> : <span className="text-muted-foreground/50">—</span>;
          },
          hideOnMobile: true,
        },
        { key: "registrar", header: "Registrar", cell: (r) => r.registrar, hideOnMobile: true },
        { key: "expiry", header: "Expires", cell: (r) => shortDate(r.expiryDate) },
        { key: "auto", header: "Auto-renew", cell: (r) => (r.autoRenew ? "Yes" : "No"), hideOnMobile: true },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
        {
          key: "actions",
          header: "",
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
                        await remove("domains", r.id);
                        toast.success("Domain deleted.");
                      } catch {
                        toast.error("Failed to delete domain.");
                      }
                    }}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
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
              await add("domains", {
                id: makeId("dm"),
                clientId: v.clientId || null,
                projectId: v.projectId || null,
                domain: v.domain,
                registrar: v.registrar || "Namecheap",
                expiryDate: v.expiryDate ? new Date(v.expiryDate).toISOString() : new Date().toISOString(),
                autoRenew: v.autoRenew === "yes",
                status: v.status || "active",
              });
              toast.success("Domain added successfully.");
              close();
            } catch (err: any) {
              toast.error(err.response?.data?.message || "Failed to add domain.");
            }
          }}
          fields={formFields}
        />
      )}
      renderEditForm={(row, close) => (
        <QuickForm
          submitLabel="Save Changes"
          initialValues={{
            domain: row.domain,
            clientId: row.clientId || "",
            projectId: (row as any).projectId || "",
            registrar: row.registrar || "Namecheap",
            expiryDate: row.expiryDate ? new Date(row.expiryDate).toISOString().split("T")[0] : "",
            autoRenew: row.autoRenew ? "yes" : "no",
            status: row.status || "active",
          }}
          onCancel={close}
          onSubmit={async (v) => {
            try {
              await update("domains", row.id, {
                ...row,
                ...v,
                autoRenew: v.autoRenew === "yes",
                expiryDate: v.expiryDate ? new Date(v.expiryDate).toISOString() : row.expiryDate,
              });
              toast.success("Domain updated successfully.");
              close();
            } catch (err: any) {
              toast.error("Failed to update domain.");
            }
          }}
          fields={formFields}
        />
      )}
    />
  );
}
