import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm, type FieldDef } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/stat-card";
import { StaggerList } from "@/components/animations/StaggerList";
import { useCollection, add, update, remove } from "@/mocks/store";
import { type Client } from "@/mocks/data";
import { shortDate } from "@/lib/format";
import { useAuth } from "@/store/auth";
import { roleHas, type Role } from "@/lib/permissions";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { EditIconButton } from "@/components/edit-icon-button";
import { Users, UserCheck, Key, FolderGit2 } from "lucide-react";

export default function ClientsPage() {
  const { user } = useAuth();
  const canEdit = user ? roleHas(user.role as Role, "client.manage") : false;

  const { t } = useTranslation();
  const rows = useCollection("clients");
  const projects = useCollection("projects");
  const [editingRow, setEditingRow] = useState<Client | null>(null);

  // Mini Dashboard Calculation
  const stats = useMemo(() => {
    const totalCount = rows.length;
    const activeCount = rows.filter((r: any) => !r.status || r.status === "active").length;
    const portalCount = rows.filter((r: any) => Boolean(r.user_id || r.userId)).length;
    
    // Clients with active projects
    const clientsWithProjects = new Set(projects.map((p: any) => String(p.clientId || p.client_id))).size;

    return { totalCount, activeCount, portalCount, clientsWithProjects };
  }, [rows, projects]);

  const dashboardHeader = (
    <StaggerList className="grid grid-cols-2 gap-3 sm:grid-cols-4" staggerDelay={0.05}>
      <StatCard label="Total Clients" value={stats.totalCount} icon={Users} />
      <StatCard label="Active Clients" value={stats.activeCount} icon={UserCheck} accent="success" />
      <StatCard label="Portal Enabled" value={stats.portalCount} icon={Key} accent="primary" />
      <StatCard label="With Active Projects" value={stats.clientsWithProjects} icon={FolderGit2} accent="warning" />
    </StaggerList>
  );

  const baseFields: FieldDef[] = [
    { name: "name", label: t("common.name") || "Name", type: "text", required: true },
    { name: "email", label: t("common.email") || "Email", type: "email", required: true },
    { name: "phone", label: t("common.phone") || "Phone", type: "text" },
    { name: "position", label: t("common.fields.jobPosition") || "Position", type: "text" },
  ];

  const portalFields: FieldDef[] = [
    {
      name: "create_portal_account",
      label: "Create Portal Account",
      type: "select",
      options: [
        { value: "false", label: "No portal access" },
        { value: "true", label: "Yes — enable Client Portal login" },
      ],
      defaultValue: "false",
    },
    { name: "password", label: "Portal Password (only if enabling access)", type: "password" },
  ];

  const formFields: FieldDef[] = [...baseFields, ...portalFields];

  function coercePortalFields(v: Record<string, any>) {
    return {
      ...v,
      create_portal_account: v.create_portal_account === "true",
    };
  }

  return (
    <ResourcePage<Client>
      hideNewButton={!canEdit}
      hideTrashButton={!canEdit}
      collectionKey="clients"
      title={t("nav.clients")}
      description="Clients and individuals working with The Knower"
      rows={rows}
      headerContent={dashboardHeader}
      getSearchable={(r) => `${r.name} ${r.email} ${r.position}`}
      newLabel="New client"
      editingRow={editingRow}
      onCloseEdit={() => setEditingRow(null)}
      columns={[
        { key: "name", header: t("common.name"), cell: (r) => <div><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.position}</div></div> },
        { key: "email", header: t("common.email"), cell: (r) => <span className="text-muted-foreground">{r.email}</span>, hideOnMobile: true },
        { key: "phone", header: t("common.phone"), cell: (r) => r.phone, hideOnMobile: true },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status || "active"} /> },
        { key: "portal", header: "Portal", cell: (r: any) => (r.user_id || r.userId) ? <span className="text-xs font-semibold text-green-600">Enabled</span> : <span className="text-xs text-muted-foreground">—</span> },
        { key: "created", header: t("common.created"), cell: (r) => <span className="text-xs text-muted-foreground">{shortDate(r.createdAt)}</span> },
        {
          key: "actions",
          header: t("common.actions") || "Actions",
          cell: (r) => (
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
                        await remove('clients', r.id);
                        toast.success('Client deleted successfully.');
                      } catch (err) {
                        toast.error('Failed to delete client.');
                      }
                    }}
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
            try {
              await add("clients", { ...coercePortalFields(v), status: "active" });
              toast.success("Client created successfully.");
              close();
            } catch (err: any) {
              console.error("Failed to add client", err);
              toast.error(err.response?.data?.message || "Failed to save client.");
            }
          }}
          fields={formFields}
        />
      )}
      renderEditForm={(row, close) => (
        <QuickForm
          submitLabel="Save Changes"
          initialValues={{
            name: row.name,
            email: row.email,
            phone: row.phone || "",
            position: row.position || "",
            create_portal_account: (row as any).user_id ? "true" : "false",
          }}
          onCancel={close}
          onSubmit={async (v) => {
            try {
              await update("clients", row.id, { ...row, ...coercePortalFields(v) });
              toast.success("Client updated successfully.");
              close();
            } catch (err: any) {
              console.error("Failed to update client", err);
              toast.error(err.response?.data?.message || "Failed to update client.");
            }
          }}
          fields={formFields}
        />
      )}
    />
  );
}
