import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm, type FieldDef } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/stat-card";
import { useCollection, add, update, remove } from "@/mocks/store";
import { type Contract } from "@/mocks/data";
import { shortDate } from "@/lib/format";
import { useAuth } from "@/store/auth";
import { roleHas, type Role } from "@/lib/permissions";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { StaggerList } from "@/components/animations/StaggerList";
import type { FilterDef } from "@/components/data-table";
import { FileText, FileCheck, FileClock, CheckCircle2, FileX, ExternalLink } from "lucide-react";

export default function ContractsPage() {
  const { user } = useAuth();
  const canEdit = user ? roleHas(user.role as Role, "contract.manage") : false;

  const { t } = useTranslation();
  const rows = useCollection("contracts");
  const clients = useCollection("clients");
  const projects = useCollection("projects");
  const [editingRow, setEditingRow] = useState<Contract | null>(null);

  const isReadOnly = !canEdit;

  const visibleRows = isReadOnly
    ? rows.filter((r: any) => {
        if (user?.role === "client") {
          const cid = String(user.client_id);
          return String(r.clientId) === cid || String(r.client_id) === cid;
        }
        return true;
      })
    : rows;

  // Mini Dashboard Stats
  const stats = useMemo(() => {
    const active = visibleRows.filter((r: any) => r.status === "active").length;
    const draft = visibleRows.filter((r: any) => r.status === "draft").length;
    const ended = visibleRows.filter((r: any) => r.status === "ended" || r.status === "completed").length;
    const terminated = visibleRows.filter((r: any) => r.status === "terminated" || r.status === "cancelled").length;
    return { total: visibleRows.length, active, draft, ended, terminated };
  }, [visibleRows]);

  const dashboardHeader = (
    <StaggerList className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" staggerDelay={0.05}>
      <StatCard label="Total Contracts" value={stats.total} icon={FileText} />
      <StatCard label="Active" value={stats.active} icon={FileCheck} accent="primary" />
      <StatCard label="Draft" value={stats.draft} icon={FileClock} accent="warning" />
      <StatCard label="Completed / Ended" value={stats.ended} icon={CheckCircle2} accent="success" />
      <StatCard label="Terminated" value={stats.terminated} icon={FileX} accent="destructive" />
    </StaggerList>
  );

  const formFields: FieldDef[] = [
    { name: "client_id", label: t("common.fields.client") || "Client", type: "select", options: clients.map((c) => ({ value: String(c.id), label: c.name })), required: true },
    { name: "project_id", label: "Project", type: "select", options: [{ value: "", label: "— No Project —" }, ...projects.map((p) => ({ value: String(p.id), label: p.name }))] },
    {
      name: "type",
      label: t("common.fields.contractType") || "Contract Type",
      type: "select",
      defaultValue: "handover",
      options: [
        { value: "handover", label: "Project Handover (One-time)" },
        { value: "monthly", label: "Monthly Retainer / Hosting" },
        { value: "annual", label: "Annual Cloud Services" },
      ]
    },
    { name: "startDate", label: t("common.start"), type: "date" },
    { name: "endDate", label: t("common.end"), type: "date" },
    { name: "file", label: t("common.document") || "Document (PDF / Word / Excel / PPT / Image)", type: "file", accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.svg,.xlsx,.xls,.csv,.pptx,.ppt" },
    {
      name: "status",
      label: t("common.status"),
      type: "select",
      defaultValue: "draft",
      options: [
        { value: "draft", label: t("status.draft") },
        { value: "active", label: t("status.active") },
        { value: "ended", label: t("status.ended") },
        { value: "terminated", label: "Terminated" },
      ],
    },
  ];

  return (
    <ResourcePage<Contract>
      hideNewButton={!canEdit}
      hideTrashButton={!canEdit}
      collectionKey="contracts"
      title={t("nav.contracts")}
      description={t("contracts.description")}
      rows={visibleRows}
      headerContent={dashboardHeader}
      newLabel={t("contracts.new")}
      editingRow={editingRow}
      onCloseEdit={() => setEditingRow(null)}
      getSearchable={(r: any) => `${r.number || r.contract_number || ""} ${clients.find((c: any) => String(c.id) === String(r.clientId || r.client_id))?.name || ""} ${projects.find((p: any) => String(p.id) === String(r.projectId || r.project_id))?.name || ""} ${r.type || ""} ${r.status}`}
      filters={[
        {
          key: "client",
          label: "Client",
          options: clients.map((c) => ({ value: String(c.id), label: c.name })),
          accessor: (row: any) => String(row.clientId || row.client_id || ""),
        },
        {
          key: "project",
          label: "Project",
          options: projects.map((p) => ({ value: String(p.id), label: p.name })),
          accessor: (row: any) => String(row.projectId || row.project_id || ""),
        },
        {
          key: "status",
          label: "Status",
          options: [
            { value: "draft", label: "Draft" },
            { value: "active", label: "Active" },
            { value: "ended", label: "Ended" },
            { value: "terminated", label: "Terminated" },
          ],
        },
        {
          key: "type",
          label: "Type",
          options: [
            { value: "handover", label: "Project Handover" },
            { value: "monthly", label: "Monthly Retainer" },
            { value: "annual", label: "Annual Cloud" },
          ],
        },
      ] as FilterDef[]}
      columns={[
        { 
          key: "number", 
          header: t("common.number") || "Number", 
          cell: (r: any) => (
            <span className="font-mono text-xs font-semibold text-foreground/90">
              {r.number || r.contract_number || r.contractNumber || (r.id ? `CTR-${String(r.id).padStart(4, '0')}` : "—")}
            </span>
          ) 
        },
        { 
          key: "client", 
          header: t("common.client") || "Client", 
          cell: (r: any) => {
            const clientObj = clients.find((c) => String(c.id) === String(r.clientId || r.client_id)) || r.client;
            return clientObj ? (
              <span className="font-medium text-sm">{clientObj.name}</span>
            ) : (
              <span className="text-muted-foreground/60 italic text-xs">—</span>
            );
          } 
        },
        { 
          key: "project", 
          header: "Project", 
          cell: (r: any) => {
            const projectObj = projects.find((p) => String(p.id) === String(r.projectId || r.project_id)) || r.project;
            return projectObj ? (
              <span className="text-sm font-medium text-foreground/90">{projectObj.name}</span>
            ) : (
              <span className="text-muted-foreground/50 italic text-xs">— No Project —</span>
            );
          } 
        },
        { key: "start", header: t("common.start"), cell: (r: any) => shortDate(r.startDate || r.start_date), hideOnMobile: true },
        { key: "end", header: t("common.end"), cell: (r: any) => shortDate(r.endDate || r.end_date), hideOnMobile: true },
        { key: "type", header: "Type", cell: (r: any) => <span className="capitalize text-xs font-medium text-muted-foreground">{r.type ?? 'handover'}</span> },
        { key: "status", header: t("common.status"), cell: (r: any) => <StatusBadge value={r.status} /> },
        { 
          key: "file", 
          header: t("common.document") || "Document", 
          cell: (r: any) => {
            const filePath = r.file || r.document || r.filePath;
            if (!filePath) return <span className="text-muted-foreground/50 text-xs">—</span>;
            
            const fileName = typeof filePath === 'string' ? filePath.split('/').pop() : 'Document';
            const fullUrl = typeof filePath === 'string' && (filePath.startsWith('http') || filePath.startsWith('/')) 
              ? filePath 
              : `/storage/${filePath}`;

            return (
              <a 
                href={fullUrl} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline bg-primary/10 px-2.5 py-1 rounded-md transition-colors"
                title={fileName}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Open File</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            );
          }, 
          hideOnMobile: true 
        },
        { 
          key: "actions", 
          header: t("common.actions") || "Actions", 
          cell: (r: any) => (
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
                        await remove('contracts', r.id);
                        toast.success('Contract deleted successfully.');
                      } catch (err) {
                        toast.error('Failed to delete contract.');
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
            const n = rows.length + 1;
            try {
              await add("contracts", {
                number: `CTR-2026-${String(n).padStart(3, "0")}`,
                contract_number: `CTR-2026-${String(n).padStart(3, "0")}`,
                client_id: v.client_id,
                project_id: v.project_id || null,
                type: v.type,
                start_date: v.startDate ? new Date(v.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                end_date: v.endDate ? new Date(v.endDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                status: (v.status as Contract["status"]) || "draft",
                file: v.file || null,
                document: v.file || null,
              });
              toast.success("Contract created successfully.");
              close();
            } catch (err: any) {
              console.error("Failed to add contract", err);
              const errMsg = err?.response?.data?.message || (err?.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(', ') : err.message || "Failed to save contract.");
              toast.error(errMsg);
            }
          }}
          fields={formFields}
        />
      )}
      renderEditForm={(row, close) => (
        <QuickForm
          submitLabel="Save Changes"
          initialValues={{
            client_id: (row as any).clientId || (row as any).client_id || "",
            project_id: (row as any).project_id || (row as any).projectId || "",
            type: (row as any).type || "handover",
            startDate: row.startDate || (row as any).start_date ? new Date(row.startDate || (row as any).start_date).toISOString().split("T")[0] : "",
            endDate: row.endDate || (row as any).end_date ? new Date(row.endDate || (row as any).end_date).toISOString().split("T")[0] : "",
            status: row.status || "draft",
            file: (row as any).file || (row as any).document || "",
          }}
          onCancel={close}
          onSubmit={async (v) => {
            try {
              await update("contracts", row.id, { 
                ...row, 
                ...v,
                client_id: v.client_id,
                project_id: v.project_id || null,
                start_date: v.startDate ? new Date(v.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                end_date: v.endDate ? new Date(v.endDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                file: v.file || row.file || null,
                document: v.file || row.file || null,
              });
              toast.success("Contract updated successfully.");
              close();
            } catch (err: any) {
              const errMsg = err?.response?.data?.message || (err?.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(', ') : err.message || "Failed to update contract.");
              toast.error(errMsg);
            }
          }}
          fields={formFields}
        />
      )}
    />
  );
}
