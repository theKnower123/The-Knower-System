import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Unplug, Plug, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { MarketingNav, PlatformIcon, MemberChip } from "@/components/marketing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useMarketing, addAccount, setAccountStatus, setAccountTeam,
  ALL_PLATFORMS, PLATFORM_LABELS, type Platform, type SocialAccount,
} from "@/mocks/marketing-ops";
import { useAuth } from "@/store/auth";
import { shortDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/marketing/accounts")({
  head: () => ({
    meta: [
      { title: "Social Accounts — The Knower OS" },
      { name: "description", content: "Connected social platforms, assigned teams and connection status." },
    ],
  }),
  component: AccountsPage,
});

function AccountsPage() {
  const accounts = useMarketing("socialAccounts");
  const team = useMarketing("team");
  const actor = useAuth((s) => s.user)?.name ?? "Marketing Admin";
  const [assigning, setAssigning] = useState<SocialAccount | null>(null);

  return (
    <div>
      <PageHeader
        title="Social Accounts"
        description="Every connected platform, who owns it, and its token status"
        actions={<ConnectDialog actor={actor} />}
      />
      <MarketingNav />

      <DataTable
        rows={accounts}
        getSearchable={(a) => `${a.handle} ${PLATFORM_LABELS[a.platform]} ${a.connectedBy}`}
        columns={[
          {
            key: "platform",
            header: "Platform",
            cell: (a) => (
              <div className="flex items-center gap-2">
                <PlatformIcon platform={a.platform} />
                <div>
                  <div className="font-medium">{PLATFORM_LABELS[a.platform]}</div>
                  <div className="text-xs text-muted-foreground">{a.handle}</div>
                </div>
              </div>
            ),
          },
          { key: "followers", header: "Audience", cell: (a) => (a.followers ? a.followers.toLocaleString() : "—") },
          { key: "connectedBy", header: "Connected by", cell: (a) => (
            <div>
              <div>{a.connectedBy}</div>
              <div className="text-xs text-muted-foreground">{shortDate(a.connectedAt)}</div>
            </div>
          ) },
          {
            key: "team",
            header: "Assigned team",
            cell: (a) => (
              <div className="flex items-center gap-1">
                {a.assignedTeam.length === 0 && <span className="text-xs text-muted-foreground">Unassigned</span>}
                {a.assignedTeam.map((id) => {
                  const m = team.find((t) => t.id === id);
                  return m ? <MemberChip key={id} name={m.name} color={m.avatarColor} /> : null;
                })}
                <Button variant="ghost" size="sm" className="h-6 px-1" onClick={() => setAssigning(a)}>
                  <Users className="h-3.5 w-3.5" />
                </Button>
              </div>
            ),
          },
          {
            key: "status",
            header: "Status",
            cell: (a) => (
              <span
                className={
                  "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase " +
                  (a.status === "active"
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                    : "border-slate-500/20 bg-slate-500/10 text-slate-400")
                }
              >
                {a.status}
              </span>
            ),
          },
          {
            key: "actions",
            header: "",
            cell: (a) =>
              a.status === "active" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAccountStatus(a.id, "disconnected", actor);
                    toast.success(`${a.handle} disconnected — historical posts kept`);
                  }}
                >
                  <Unplug className="me-1 h-3.5 w-3.5" /> Disconnect
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAccountStatus(a.id, "active", actor);
                    toast.success(`OAuth flow simulated — ${a.handle} reconnected`);
                  }}
                >
                  <Plug className="me-1 h-3.5 w-3.5" /> Reconnect
                </Button>
              ),
          },
        ]}
      />

      <Dialog open={!!assigning} onOpenChange={(o) => !o && setAssigning(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigned team — {assigning?.handle}</DialogTitle>
            <DialogDescription>
              Social Media Managers who can post and reply on this account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {team.map((m) => {
              const checked = assigning?.assignedTeam.includes(m.id) ?? false;
              return (
                <label key={m.id} className="flex items-center gap-3 text-sm">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => {
                      if (!assigning) return;
                      const next = checked
                        ? assigning.assignedTeam.filter((x) => x !== m.id)
                        : [...assigning.assignedTeam, m.id];
                      setAccountTeam(assigning.id, next);
                      setAssigning({ ...assigning, assignedTeam: next });
                    }}
                  />
                  <MemberChip name={m.name} color={m.avatarColor} />
                  <span>{m.name}</span>
                  <span className="text-xs text-muted-foreground">{m.role}</span>
                </label>
              );
            })}
          </div>
          <DialogFooter>
            <Button onClick={() => setAssigning(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ConnectDialog({ actor }: { actor: string }) {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState<Platform>("facebook");
  const [handle, setHandle] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="me-1 h-4 w-4" /> Connect Account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect a social account</DialogTitle>
          <DialogDescription>
            The OAuth handshake is simulated here; a real token would be encrypted at rest.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Platform</Label>
            <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ALL_PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>{PLATFORM_LABELS[p]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Handle</Label>
            <Input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@yourbrand" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            disabled={!handle.trim()}
            onClick={() => {
              addAccount({
                platform, handle: handle.trim(), connectedBy: actor, status: "active",
                followers: 0, connectedAt: new Date().toISOString(), assignedTeam: [],
              });
              toast.success(`${PLATFORM_LABELS[platform]} authorised — token stored encrypted`);
              setHandle("");
              setOpen(false);
            }}
          >
            Start OAuth flow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
