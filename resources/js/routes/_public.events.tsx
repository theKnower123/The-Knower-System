import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Card, Badge } from "@/components/public/blocks";
import { events } from "@/mocks/marketing";
import { Calendar, MapPin } from "lucide-react";

export const Route = createFileRoute("/_public/events")({
  head: () => ({ meta: [{ title: "Events — The Knower" }, { name: "description", content: "Where you'll find us — conferences, webinars and summits." }] }),
  component: () => (
    <div>
      <PageHero eyebrow="Events" title="Come say hi" />
      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((e) => (
            <Card key={e.slug}>
              <Badge>{e.type}</Badge>
              <h3 className="mt-3 font-display text-lg font-semibold">{e.title}</h3>
              <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {e.date}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.location}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{e.summary}</p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  ),
});
