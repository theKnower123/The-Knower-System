import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { PageHero, Section, CTABand, Badge } from "@/components/public/blocks";
import { blog } from "@/mocks/marketing";

export const Route = createFileRoute("/_public/blog/$slug")({
  loader: ({ params }) => { const b = blog.find((x) => x.slug === params.slug); if (!b) throw notFound(); return b; },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Post"} — The Knower Blog` },
      { name: "description", content: loaderData?.excerpt ?? "" },
      { property: "og:type", content: "article" },
    ],
    scripts: loaderData ? [{
      type: "application/ld+json",
      children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: loaderData.title, author: loaderData.author, datePublished: loaderData.date }),
    }] : [],
  }),
  component: () => {
    const p = Route.useLoaderData();
    return (
      <div>
        <PageHero eyebrow={p.category} title={p.title} subtitle={`${p.author} · ${p.date} · ${p.readTime}`} />
        <Section>
          <article className="mx-auto max-w-3xl space-y-5 rounded-2xl border border-border bg-card p-10 leading-relaxed text-foreground/90">
            {p.body.map((para: string, i: number) => <p key={i}>{para}</p>)}
          </article>
          <div className="mx-auto mt-8 flex max-w-3xl items-center justify-between text-sm">
            <Badge>{p.category}</Badge>
            <Link to="/blog" className="text-primary hover:underline">← All articles</Link>
          </div>
        </Section>
        <CTABand title="Enjoyed this?" primary={{ label: "Read more", to: "/blog" }} />
      </div>
    );
  },
});
