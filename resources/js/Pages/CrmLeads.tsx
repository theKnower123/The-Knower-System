import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { type Lead } from "@/mocks/data";
import { money, shortDate } from "@/lib/format";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export default function LeadsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

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

  return (
    <ResourcePage<Lead>
      title={t("nav.leads")}
      description="Prospects moving through the sales pipeline"
      rows={rows}
      getSearchable={(r) => `${r.name} ${r.email} ${r.source} ${r.status}`}
      newLabel="New lead"
      columns={[
        { key: "name", header: t("common.name"), cell: (r) => <span className="font-medium">{r.name}</span> },
        { key: "email", header: t("common.email"), cell: (r) => <span className="text-muted-foreground">{r.email}</span> },
        { key: "source", header: "Source", cell: (r) => r.source },
        { key: "budget", header: "Budget", cell: (r) => <span className="tabular-nums">{money(r.budget || 0)}</span> },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
        { key: "created", header: t("common.created"), cell: (r) => <span className="text-xs text-muted-foreground">{shortDate(r.createdAt)}</span> },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={(v) => {
            saveMutation.mutate({
              name: v.name,
              email: v.email,
              phone: v.phone,
              source: v.source || "Website",
              budget: Number(v.budget || 0),
              status: v.status || "new",
            });
            close();
          }}
          fields={[
            { name: "name", label: "Name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "phone", label: "Phone", type: "text" },
            { name: "source", label: "Source", type: "text", defaultValue: "Website" },
            { name: "budget", label: "Budget (USD)", type: "number" },
            {
              name: "status",
              label: "Status",
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
          ]}
        />
      )}
    />
  );
}
