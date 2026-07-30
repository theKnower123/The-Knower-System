import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section, CTABand, Badge } from "@/components/public/blocks";
import { ProjectCardBanner } from "@/components/public/ProjectCardBanner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Route = createFileRoute("/_public/portfolio/")({
  head: () => ({
    meta: [
      { title: "Portfolio — The Knower" },
      { name: "description", content: "Selected work: healthcare, retail, fintech, government, logistics and more." },
    ],
    links: [{ rel: "canonical", href: "https://knower-all-in-one.lovable.app/portfolio" }],
  }),
  component: PortfolioIndex,
});

function PortfolioIndex() {
  const [q, setQ] = useState("");
  const { data: portfolio = [], isLoading } = useQuery({
    queryKey: ['public', 'portfolio'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/v1/public/portfolio');
        const projects = res.data?.projects || [];
        return projects.map((p: any) => ({
          slug: String(p.id),
          title: p.name || "Untitled Project",
          summary: p.description || p.details || "No description provided.",
          category: p.type || "Project",
          images: p.images || [],
          year: p.start_date ? new Date(p.start_date).getFullYear() : (p.created_at ? new Date(p.created_at).getFullYear() : new Date().getFullYear()),
        }));
      } catch (e) {
        return [];
      }
    }
  });

  const filtered = useMemo(() => {
    return portfolio.filter((p: any) => 
      q === "" || 
      p.title.toLowerCase().includes(q.toLowerCase()) || 
      p.summary.toLowerCase().includes(q.toLowerCase())
    );
  }, [portfolio, q]);

  return (
    <div>
      <PageHero eyebrow="Portfolio" title="Work we're proud of" subtitle="Projects delivered across industries." />
      <Section>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Input placeholder="Search projects…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p: any) => (
            <div key={p.slug} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:border-primary/50 hover:shadow-md flex flex-col justify-between">
              <ProjectCardBanner title={p.title} images={p.images} />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline">{p.category}</Badge>
                  <span className="text-xs font-semibold text-muted-foreground">{p.year}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-4 leading-relaxed">{p.summary}</p>
              </div>
            </div>
          ))}
        </div>
        {!isLoading && filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No portfolio projects to show right now. Enable project visibility from the admin dashboard to display them here!
          </div>
        )}
      </Section>
      <CTABand title="Your project could be next" primary={{ label: "Start a project", to: "/contact" }} />
    </div>
  );
}
