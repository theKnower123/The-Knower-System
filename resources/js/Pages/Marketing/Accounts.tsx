import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import {
  Share2,
  Plus,
  UserPlus,
  Unlink,
  CheckCircle2,
  XCircle,
  Shield,
  Search,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog, type ConfirmDialogState } from "@/components/confirm-dialog";

interface SocialAccount {
  id: number;
  platform: string;
  handle: string;
  status: "active" | "disconnected";
  connected_by: { id: number; name: string };
  assigned_users: Array<{ id: number; name: string; pivot: { role_on_account: string } }>;
  created_at: string;
}

interface Props {
  accounts: {
    data: SocialAccount[];
    links: any[];
  };
}

export default function SocialAccountsPage({ accounts }: Props) {
  const { auth } = usePage<any>().props;
  const [search, setSearch] = useState("");
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(null);

  // Form states
  const [platform, setPlatform] = useState("facebook");
  const [handle, setHandle] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [assignUserId, setAssignUserId] = useState("");
  const [assignRole, setAssignRole] = useState("manager");

  const filteredAccounts = (accounts?.data || []).filter(
    (acc) =>
      acc.handle.toLowerCase().includes(search.toLowerCase()) ||
      acc.platform.toLowerCase().includes(search.toLowerCase())
  );

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    router.post(
      "/marketing/accounts",
      {
        platform,
        handle,
        access_token_encrypted: accessToken,
      },
      {
        onSuccess: () => {
          setConnectModalOpen(false);
          setHandle("");
          setAccessToken("");
        },
      }
    );
  };

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) return;
    router.post(
      `/marketing/accounts/${selectedAccount.id}/assign`,
      {
        user_id: assignUserId,
        role_on_account: assignRole,
      },
      {
        onSuccess: () => {
          setAssignModalOpen(false);
          setSelectedAccount(null);
        },
      }
    );
  };

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const handleDisconnect = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: "Disconnect Social Account",
      description: "Are you sure you want to disconnect this social account? Historical post records will be preserved.",
      confirmText: "Disconnect Account",
      variant: "destructive",
      icon: "warning",
      onConfirm: () => {
        router.post(`/marketing/accounts/${id}/disconnect`);
      },
    });
  };

  const getPlatformIcon = (plt: string) => {
    switch (plt.toLowerCase()) {
      case "facebook":
        return <Facebook className="w-5 h-5 text-blue-600" />;
      case "instagram":
        return <Instagram className="w-5 h-5 text-pink-500" />;
      case "linkedin":
        return <Linkedin className="w-5 h-5 text-blue-700" />;
      case "x":
      case "twitter":
        return <Twitter className="w-5 h-5 text-sky-400" />;
      case "youtube":
        return <Youtube className="w-5 h-5 text-red-600" />;
      case "whatsapp":
        return <MessageSquare className="w-5 h-5 text-emerald-500" />;
      default:
        return <Share2 className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border/40 rounded-xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Social Media Accounts</h1>
              <p className="text-sm text-muted-foreground">
                Manage connected platforms, encrypted OAuth tokens, and team access assignments.
              </p>
            </div>
          </div>
        </div>
        <Button onClick={() => setConnectModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Connect Account
        </Button>
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts or handle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Active: {filteredAccounts.filter((a) => a.status === "active").length}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
            Disconnected: {filteredAccounts.filter((a) => a.status === "disconnected").length}
          </span>
        </div>
      </div>

      {/* Grid of Social Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccounts.map((account) => (
          <div
            key={account.id}
            className="bg-card border border-border/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-secondary">
                    {getPlatformIcon(account.platform)}
                  </div>
                  <div>
                    <h3 className="font-semibold capitalize text-base">{account.platform}</h3>
                    <p className="text-xs text-muted-foreground">@{account.handle}</p>
                  </div>
                </div>
                <Badge
                  variant={account.status === "active" ? "default" : "secondary"}
                  className={account.status === "active" ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-200" : ""}
                >
                  {account.status === "active" ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Disconnected
                    </span>
                  )}
                </Badge>
              </div>

              <div className="border-t border-border/40 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Connected By:</span>
                  <span className="font-medium text-foreground">{account.connected_by?.name || "System"}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Assigned Team:</span>
                    <span className="font-medium text-foreground">
                      {account.assigned_users?.length || 0} members
                    </span>
                  </div>
                  {account.assigned_users && account.assigned_users.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {account.assigned_users.map((u) => (
                        <Badge key={u.id} variant="outline" className="text-[10px] py-0 px-1.5 bg-muted">
                          {u.name} ({u.pivot?.role_on_account || "member"})
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/40 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1 text-xs"
                onClick={() => {
                  setSelectedAccount(account);
                  setAssignModalOpen(true);
                }}
              >
                <UserPlus className="w-3.5 h-3.5" /> Assign Team
              </Button>
              {account.status === "active" && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={() => handleDisconnect(account.id)}
                >
                  <Unlink className="w-3.5 h-3.5" /> Disconnect
                </Button>
              )}
            </div>
          </div>
        ))}

        {filteredAccounts.length === 0 && (
          <div className="col-span-full bg-card border border-dashed border-border rounded-xl p-12 text-center space-y-3">
            <Share2 className="w-10 h-10 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-medium">No Social Accounts Connected</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Connect your official Facebook, Instagram, TikTok, LinkedIn or WhatsApp accounts to schedule posts and run ads.
            </p>
            <Button onClick={() => setConnectModalOpen(true)} className="gap-2 mt-2">
              <Plus className="w-4 h-4" /> Connect Your First Account
            </Button>
          </div>
        )}
      </div>

      {/* Connect Account Modal */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" /> Connect Social Account
              </h2>
              <button
                onClick={() => setConnectModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConnect} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="facebook">Facebook Business</option>
                  <option value="instagram">Instagram Professional</option>
                  <option value="tiktok">TikTok for Business</option>
                  <option value="linkedin">LinkedIn Company Page</option>
                  <option value="x">X (Twitter)</option>
                  <option value="youtube">YouTube Channel</option>
                  <option value="whatsapp">WhatsApp Business API</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Account Handle / Name</label>
                <Input
                  required
                  placeholder="e.g. @theknowersystem or company_page"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                  <span>OAuth Token / API Secret</span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-normal">
                    <Shield className="w-3 h-3" /> Encrypted Storage
                  </span>
                </label>
                <Input
                  type="password"
                  placeholder="Paste OAuth Access Token or App Secret"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setConnectModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Authenticate & Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Team Modal */}
      {assignModalOpen && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" /> Assign Team to @{selectedAccount.handle}
              </h2>
              <button
                onClick={() => setAssignModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssign} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">User ID</label>
                <Input
                  required
                  type="number"
                  placeholder="Enter User ID (e.g., 2)"
                  value={assignUserId}
                  onChange={(e) => setAssignUserId(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Role on Account</label>
                <select
                  value={assignRole}
                  onChange={(e) => setAssignRole(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="manager">Social Media Manager (Full Access)</option>
                  <option value="writer">Content Writer (Drafts & Scheduling)</option>
                  <option value="ads_specialist">Ads Specialist (Campaigns Only)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setAssignModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Assignment</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        dialog={confirmDialog}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
