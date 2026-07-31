import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Check, RotateCcw, Send, CalendarDays, List } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { MarketingNav, PlatformIcon, PostStatusBadge } from "@/components/marketing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  useMarketing, addPost, setPostStatus, PLATFORM_LABELS, type Post,
} from "@/mocks/marketing-ops";
import { useAuth } from "@/store/auth";
import { useCan } from "@/components/can";
import { shortDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/marketing/content")({
  head: () => ({
    meta: [
      { title: "Content Calendar — The Knower OS" },
      { name: "description", content: "Plan, approve and schedule social posts across every connected account." },
    ],
  }),
  component: ContentPage,
});

function ContentPage() {
  const posts = useMarketing("posts");
  const actor = useAuth((s) => s.user)?.name ?? "Marketing Admin";
  const canApprove = useCan("content.approve");

  const pending = posts.filter((p) => p.status === "pending_approval");

  return (
    <div>
      <PageHeader
        title="Content & Calendar"
        description="Drafts, approvals, scheduling and published history"
        actions={<NewPostDialog actor={actor} />}
      />
      <MarketingNav />

      {pending.length > 0 && (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="text-sm font-medium text-amber-500">
            {pending.length} post{pending.length > 1 ? "s" : ""} waiting for approval
          </p>
        </div>
      )}

      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar"><CalendarDays className="me-1 h-4 w-4" /> Calendar</TabsTrigger>
          <TabsTrigger value="list"><List className="me-1 h-4 w-4" /> List</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-4">
          <CalendarView posts={posts} actor={actor} canApprove={canApprove} />
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <div className="space-y-3">
            {[...posts]
              .sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt))
              .map((p) => (
                <PostCard key={p.id} post={p} actor={actor} canApprove={canApprove} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CalendarView({ posts, actor, canApprove }: { posts: Post[]; actor: string; canApprove: boolean }) {
  const days = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - 3 + i);
        return d;
      }),
    [],
  );

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
      {days.map((d) => {
        const key = d.toISOString().slice(0, 10);
        const dayPosts = posts.filter((p) => p.scheduledAt.slice(0, 10) === key);
        const isToday = key === new Date().toISOString().slice(0, 10);
        return (
          <div
            key={key}
            className={cn(
              "min-h-32 rounded-lg border border-border bg-card p-2",
              isToday && "border-primary/50 ring-1 ring-primary/20",
            )}
          >
            <div className="mb-2 text-[11px] font-medium uppercase text-muted-foreground">
              {d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })}
            </div>
            <div className="space-y-1.5">
              {dayPosts.map((p) => (
                <div key={p.id} className="rounded-md border border-border/70 bg-muted/40 p-2">
                  <p className="line-clamp-2 text-[11px] leading-snug">{p.content}</p>
                  <div className="mt-1.5 flex items-center gap-1">
                    <PostStatusBadge status={p.status} />
                  </div>
                  {canApprove && p.status === "pending_approval" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-1.5 h-6 w-full text-[10px]"
                      onClick={() => {
                        setPostStatus(p.id, "scheduled", actor);
                        toast.success("Post approved and scheduled");
                      }}
                    >
                      Approve
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PostCard({ post, actor, canApprove }: { post: Post; actor: string; canApprove: boolean }) {
  const accounts = useMarketing("socialAccounts");
  const [changesOpen, setChangesOpen] = useState(false);
  const [note, setNote] = useState("");

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm">{post.content}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {post.accountIds.map((id) => {
              const acc = accounts.find((a) => a.id === id);
              return acc ? <PlatformIcon key={id} platform={acc.platform} /> : null;
            })}
            <span>{shortDate(post.scheduledAt)}</span>
            <span>· by {post.createdBy}</span>
            {post.approvedBy && <span>· approved by {post.approvedBy}</span>}
            {post.mediaLabel && <span>· 📎 {post.mediaLabel}</span>}
            {post.reach != null && <span>· reach {post.reach.toLocaleString()}</span>}
          </div>
          {post.note && (
            <p className="mt-2 rounded-md bg-red-500/10 px-2 py-1 text-xs text-red-400">
              Requested changes: {post.note}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <PostStatusBadge status={post.status} />
          <div className="flex gap-2">
            {(post.status === "draft" || post.status === "changes_requested") && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setPostStatus(post.id, "pending_approval", actor);
                  toast.success("Submitted — Marketing Admin notified");
                }}
              >
                <Send className="me-1 h-3.5 w-3.5" /> Submit for approval
              </Button>
            )}
            {canApprove && post.status === "pending_approval" && (
              <>
                <Button
                  size="sm"
                  onClick={() => {
                    setPostStatus(post.id, "scheduled", actor);
                    toast.success("Approved — moved to Scheduled");
                  }}
                >
                  <Check className="me-1 h-3.5 w-3.5" /> Approve
                </Button>
                <Button size="sm" variant="outline" onClick={() => setChangesOpen(true)}>
                  <RotateCcw className="me-1 h-3.5 w-3.5" /> Request changes
                </Button>
              </>
            )}
            {post.status === "scheduled" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setPostStatus(post.id, "published", actor);
                  toast.success("Published to selected accounts");
                }}
              >
                Publish now
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={changesOpen} onOpenChange={setChangesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request changes</DialogTitle>
            <DialogDescription>The author is notified with your notes.</DialogDescription>
          </DialogHeader>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="What needs to change?" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangesOpen(false)}>Cancel</Button>
            <Button
              disabled={!note.trim()}
              onClick={() => {
                setPostStatus(post.id, "changes_requested", actor, note.trim());
                setChangesOpen(false);
                setNote("");
                toast.success("Changes requested");
              }}
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NewPostDialog({ actor }: { actor: string }) {
  const accounts = useMarketing("socialAccounts").filter((a) => a.status === "active");
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [media, setMedia] = useState("");
  const [when, setWhen] = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 16));
  const [ids, setIds] = useState<string[]>([]);

  const create = (status: "draft" | "pending_approval" | "scheduled") => {
    addPost({
      content: content.trim(),
      mediaLabel: media.trim() || undefined,
      status,
      scheduledAt: new Date(when).toISOString(),
      createdBy: actor,
      accountIds: ids,
    });
    toast.success(status === "pending_approval" ? "Submitted for approval" : "Post saved");
    setContent(""); setMedia(""); setIds([]); setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="me-1 h-4 w-4" /> New Post</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New post</DialogTitle>
          <DialogDescription>Pick accounts, write the caption and schedule it.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Accounts</Label>
            <div className="grid grid-cols-2 gap-2">
              {accounts.map((a) => (
                <label key={a.id} className="flex items-center gap-2 rounded-md border border-border p-2 text-sm">
                  <Checkbox
                    checked={ids.includes(a.id)}
                    onCheckedChange={() =>
                      setIds((prev) => (prev.includes(a.id) ? prev.filter((x) => x !== a.id) : [...prev, a.id]))
                    }
                  />
                  <PlatformIcon platform={a.platform} />
                  <span className="truncate text-xs">{PLATFORM_LABELS[a.platform]}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Caption</Label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} maxLength={2000} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Media</Label>
              <Input value={media} onChange={(e) => setMedia(e.target.value)} placeholder="cover.png" />
            </div>
            <div className="space-y-1.5">
              <Label>Schedule</Label>
              <Input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" disabled={!content.trim() || !ids.length} onClick={() => create("draft")}>
            Save draft
          </Button>
          <Button disabled={!content.trim() || !ids.length} onClick={() => create("pending_approval")}>
            Submit for approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
