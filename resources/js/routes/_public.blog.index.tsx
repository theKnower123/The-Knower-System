import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section, CTABand, Badge } from "@/components/public/blocks";
import { blog as staticBlog } from "@/mocks/marketing";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Route = createFileRoute("/_public/blog/")({
  head: () => ({ meta: [{ title: "Blog — The Knower" }, { name: "description", content: "Articles on engineering, AI, design and running a software business." }] }),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const [q, setQ] = useState("");
  const { data: dynamicBlog } = useQuery({
    queryKey: ['public', 'blog'],
    queryFn: async () => {
      const res = await axios.get('/api/v1/public/blog');
      return res.data.posts.map((p: any) => ({
        slug: p.slug, title: p.title, excerpt: p.excerpt, category: "Blog", author: p.author_name, readTime: "5 min", date: p.published_at
      }));
    }
  });
  const blog = dynamicBlog || staticBlog;
  const filtered = blog.filter((b: any) => b.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <PageHero eyebrow="Journal" title="From our blog" subtitle="Field notes from building software for a living." />
      <Section>
        <Input placeholder="Search articles…" value={q} onChange={(e) => setQ(e.target.value)} className="mx-auto mb-8 max-w-md" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p: any) => (
            <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/50">
              <Badge>{p.category}</Badge>
              <h3 className="mt-3 font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{p.author}</span><span>{p.readTime}</span>
              </div>
            </Link>
          ))}
        </div>
      </Section>
      <CTABand title="Want more?" primary={{ label: "Subscribe", to: "/contact" }} />
    </div>
  );
}
