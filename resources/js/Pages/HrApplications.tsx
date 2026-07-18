import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { FileBadge, Download, ExternalLink } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { StatusBadge } from "@/components/status-badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function HrApplicationsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["job-applications"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/job-applications");
      return res.data.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return axios.put(`/api/v1/job-applications/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-applications"] });
      toast.success("Application status updated.");
    },
    onError: () => toast.error("Failed to update status."),
  });

  const columns = [
    { key: "name", header: "Candidate", cell: (r: any) => <div className="font-medium">{r.name}</div> },
    { key: "jobTitle", header: "Position", cell: (r: any) => r.jobTitle },
    { key: "email", header: "Email", cell: (r: any) => r.email },
    { key: "createdAt", header: "Applied On", cell: (r: any) => new Date(r.createdAt).toLocaleDateString() },
    { key: "status", header: "Status", cell: (r: any) => <StatusBadge value={r.status} /> },
    { key: "actions", header: "Actions", cell: (r: any) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedApp(r)}>
            Review
        </Button>
    )}
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("nav.applications")}
        description="Review incoming candidates and manage the hiring pipeline."
      />

      <div className="rounded-xl border border-border bg-card shadow-sm p-4">
        <DataTable
          columns={columns}
          rows={apps}
          empty="No applications found."
        />
      </div>

      <Dialog open={!!selectedApp} onOpenChange={(o) => { if (!o) setSelectedApp(null); }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Candidate Application</DialogTitle>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="font-display text-xl font-semibold">{selectedApp.name}</h3>
                  <p className="text-sm text-muted-foreground">Applying for: {selectedApp.jobTitle}</p>
                </div>
                <StatusBadge value={selectedApp.status} />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground text-xs">Email</Label>
                  <div className="font-medium">{selectedApp.email}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Phone</Label>
                  <div className="font-medium">{selectedApp.phone || "N/A"}</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Links & Documents</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedApp.resumeUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedApp.resumeUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" /> Download Resume
                      </a>
                    </Button>
                  )}
                  {selectedApp.portfolioUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedApp.portfolioUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" /> View Portfolio
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {selectedApp.coverLetter && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Cover Letter</Label>
                  <div className="rounded-md bg-muted p-3 text-sm whitespace-pre-wrap">
                    {selectedApp.coverLetter}
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-4 border-t border-border">
                <Label>Update Status</Label>
                <Select
                  value={selectedApp.status}
                  onValueChange={(val) => {
                    setSelectedApp({ ...selectedApp, status: val });
                    updateStatusMutation.mutate({ id: selectedApp.id, status: val });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewing">Reviewing</SelectItem>
                    <SelectItem value="interviewing">Interviewing</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
