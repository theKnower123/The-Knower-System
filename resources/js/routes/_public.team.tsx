import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, CTABand, Card } from "@/components/public/blocks";
import { team as staticTeam } from "@/mocks/marketing";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Route = createFileRoute("/_public/team")({
  head: () => ({ meta: [{ title: "Team — The Knower" }, { name: "description", content: "Meet the people behind The Knower." }] }),
  component: TeamPage,
});

function TeamPage() {
  const { data: dynamicTeam } = useQuery({
    queryKey: ['public', 'team'],
    queryFn: async () => {
      const res = await axios.get('/api/v1/public/team');
      return res.data.team.map((t: any) => ({
        name: t.name, role: t.role, department: "General", bio: t.bio, avatar: t.avatar || "JD"
      }));
    }
  });
  const team = dynamicTeam || staticTeam;
  const departments = Array.from(new Set(team.map((t: any) => t.department)));

  return (
    <div>
      <PageHero eyebrow="Team" title="The people behind The Knower" subtitle="Senior, curious, kind. 300+ strong across 20 countries." />
      <Section>
        <div className="space-y-12">
          {departments.map((d: any) => (
            <div key={d}>
              <h2 className="font-display text-xl font-semibold">{d}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {team.filter((t: any) => t.department === d).map((t: any) => (
                  <Card key={t.name}>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 font-display text-lg font-bold text-primary">{t.avatar}</div>
                    <div className="mt-3 font-display text-base font-semibold">{t.name}</div>
                    <div className="text-xs text-primary">{t.role}</div>
                    <p className="mt-2 text-sm text-muted-foreground">{t.bio}</p>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
      <CTABand title="We're hiring" primary={{ label: "Open roles", to: "/careers" }} />
    </div>
  );
}
