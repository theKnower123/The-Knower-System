import { useState } from "react";
import axios from "axios";
import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Card } from "@/components/public/blocks";
import { branches } from "@/mocks/marketing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";

export const Route = createFileRoute("/_public/contact")({
  head: () => ({ meta: [{ title: "Contact — The Knower" }, { name: "description", content: "Talk to sales, book a demo, or find your local office." }] }),
  component: ContactPage,
});

function ContactPage() {
  const [sending, setSending] = useState(false);
  const [bookingDemo, setBookingDemo] = useState(false);
  const [demoDone, setDemoDone] = useState(false);

  async function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setSending(true);
    try {
      await axios.post("/api/v1/public/contact", {
        name: data.get("name"),
        company: data.get("company") || null,
        email: data.get("email"),
        phone: data.get("phone") || null,
        message: data.get("message"),
      });
      toast.success("Thanks! We'll reply within a business hour.");
      form.reset();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  async function handleBookDemo() {
    const name = window.prompt("Your full name?");
    if (!name) return;
    const email = window.prompt("Your email?");
    if (!email) return;

    setBookingDemo(true);
    try {
      await axios.post("/api/v1/public/demo-request", { name, email });
      toast.success("Demo request received — our team will email you to pick a time.");
      setDemoDone(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Something went wrong. Please try again.");
    } finally {
      setBookingDemo(false);
    }
  }

  return (
    <div>
      <PageHero eyebrow="Contact" title="Let's talk" subtitle="We usually reply within a business hour." />
      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <h2 className="font-display text-xl font-semibold">Send us a message</h2>
            <form onSubmit={handleContactSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
              <div><Label>Full name</Label><Input name="name" required /></div>
              <div><Label>Company</Label><Input name="company" /></div>
              <div><Label>Email</Label><Input name="email" type="email" required /></div>
              <div><Label>Phone</Label><Input name="phone" /></div>
              <div className="sm:col-span-2"><Label>How can we help?</Label><Textarea name="message" rows={5} required /></div>
              <div className="sm:col-span-2">
                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={sending}>
                  {sending ? "Sending…" : "Send message"}
                </Button>
              </div>
            </form>
          </Card>
          <div className="space-y-4">
            {[
              { icon: <Mail className="h-4 w-4" />, label: "Email", value: "hello@theknower.io" },
              { icon: <Phone className="h-4 w-4" />, label: "Phone", value: "+966 11 000 0000" },
              { icon: <MessageCircle className="h-4 w-4" />, label: "WhatsApp", value: "+966 55 000 0000" },
            ].map((c) => (
              <Card key={c.label} className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">{c.icon}</div>
                <div><div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div><div className="font-display font-semibold">{c.value}</div></div>
              </Card>
            ))}
            <Card>
              <h3 className="font-display text-base font-semibold">Book a demo</h3>
              <p className="mt-1 text-sm text-muted-foreground">30 minutes with a product expert.</p>
              {/*
                NOTE: there's no real calendar/scheduling system in this
                project (no Calendly-style booking). This now creates a
                real Lead tagged "Demo request" in CRM > Leads, and a human
                on your sales team follows up to actually pick a time.
                If you want true self-serve time-slot picking, that needs
                a calendar integration (Calendly, Cal.com, or a custom
                availability system) -- a separate, bigger feature.
              */}
              <Button className="mt-3 w-full" onClick={handleBookDemo} disabled={bookingDemo || demoDone}>
                {demoDone ? "Request received ✓" : bookingDemo ? "Sending…" : "Request a time"}
              </Button>
            </Card>
          </div>
        </div>
      </Section>
      <Section className="bg-muted/30">
        <h2 className="font-display text-2xl font-semibold">Global offices</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {branches.map((b) => (
            <Card key={b.city}>
              <div className="flex items-center gap-2 text-sm text-primary"><MapPin className="h-4 w-4" /> {b.country}</div>
              <div className="mt-2 font-display text-lg font-semibold">{b.city}</div>
              <p className="mt-1 text-sm text-muted-foreground">{b.address}</p>
              <div className="mt-2 text-xs text-muted-foreground">{b.phone}<br />{b.email}</div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
