import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUp, ArrowDown, Pencil, Plus, Lock } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { MarketingNav, Rating } from "@/components/marketing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useMarketing, togglePortfolioVisible, updatePortfolioEntry, toggleSection, moveSection,
  addTestimonial, toggleTestimonial, type PortfolioEntry, type ShowcaseTag,
} from "@/mocks/marketing-ops";
import { useAuth } from "@/store/auth";
import { shortDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/marketing/landing")({
  head: () => ({
    meta: [
      { title: "Landing Page Control — The Knower OS" },
      { name: "description", content: "Control which projects, sections and testimonials appear on the public site." },
    ],
  }),
  component: LandingPage,
});

const TAGS: ShowcaseTag[] = ["Web", "Mobile", "Desktop", "System"];

function LandingPage() {
  const actor = useAuth((s) => s.user)?.name ?? "Marketing Admin";
  const entries = useMarketing("portfolioEntries");
  const sections = useMarketing("landingSections");
  const testimonials = useMarketing("testimonials");
  const [editing, setEditing] = useState<PortfolioEntry | null>(null);
  const [newT, setNewT] = useState(false);

  return (
    <div>
      <PageHeader
        title="Landing Page Content"
        description="Decide what the public site shows — no developer or redeploy needed"
      />
      <MarketingNav />

      <Tabs defaultValue="portfolio">
        <TabsList>
          <TabsTrigger value="portfolio">Portfolio Visibility</TabsTrigger>
          <TabsTrigger value="sections">Sections Manager</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="mt-4 space-y-3">
          {entries.map((e) => (
            <div key={e.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-sm font-semibold">{e.title}</h3>
                  {e.tags.map((t) => (
                    <span key={t} className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase text-muted-foreground">{t}</span>
                  ))}
                </div>
                <p className="mt-1 max-w-xl text-xs text-muted-foreground">{e.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Cover: {e.coverImage} · Shown as: <b className="text-foreground">{e.showClientName ? e.clientLabel : "Confidential Client"}</b>
                </p>
                {!e.clientApproved && (
                  <p className="mt-2 inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-xs text-amber-500">
                    <Lock className="h-3 w-3" /> Client has not approved public display
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={e.isVisible}
                    disabled={!e.clientApproved}
                    onCheckedChange={() => {
                      togglePortfolioVisible(e.id, actor);
                      toast.success(e.isVisible ? "Hidden from landing page" : "Now visible on landing page");
                    }}
                  />
                  <span className="text-xs text-muted-foreground">Show on landing page</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => setEditing(e)}>
                  <Pencil className="me-1 h-3.5 w-3.5" /> Edit showcase entry
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="sections" className="mt-4 space-y-2">
          {[...sections].sort((a, b) => a.sortOrder - b.sortOrder).map((s, i, arr) => (
            <div key={s.id} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <span className="w-6 text-xs text-muted-foreground">{i + 1}</span>
                <div>
                  <div className="text-sm font-medium">{s.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {s.sectionKey} · updated by {s.updatedBy} {shortDate(s.updatedAt)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" disabled={i === 0} onClick={() => moveSection(s.id, -1, actor)}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" disabled={i === arr.length - 1} onClick={() => moveSection(s.id, 1, actor)}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Switch checked={s.isVisible} onCheckedChange={() => toggleSection(s.id, actor)} />
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="testimonials" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <Button onClick={() => setNewT(true)}><Plus className="me-1 h-4 w-4" /> Add Testimonial</Button>
          </div>
          {testimonials.map((t) => (
            <div key={t.id} className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
              <div className="max-w-2xl">
                <p className="text-sm italic">“{t.quote}”</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{t.anonymous ? "Anonymous client" : t.clientName}</span>
                  <Rating value={t.rating} />
                  <span>{shortDate(t.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Approved</span>
                <Switch checked={t.isApproved} onCheckedChange={() => toggleTestimonial(t.id, actor)} />
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit showcase entry</DialogTitle>
            <DialogDescription>Controls how this project appears in Featured Work.</DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Cover image</Label>
                <Input value={editing.coverImage} onChange={(e) => setEditing({ ...editing, coverImage: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Short description</Label>
                <Textarea
                  rows={3}
                  maxLength={280}
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tags</Label>
                <div className="flex gap-3">
                  {TAGS.map((tag) => (
                    <label key={tag} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={editing.tags.includes(tag)}
                        onCheckedChange={() =>
                          setEditing({
                            ...editing,
                            tags: editing.tags.includes(tag)
                              ? editing.tags.filter((t) => t !== tag)
                              : [...editing.tags, tag],
                          })
                        }
                      />
                      {tag}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Client display</Label>
                <Select
                  value={editing.showClientName ? "name" : "confidential"}
                  onValueChange={(v) => setEditing({ ...editing, showClientName: v === "name" })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Show client name</SelectItem>
                    <SelectItem value="confidential">Confidential Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button
              onClick={() => {
                if (!editing) return;
                updatePortfolioEntry(editing.id, editing, actor);
                toast.success("Showcase entry updated");
                setEditing(null);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddTestimonial open={newT} onOpenChange={setNewT} />
    </div>
  );
}

function AddTestimonial({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [name, setName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState("5");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add testimonial</DialogTitle>
          <DialogDescription>Testimonials go live only once approved.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Client name</Label>
            <Input value={name} disabled={anonymous} onChange={(e) => setName(e.target.value)} maxLength={80} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={anonymous} onCheckedChange={(v) => setAnonymous(!!v)} /> Publish anonymously
          </label>
          <div className="space-y-1.5">
            <Label>Quote</Label>
            <Textarea rows={3} maxLength={400} value={quote} onChange={(e) => setQuote(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Rating</Label>
            <Select value={rating} onValueChange={setRating}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[5, 4, 3, 2, 1].map((r) => <SelectItem key={r} value={String(r)}>{r} stars</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            disabled={!quote.trim() || (!anonymous && !name.trim())}
            onClick={() => {
              addTestimonial({
                clientName: anonymous ? "Anonymous" : name.trim(),
                anonymous, quote: quote.trim(), rating: Number(rating),
                isApproved: false, createdAt: new Date().toISOString(),
              });
              toast.success("Testimonial added — pending approval");
              setName(""); setQuote(""); onOpenChange(false);
            }}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
