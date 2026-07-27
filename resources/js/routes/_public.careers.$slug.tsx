import { useEffect, useState } from "react";
import axios from "axios";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageHero, Section, Card } from "@/components/public/blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface JobPosting {
  id: number;
  title: string;
  type: string;
  location: string;
  description?: string;
  requirements?: string;
  department?: { id: number; name: string } | null;
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
    meta: [{ title: `${loaderData?.title ?? "Job"} — Careers at The Knower` }, { name: "description", content: loaderData?.description ?? "" }],
  }),
  component: () => {
    const j = Route.useLoaderData();
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const form = e.currentTarget;
      const data = new FormData(form);

      setSubmitting(true);
      try {
        await axios.post("/api/v1/job-applications", {
          job_posting_id: j.id,
          first_name: data.get("first_name"),
          last_name: data.get("last_name"),
          email: data.get("email"),
          phone: data.get("phone") || null,
          portfolio_url: data.get("portfolio_url") || null,
          cover_letter: data.get("cover_letter") || null,
        });
        // NOTE: resume file upload intentionally left out of this fix --
        // StoreJobApplicationRequest accepts an optional `resume` file, but
        // sending files needs a real FormData + multipart request, which is
        // a slightly bigger change. Add a <Input type="file" name="resume">
        // above and switch this call to send `new FormData(form)` directly
        // (axios sets the multipart header automatically for FormData).
        toast.success("Application received — we'll be in touch.");
        form.reset();
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? "Something went wrong. Please try again.";
        toast.error(msg);
      } finally {
        setSubmitting(false);
      }
    }

    return (
      <div>
        <PageHero eyebrow={j.department?.name ?? "Careers"} title={j.title} subtitle={`${j.location} · ${j.type}`} />
        <Section>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-6">
              <Card><h2 className="font-display text-xl font-semibold">About the role</h2><p className="mt-3 whitespace-pre-line text-muted-foreground">{j.description}</p></Card>
              {j.requirements && (
                <Card>
                  <h3 className="font-display text-base font-semibold">Requirements</h3>
                  <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">{j.requirements}</p>
                </Card>
              )}
            </div>
            <Card>
              <h3 className="font-display text-base font-semibold">Apply now</h3>
              {/* This form now posts a real job_applications row via
                  POST /api/v1/job-applications -- it shows up in your
                  HR > Applications dashboard (HrApplications.tsx). */}
              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <div><Label>First name</Label><Input name="first_name" required /></div>
                <div><Label>Last name</Label><Input name="last_name" required /></div>
                <div><Label>Email</Label><Input name="email" type="email" required /></div>
                <div><Label>Phone</Label><Input name="phone" /></div>
                <div><Label>LinkedIn / portfolio</Label><Input name="portfolio_url" /></div>
                <div><Label>Why us?</Label><Textarea name="cover_letter" rows={3} /></div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit application"}
                </Button>
              </form>
            </Card>
          </div>
        </Section>
      </div>
    );
  },
});
