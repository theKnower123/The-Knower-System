import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm, type FieldDef } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { type Leave } from "@/mocks/data";
import { shortDate } from "@/lib/format";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/store/auth";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";

export default function LeavesPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [editingRow, setEditingRow] = useState<Leave | null>(null);
  const canEdit = ["super_admin", "ceo", "hr"].includes(user?.role || "");

  const { data: rows = [] } = useQuery({
    queryKey: ["leaves"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/leaves");
      return res.data.data;
    },
  });

  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/employees");
      return res.data.data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      return axios.post("/api/v1/leaves", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      toast.success("Created!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to request leave.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string | number, data: any }) => {
      return axios.put(`/api/v1/leaves/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      toast.success("Leave updated successfully.");
      setEditingRow(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update leave.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      return axios.delete(`/api/v1/leaves/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      toast.success("Leave deleted successfully.");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete leave.");
    },
  });

  const formFields: FieldDef[] = [
    { name: "employeeId", label: "Employee", type: "select", options: employees.map((e: any) => ({ value: e.id, label: e.name || `Employee ${e.id}` })), required: true },
    {
      name: "leaveType",
      label: "Type",
      type: "select",
      defaultValue: "annual",
      required: true,
      options: [
        { value: "annual", label: "Annual" },
        { value: "sick", label: "Sick" },
        { value: "personal", label: "Personal" },
        { value: "maternity", label: "Maternity" },
        { value: "paternity", label: "Paternity" },
        { value: "unpaid", label: "Unpaid" },
      ],
    },
    { name: "startDate", label: "Start Date", type: "date", required: true },
    { name: "endDate", label: "End Date", type: "date", required: true },
    { name: "reason", label: "Reason", type: "text" },
    {
      name: "status",
      label: "Status",
      type: "select",
      defaultValue: "pending",
      options: [
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
        { value: "rejected", label: "Rejected" },
      ],
    },
  ];

  return (
    <ResourcePage<Leave>
      title={t("nav.leaves")}
      description="Time off requests"
      rows={rows}
      getSearchable={(r: any) => `${r.reason} ${r.status} ${r.leave_type || r.leaveType}`}
      newLabel="Request leave"
      editingRow={editingRow}
      onCloseEdit={() => setEditingRow(null)}
      columns={[
        {
  key: "employee",
  header: "Employee",
  cell: (r: any) =>
    employees.find((e: any) => e.id === (r.employee_id || r.employeeId))?.name ??
    (r.employee_id || r.employeeId ? `Employee ${r.employee_id || r.employeeId}` : "—"),
},
        { key: "type", header: "Type", cell: (r: any) => <StatusBadge value={r.leave_type || r.leaveType || r.type} /> },
        { key: "dates", header: "Dates", cell: (r: any) => (
          <div className="text-xs">
            <div>{shortDate(r.start_date || r.startDate)}</div>
            <div className="text-muted-foreground">→ {shortDate(r.end_date || r.endDate)}</div>
          </div>
        )},
        { key: "status", header: t("common.status"), cell: (r: any) => <StatusBadge value={r.status || "pending"} /> },
        { key: "reason", header: "Reason", cell: (r: any) => <span className="text-sm text-muted-foreground max-w-[200px] truncate block" title={r.reason}>{r.reason || "—"}</span>, hideOnMobile: true },
        {
          key: "actions",
          header: t("common.actions") || "Actions",
          cell: (r: any) => (
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
              employee_id: v.employeeId,
              leave_type: v.leaveType || "annual",
              start_date: v.startDate ? new Date(v.startDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
              end_date: v.endDate ? new Date(v.endDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
              reason: v.reason,
              status: v.status || "pending",
            });
            close();
          }}
          fields={formFields}
        />
      )}
      renderEditForm={(row: any, close) => (
        <QuickForm
          submitLabel="Save Changes"
          initialValues={{
            employeeId: row.employee_id ?? row.employeeId,
            leaveType: row.leave_type ?? row.leaveType ?? row.type ?? "annual",
            startDate: (row.start_date || row.startDate) ? new Date(row.start_date || row.startDate).toISOString().split("T")[0] : "",
            endDate: (row.end_date || row.endDate) ? new Date(row.end_date || row.endDate).toISOString().split("T")[0] : "",
            reason: row.reason || "",
            status: row.status || "pending",
          }}
          onCancel={close}
          onSubmit={(v) => {
            updateMutation.mutate({
              id: row.id,
              data: {
                employee_id: v.employeeId,
                leave_type: v.leaveType,
                start_date: v.startDate ? new Date(v.startDate).toISOString().split("T")[0] : (row.start_date || row.startDate),
                end_date: v.endDate ? new Date(v.endDate).toISOString().split("T")[0] : (row.end_date || row.endDate),
                reason: v.reason,
                status: v.status,
              }
            });
          }}
          fields={formFields}
        />
      )}
    />
  );
}
