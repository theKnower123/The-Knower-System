import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm, type FieldDef } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { type Lead } from "@/mocks/data";
import { money, shortDate } from "@/lib/format";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/store/auth";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import type { FilterDef } from "@/components/data-table";

export default function LeadsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const [editingRow, setEditingRow] = useState<Lead | null>(null);
  const canEdit = ["super_admin", "ceo", "project_manager", "team_leader", "hr"].includes(user?.role || "");

  const { data: rows = [] } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/leads");
      return res.data.data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      return axios.post("/api/v1/leads", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead created successfully.");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create lead.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string | number, data: any }) => {
      return axios.put(`/api/v1/leads/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead updated successfully.");
      setEditingRow(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update lead.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      return axios.delete(`/api/v1/leads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead deleted successfully.");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete lead.");
    },
  });

  // Unique sources for filter
  const sourceOptions = [...new Set(rows.map((r: any) => r.source).filter(Boolean))].map((s: string) => ({ value: s, label: s }));

  const leadsFilters: FilterDef[] = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "new", label: "New" },
        { value: "contacted", label: "Contacted" },
        { value: "qualified", label: "Qualified" },
        { value: "won", label: "Won" },
        { value: "lost", label: "Lost" },
      ],
    },
    {
      key: "source",
      label: "Source",
      options: sourceOptions,
    },
  ];

  const formFields: FieldDef[] = [
    { name: "name", label: t("common.name") || "Name", type: "text", required: true },
    { name: "email", label: t("common.email") || "Email", type: "email", required: true },
    { name: "phone", label: t("common.phone") || "Phone", type: "text" },
    { name: "source", label: "Source", type: "text", defaultValue: "website" },
    { name: "budget", label: t("common.fields.budget") || "Budget (USD)", type: "number" },
    {
      name: "status",
      label: t("common.fields.status") || "Status",
      type: "select",
      defaultValue: "new",
      options: [
        { value: "new", label: "New" },
        { value: "contacted", label: "Contacted" },
        { value: "qualified", label: "Qualified" },
        { value: "won", label: "Won" },
        { value: "lost", label: "Lost" },
      ],
    },
  ];

  return (
    <ResourcePage<Lead>
      title={t("nav.leads")}
      description="Prospects moving through the sales pipeline"
      rows={rows}
      getSearchable={(r) => `${r.name} ${r.email} ${r.source} ${r.status}`}
      newLabel="New lead"
      editingRow={editingRow}
      onCloseEdit={() => setEditingRow(null)}
      filters={leadsFilters}
      columns={[
        { key: "name", header: t("common.name"), cell: (r) => <span className="font-medium">{r.name}</span> },
        { key: "email", header: t("common.email"), cell: (r) => <span className="text-muted-foreground">{r.email}</span>, hideOnMobile: true },
        { key: "source", header: "Source", cell: (r) => r.source, hideOnMobile: true },
        { key: "budget", header: "Budget", cell: (r) => <span className="tabular-nums">{money(r.budget || 0)}</span> },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
        { key: "created", header: t("common.created"), cell: (r) => <span className="text-xs text-muted-foreground">{shortDate(r.createdAt || r.created_at)}</span> },
        { 
          key: "actions", 
          header: t("common.actions") || "Actions", 
          cell: (r) => (
            <div className="flex gap-2 justify-end">
              {canEdit && (
                <>
                  <button 
                    className="text-primary hover:underline text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingRow(r);
                    }}
                  >
                    {t("common.edit")}
                  </button>
                  <ConfirmDeleteButton
                    onConfirm={() => {
                      deleteMutation.mutate(r.id);
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
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
          onSubmit={(v) => {
            saveMutation.mutate({
              ...v,
              source: v.source || "website",
              budget: Number(v.budget || 0),
              status: v.status || "new",
            });
            close();
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
            source: row.source || "website",
            budget: row.budget || 0,
            status: row.status || "new",
          }}
          onCancel={close}
          onSubmit={(v) => {
            updateMutation.mutate({
              id: row.id,
              data: {
                ...row,
                ...v,
                budget: Number(v.budget || 0),
              }
            });
          }}
          fields={formFields}
        />
      )}
    />
  );
}
