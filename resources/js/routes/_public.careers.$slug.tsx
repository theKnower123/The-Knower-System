import { useEffect, useState } from "react";
import axios from "axios";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageHero, Section, Card } from "@/components/public/blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  Clock, 
  Search, 
  AlertCircle, 
  UserCheck, 
  XCircle, 
  RefreshCw,
  FileCheck
} from "lucide-react";

interface JobPosting {
  id: number;
  title: string;
  type: string;
  location: string;
  description?: string;
  requirements?: string;
  department?: { id: number; name: string } | null;
}

interface SubmittedApplication {
  id: string;
  jobPostingId: string;
  jobTitle?: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
  status: string; // pending, reviewing, interviewing, hired, rejected
  notes?: string;
  createdAt: string;
}

export const Route = createFileRoute("/_public/careers/$slug")({
  // slug here is actually the numeric job_postings.id -- real DB record, not mock data
  loader: async ({ params }) => {
    const res = await axios.get("/api/v1/job-postings/active");
    const list: JobPosting[] = res.data?.data ?? [];
    const job = list.find((x) => String(x.id) === params.slug);
    if (!job) throw notFound();
    return job;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Job"} — Careers at The Knower` }, 
      { name: "description", content: loaderData?.description ?? "" }
    ],
  }),
  component: () => {
    const j = Route.useLoaderData();
    const [submitting, setSubmitting] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(false);
    const [mode, setMode] = useState<"form" | "lookup">("form");
    const [lookupInput, setLookupInput] = useState("");
    
    // Application status state
    const [application, setApplication] = useState<SubmittedApplication | null>(null);
    const [alertNotice, setAlertNotice] = useState<string | null>(null);

    const storageKey = `knower_job_app_${j.id}`;

    // Check localStorage on mount
    useEffect(() => {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.id) {
            setApplication(parsed);
            // Fetch live status from backend
            fetchLiveStatus(parsed.id, parsed.email);
          }
        } catch (e) {
          localStorage.removeItem(storageKey);
        }
      }
    }, [j.id]);

    async function fetchLiveStatus(appId?: string, email?: string) {
      setCheckingStatus(true);
      try {
        const queryParams = new URLSearchParams();
        if (appId) queryParams.append("id", appId);
        queryParams.append("job_posting_id", String(j.id));
        if (email) queryParams.append("email", email);

        const res = await axios.get(`/api/v1/job-applications/status?${queryParams.toString()}`);
        if (res.data?.success && res.data?.data) {
          const freshData: SubmittedApplication = res.data.data;
          setApplication(freshData);
          localStorage.setItem(storageKey, JSON.stringify(freshData));
          setAlertNotice(null);
        }
      } catch (err: any) {
        // Keep cached if network fails
      } finally {
        setCheckingStatus(false);
      }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const form = e.currentTarget;
      const data = new FormData(form);

      setSubmitting(true);
      try {
        data.append("job_posting_id", String(j.id));
        const res = await axios.post("/api/v1/job-applications", data, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        if (res.data?.success && res.data?.data) {
          const appData: SubmittedApplication = res.data.data;
          setApplication(appData);
          localStorage.setItem(storageKey, JSON.stringify(appData));
          toast.success("Application submitted successfully!");
          setAlertNotice("Your application has been submitted successfully and is currently pending review.");
          form.reset();
        }
      } catch (err: any) {
        const resData = err?.response?.data;
        if (resData?.already_submitted && resData?.data) {
          const existingApp: SubmittedApplication = resData.data;
          setApplication(existingApp);
          localStorage.setItem(storageKey, JSON.stringify(existingApp));
          const msg = resData?.message || "No, you have already submitted this application before; you can't submit it again.";
          toast.error(msg);
          setAlertNotice(msg);
        } else {
          const msg = resData?.message ?? "Something went wrong. Please check your inputs and try again.";
          toast.error(msg);
        }
      } finally {
        setSubmitting(false);
      }
    }

    async function handleLookupSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!lookupInput.trim()) return;

      setCheckingStatus(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("job_posting_id", String(j.id));
        if (lookupInput.includes("@")) {
          queryParams.append("email", lookupInput.trim());
        } else {
          queryParams.append("phone", lookupInput.trim());
        }

        const res = await axios.get(`/api/v1/job-applications/status?${queryParams.toString()}`);
        if (res.data?.success && res.data?.data) {
          const appData: SubmittedApplication = res.data.data;
          setApplication(appData);
          localStorage.setItem(storageKey, JSON.stringify(appData));
          toast.success("Application status retrieved!");
          setAlertNotice(null);
          setMode("form");
        } else {
          toast.error("No application found with the provided details.");
        }
      } catch (err: any) {
        const msg = err?.response?.data?.message || "No application found with the provided email/phone.";
        toast.error(msg);
      } finally {
        setCheckingStatus(false);
      }
    }

    function clearStoredApplication() {
      localStorage.removeItem(storageKey);
      setApplication(null);
      setAlertNotice(null);
      setMode("form");
    }

    const renderStatusBadge = (status: string) => {
      switch (status) {
        case "reviewing":
          return (
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 text-blue-700 dark:text-blue-300">
              <div className="flex items-center gap-2 font-semibold text-base">
                <Search className="h-5 w-5 text-blue-500" />
                Under Active Review
              </div>
              <p className="mt-1 text-sm text-blue-600/90 dark:text-blue-300/90">
                Our HR team is currently reviewing your profile, qualifications, and attached documents.
              </p>
            </div>
          );
        case "interviewing":
          return (
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-4 text-purple-700 dark:text-purple-300">
              <div className="flex items-center gap-2 font-semibold text-base">
                <UserCheck className="h-5 w-5 text-purple-500" />
                Selected for Interview
              </div>
              <p className="mt-1 text-sm text-purple-600/90 dark:text-purple-300/90">
                Congratulations! You have been selected for the interview stage. Our HR team will reach out to you shortly.
              </p>
            </div>
          );
        case "hired":
        case "accepted":
          return (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-300">
              <div className="flex items-center gap-2 font-semibold text-base">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Application Accepted
              </div>
              <p className="mt-1 text-sm text-emerald-600/90 dark:text-emerald-300/90">
                Congratulations! Your application has been approved and accepted for this position.
              </p>
            </div>
          );
        case "rejected":
          return (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-700 dark:text-red-300">
              <div className="flex items-center gap-2 font-semibold text-base">
                <XCircle className="h-5 w-5 text-red-500" />
                Application Process Closed
              </div>
              <p className="mt-1 text-sm text-red-600/90 dark:text-red-300/90">
                Thank you for your interest in joining our team. Unfortunately, we are not proceeding with your application at this time.
              </p>
            </div>
          );
        default: // pending
          return (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-700 dark:text-amber-300">
              <div className="flex items-center gap-2 font-semibold text-base">
                <Clock className="h-5 w-5 text-amber-500" />
                Pending Review
              </div>
              <p className="mt-1 text-sm text-amber-600/90 dark:text-amber-300/90">
                Your application has been received successfully and is currently waiting for initial HR review.
              </p>
            </div>
          );
      }
    };

    return (
      <div>
        <PageHero eyebrow={j.department?.name ?? "Careers"} title={j.title} subtitle={`${j.location} · ${j.type}`} />
        <Section>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-6">
              <Card>
                <h2 className="font-display text-xl font-semibold">About the role</h2>
                <p className="mt-3 whitespace-pre-line text-muted-foreground">{j.description}</p>
              </Card>
              {j.requirements && (
                <Card>
                  <h3 className="font-display text-base font-semibold">Requirements</h3>
                  <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">{j.requirements}</p>
                </Card>
              )}
            </div>

            <div>
              {application ? (
                /* Application Status Card */
                <Card className="space-y-5 border border-primary/20 shadow-lg">
                  {alertNotice && (
                    <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-50/50 p-3.5 text-xs text-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
                      <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                      <div>{alertNotice}</div>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                        <FileCheck className="h-5 w-5 text-primary" />
                        Application Status
                      </h3>
                      <p className="text-xs text-muted-foreground">Reference ID: #{application.id}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => fetchLiveStatus(application.id, application.email)}
                      disabled={checkingStatus}
                      className="h-8 gap-1.5 text-xs"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${checkingStatus ? "animate-spin" : ""}`} />
                      {checkingStatus ? "Checking..." : "Refresh"}
                    </Button>
                  </div>

                  {renderStatusBadge(application.status)}

                  <div className="rounded-lg border bg-muted/30 p-4 space-y-2.5 text-sm">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Applicant Details
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{application.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{application.email}</span>
                    </div>
                    {application.phone && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-medium">{application.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Submitted on:</span>
                      <span className="font-medium">
                        {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : "Recently"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearStoredApplication}
                      className="w-full text-xs text-muted-foreground hover:text-foreground"
                    >
                      Check with a different email or re-apply
                    </Button>
                  </div>
                </Card>
              ) : mode === "lookup" ? (
                /* Lookup Form Card */
                <Card>
                  <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <h3 className="font-display text-base font-semibold">Check Application Status</h3>
                    <Button variant="ghost" size="sm" onClick={() => setMode("form")} className="text-xs">
                      Back to apply form
                    </Button>
                  </div>

                  <form onSubmit={handleLookupSubmit} className="space-y-4">
                    <p className="text-xs text-muted-foreground">
                      Enter the email address or phone number you used when submitting your application to check its real-time status.
                    </p>
                    <div>
                      <Label>Email or Phone Number</Label>
                      <Input 
                        value={lookupInput} 
                        onChange={(e) => setLookupInput(e.target.value)} 
                        placeholder="john.doe@example.com or +123456789" 
                        required 
                      />
                    </div>
                    <Button type="submit" className="w-full gap-2" disabled={checkingStatus}>
                      {checkingStatus ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                      {checkingStatus ? "Searching..." : "Check Status"}
                    </Button>
                  </form>
                </Card>
              ) : (
                /* Submission Form Card */
                <Card>
                  <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <h3 className="font-display text-base font-semibold">Apply now</h3>
                    <button 
                      type="button" 
                      onClick={() => setMode("lookup")} 
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Already applied? Check status
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3" encType="multipart/form-data">
                    <div><Label>First name</Label><Input name="first_name" required /></div>
                    <div><Label>Last name</Label><Input name="last_name" required /></div>
                    <div><Label>Email</Label><Input name="email" type="email" required /></div>
                    <div><Label>Phone</Label><Input name="phone" /></div>
                    <div><Label>Resume / CV (PDF, DOC)</Label><Input name="resume" type="file" accept=".pdf,.doc,.docx" /></div>
                    <div><Label>LinkedIn / portfolio</Label><Input name="portfolio_url" /></div>
                    <div><Label>Why us?</Label><Textarea name="cover_letter" rows={3} /></div>
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? "Submitting…" : "Submit application"}
                    </Button>
                  </form>
                </Card>
              )}
            </div>
          </div>
        </Section>
      </div>
    );
  },
});
