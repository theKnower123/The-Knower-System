import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Card } from "@/components/public/blocks";

const CONTENT: Record<string, { title: string; body: string[] }> = {
  privacy: { title: "Privacy Policy", body: ["We take your privacy seriously. This policy describes what data we collect and how we use it.", "We collect only the data necessary to provide our services and never sell your personal information.", "You can request deletion of your data at any time by contacting privacy@theknower.io.", "For full GDPR and CCPA compliance details, please contact our data protection officer."] },
  terms: { title: "Terms & Conditions", body: ["By using The Knower services, you agree to these terms.", "You are responsible for the security of your account and the content you upload.", "We provide our services on an as-is basis with SLA guarantees defined in your specific agreement.", "Either party may terminate service with 30 days notice."] },
  cookies: { title: "Cookie Policy", body: ["We use essential cookies to make our site work, and analytics cookies to understand how it's used.", "You can opt out of non-essential cookies via your browser settings or our consent banner.", "We do not use cookies for third-party advertising."] },
};

export const Route = createFileRoute("/_public/legal/$doc")({
  head: ({ params }) => {
    const d = CONTENT[params.doc];
    return { meta: [{ title: `${d?.title ?? "Legal"} — The Knower` }, { name: "description", content: d?.body?.[0] ?? "Legal document." }] };
  },
  component: () => {
    const { doc } = Route.useParams();
    const c = CONTENT[doc] ?? { title: "Not found", body: ["This document does not exist."] };
    return (
      <div>
        <PageHero eyebrow="Legal" title={c.title} subtitle="Last updated: July 2026" />
        <Section>
          <div className="mx-auto max-w-3xl">
            <Card className="space-y-4 leading-relaxed">
              {c.body.map((p, i) => <p key={i} className="text-muted-foreground">{p}</p>)}
            </Card>
          </div>
        </Section>
      </div>
    );
  },
});
