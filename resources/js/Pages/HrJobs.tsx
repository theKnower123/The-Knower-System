import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { QuickForm } from "@/components/quick-form";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { StatusBadge } from "@/components/status-badge";

export default function HrJobsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["job-postings"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/job-postings");
      return res.data.data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (data.id) {
        return axios.put(`/api/v1/job-postings/${data.id}`, data);
      }
      return axios.post("/api/v1/job-postings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-postings"] });
      toast.success("Job posting saved.");
      setFormOpen(false);
      setEditingJob(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to save job posting.");
    },
  });

  const columns = [
    { key: "title", header: "Job Title", cell: (r: any) => <div className="font-medium">{r.title}</div> },
    { key: "departmentName", header: "Department", cell: (r: any) => r.departmentName },
    { key: "type", header: "Type", cell: (r: any) => <span className="capitalize">{r.type.replace("-", " ")}</span> },
    { key: "location", header: "Location", cell: (r: any) => r.location },
    { key: "status", header: "Status", cell: (r: any) => <StatusBadge value={r.status} /> },
    { key: "closingDate", header: "Closing Date", cell: (r: any) => r.closingDate },
    { key: "actions", header: "Actions", cell: (r: any) => (
        <Button variant="ghost" size="sm" onClick={() => {
            setEditingJob(r);
            setFormOpen(true);
        }}>
            Edit
        </Button>
    )}
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("nav.jobPostings")}
        description="Manage open positions and career opportunities."
        action={
          <Button onClick={() => { setEditingJob(null); setFormOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> New Job
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card shadow-sm p-4">
        <DataTable
          columns={columns}
          rows={jobs}
          empty="No job postings found."
        />
      </div>

      <Dialog open={formOpen} onOpenChange={(o) => { setFormOpen(o); if (!o) setEditingJob(null); }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <QuickForm
            onCancel={() => { setFormOpen(false); setEditingJob(null); }}
            onSubmit={(data) => {
              saveMutation.mutate({ ...data, id: editingJob?.id });
            }}
            fields={[
              { name: "title", label: "Job Title", type: "text", required: true, defaultValue: editingJob?.title },
              { name: "type", label: "Employment Type", type: "select", required: true, defaultValue: editingJob?.type || "full-time", options: [
                { value: "full-time", label: "Full-Time" },
                { value: "part-time", label: "Part-Time" },
                { value: "contract", label: "Contract" },
                { value: "internship", label: "Internship" },
              ]},
              { name: "location", label: "Location", type: "text", defaultValue: editingJob?.location },
              { name: "description", label: "Job Description", type: "textarea", required: true, defaultValue: editingJob?.description },
              { name: "requirements", label: "Requirements", type: "textarea", defaultValue: editingJob?.requirements },
              { name: "closing_date", label: "Closing Date", type: "date", defaultValue: editingJob?.closingDate },
              { name: "status", label: "Status", type: "select", required: true, defaultValue: editingJob?.status || "draft", options: [
                { value: "draft", label: "Draft" },
                { value: "published", label: "Published" },
                { value: "closed", label: "Closed" },
              ]},
            ]}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
