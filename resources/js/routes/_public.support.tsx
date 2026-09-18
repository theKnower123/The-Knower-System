import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section, CTABand, FeatureCard } from "@/components/public/blocks";
import { LifeBuoy, BookOpen, MessageCircle, HelpCircle, Download, Activity } from "lucide-react";

export const Route = createFileRoute("/_public/support")({
  head: () => ({ meta: [{ title: "Support — The Knower" }, { name: "description", content: "Open a ticket, browse the knowledge base, or chat with us live." }] }),
  component: () => (
    <div>
      <PageHero eyebrow="Support" title="We're here when you need us" subtitle="24/7 support for Professional and Enterprise plans." />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={<LifeBuoy className="h-5 w-5" />} title="Open a ticket" description="Log a support request — response within 1 business hour." href="/contact" />
          <FeatureCard icon={<BookOpen className="h-5 w-5" />} title="Knowledge base" description="Answers to common questions and how-tos." href="/docs" />
          <FeatureCard icon={<MessageCircle className="h-5 w-5" />} title="Live chat" description="Chat with our team, Mon–Fri, 9am–6pm GMT." />
          <FeatureCard icon={<HelpCircle className="h-5 w-5" />} title="FAQ" description="Answers to what everyone asks." href="/faq" />
          <FeatureCard icon={<Download className="h-5 w-5" />} title="Downloads" description="Brochures, catalogs and brand assets." href="/downloads" />
          <FeatureCard icon={<Activity className="h-5 w-5" />} title="System status" description="Real-time uptime for every service." href="/status" />
        </div>
      </Section>
      <CTABand title="Enterprise support?" primary={{ label: "Contact sales", to: "/contact" }} />
    </div>
  ),
});
