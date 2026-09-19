import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/store/auth";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
  Camera,
  Save,
  Trash2,
  Smartphone,
  Monitor,
  ShieldCheck,
  CheckCircle2,
  Laptop,
  Send,
  ExternalLink,
  Loader2,
  Copy,
  Check,
  RefreshCw,
  Bot,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { KnowerLogo } from "@/components/knower-logo";
import axios from "axios";
import { router, usePage } from "@inertiajs/react";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { props } = usePage();
  const user = useAuth((s) => s.user);
  const setUser = useAuth((s) => s.setUser);
  const logout = useAuth((s) => s.logout);

  const isGoogleConnected = Boolean(user?.google_id || (props.auth as any)?.user?.google_id);

  // Telegram Integration State
  const authUser = (props.auth as any)?.user;
  const isTelegramConnected = Boolean(user?.telegram_chat_id || authUser?.telegram_chat_id || user?.has_telegram || authUser?.has_telegram);
  const telegramUsername = user?.telegram_username || authUser?.telegram_username;
  const telegramChatId = user?.telegram_chat_id || authUser?.telegram_chat_id;
  const botUsername = user?.telegram_bot_username || authUser?.telegram_bot_username || "knower_assistant_bot";

  const [connectTelegramModalOpen, setConnectTelegramModalOpen] = useState(false);
  const [disconnectTelegramModalOpen, setDisconnectTelegramModalOpen] = useState(false);
  const [loadingToken, setLoadingToken] = useState(false);
  const [telegramLinkUrl, setTelegramLinkUrl] = useState<string | null>(null);
  const [activeBotUsername, setActiveBotUsername] = useState(botUsername);
  const [manualChatId, setManualChatId] = useState("");
  const [manualUsername, setManualUsername] = useState("");
  const [linkingManual, setLinkingManual] = useState(false);
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [disconnectingTelegram, setDisconnectingTelegram] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showManualLink, setShowManualLink] = useState(false);


  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [idNumber, setIdNumber] = useState(user?.idNumber || user?.id_number || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [saving, setSaving] = useState(false);

  const [devices, setDevices] = useState<any[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setIdNumber(user.idNumber || user.id_number || "");
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  const fetchDevices = async () => {
    try {
      setLoadingDevices(true);
      const res = await axios.get("/api/v1/profile/devices");
      if (res.data?.devices) {
        setDevices(res.data.devices);
      }
    } catch (e) {
      console.error("Failed to load active devices", e);
    } finally {
      setLoadingDevices(false);
    }
  };

  useEffect(() => {
    fetchDevices();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("google_connected") === "1") {
      toast.success("Google account successfully connected!");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (urlParams.get("telegram_connected") === "1") {
      toast.success("Telegram account successfully connected!");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    const err = urlParams.get("error");
    if (err) {
      toast.error(err);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleOpenConnectTelegram = async () => {
    setConnectTelegramModalOpen(true);
    setLoadingToken(true);
    setShowManualLink(false);
    try {
      const res = await axios.post("/profile/telegram/token");
      if (res.data?.success) {
        setTelegramLinkUrl(res.data.bot_url);
        if (res.data.bot_username) {
          setActiveBotUsername(res.data.bot_username);
        }
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to generate Telegram connection link.");
    } finally {
      setLoadingToken(false);
    }
  };

  const handleCopyLink = () => {
    if (!telegramLinkUrl) return;
    navigator.clipboard.writeText(telegramLinkUrl);
    setCopiedLink(true);
    toast.success("Telegram link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleManualLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualChatId.trim()) {
      toast.error("Please enter your Telegram Chat ID.");
      return;
    }
    setLinkingManual(true);
    try {
      const res = await axios.post("/profile/telegram/link-by-chat-id", {
        chat_id: manualChatId.trim(),
        telegram_username: manualUsername.trim().replace(/^@/, "") || null,
      });
      if (res.data?.success) {
        toast.success(res.data.message || "Telegram account linked successfully!");
        setConnectTelegramModalOpen(false);
        setManualChatId("");
        setManualUsername("");
        if (user) {
          setUser({
            ...user,
            telegram_chat_id: manualChatId.trim(),
            telegram_username: manualUsername.trim().replace(/^@/, "") || null,
            has_telegram: true,
          });
        }
        router.reload();
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to link Telegram account.");
    } finally {
      setLinkingManual(false);
    }
  };

  const handleDisconnectTelegram = async () => {
    setDisconnectingTelegram(true);
    try {
      const res = await axios.post("/profile/telegram/disconnect");
      if (res.data?.success) {
        toast.success(res.data.message || "Telegram account disconnected.");
        setDisconnectTelegramModalOpen(false);
        if (user) {
          setUser({
            ...user,
            telegram_chat_id: undefined,
            telegram_username: undefined,
            has_telegram: false,
          });
        }
        router.reload();
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to disconnect Telegram account.");
    } finally {
      setDisconnectingTelegram(false);
    }
  };

  const handleTestTelegram = async () => {
    setTestingTelegram(true);
    try {
      const res = await axios.post("/profile/telegram/test");
      if (res.data?.success) {
        toast.success(res.data.message || "Test alert sent to your Telegram!");
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to send test notification.");
    } finally {
      setTestingTelegram(false);
    }
  };


  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      const res = await axios.post("/api/v1/profile", {
        name,
        phone,
        address,
        id_number: idNumber,
        avatar: avatarPreview,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Profile settings updated successfully!");
        const updated = res.data.data;
        setUser({
          ...user!,
          name: updated.name,
          phone: updated.phone,
          address: updated.address,
          idNumber: updated.id_number,
          avatar: updated.avatar,
        });
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to update profile settings.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in both current and new password fields.");
      return;
    }
    try {
      const res = await axios.post("/api/v1/profile/password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      if (res.data.success) {
        toast.success(res.data.message || "Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to update password.";
      toast.error(msg);
    }
  };

  const revokeDevice = async (deviceId: number) => {
    try {
      const res = await axios.delete(`/api/v1/profile/devices/${deviceId}`);
      if (res.data.success) {
        toast.success(res.data.message);
        if (res.data.is_logged_out) {
          await logout();
          window.location.href = "/login?message=" + encodeURIComponent("You have logged out of your current device.");
        } else {
          fetchDevices();
        }
      }
    } catch (e) {
      toast.error("Failed to remove device.");
    }
  };

  const deleteAccount = () => {
    toast.success("Account deleted.");
  };

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "US";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner with System Logo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-white/10">
        <div className="space-y-1">
          <KnowerLogo showText={true} size="lg" className="text-white" />
          <p className="text-xs text-slate-300 mt-1">
            Manage your personal profile, security preferences, and active devices.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-xs text-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Account Protection Active</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_3fr] items-start">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 text-center sticky top-6 shadow-sm">
          <div className="relative group">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-primary/10 text-4xl font-semibold text-primary shadow-md">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 rounded-full bg-primary p-2.5 text-primary-foreground shadow-lg transition-transform hover:scale-110"
              title="Change Profile Photo"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold">{name || "User"}</h3>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mt-0.5">
              {user?.role?.replace("_", " ") || "Employee"}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4 bg-muted/60 p-1 rounded-xl">
            <TabsTrigger value="general" className="rounded-lg text-xs font-semibold">General Information</TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg text-xs font-semibold">Security & Login</TabsTrigger>
            <TabsTrigger value="devices" className="rounded-lg text-xs font-semibold">Active Devices</TabsTrigger>
          </TabsList>

          {/* General Info Tab */}
          <TabsContent value="general" className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 font-display text-lg font-bold flex items-center gap-2">
              Personal Details
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address <span className="text-muted-foreground text-xs font-normal">(Cannot be changed)</span></Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-muted text-muted-foreground cursor-not-allowed font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idNumber">National ID / Passport Number</Label>
                <Input
                  id="idNumber"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="ID Number"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Street Name, City, Country"
                />
              </div>
            </div>

            <h3 className="mt-8 mb-4 font-display text-lg font-bold">Company Details</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>System Role</Label>
                <Input value={user?.role?.replace("_", " ") || "Employee"} disabled className="bg-muted capitalize font-medium" />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input value={user?.department || "Unassigned"} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input value={user?.position || "Unassigned"} disabled className="bg-muted" />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button onClick={saveProfile} disabled={saving} className="font-semibold shadow-md">
                <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save General Details"}
              </Button>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 font-display text-lg font-bold">Change Password</h3>
              <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="mt-6">
                <Button onClick={savePassword} variant="secondary" className="font-semibold">
                  <Save className="mr-2 h-4 w-4" /> Update Password
                </Button>
              </div>
            </div>

            {/* Connected Accounts */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 font-display text-lg font-bold">Connected Accounts</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Link your social or developer accounts for single sign-on and fast authentication.
              </p>
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 shadow-sm">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Google Account</h4>
                      <p className="text-xs text-muted-foreground">Single Sign-On & Account Sync</p>
                    </div>
                  </div>
                  {isGoogleConnected ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-semibold"
                      onClick={() => {
                        toast.success("Redirecting to Google OAuth...");
                        window.location.href = "/auth/google/redirect";
                      }}
                    >
                      Connect Google
                    </Button>
                  )}
                </div>

                {/* Telegram Account */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400 shadow-sm">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">Telegram Bot</h4>
                        {isTelegramConnected && (
                          <span className="text-[11px] font-mono font-medium text-sky-700 dark:text-sky-300 bg-sky-100/70 dark:bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                            {telegramUsername ? `@${telegramUsername}` : `Chat #${telegramChatId}`}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Real-time alerts, OTP codes & fast bot commands</p>
                    </div>
                  </div>

                  {isTelegramConnected ? (
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={testingTelegram}
                        onClick={handleTestTelegram}
                        className="text-xs font-semibold h-8 text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/40"
                        title="Send a test notification to your connected Telegram"
                      >
                        {testingTelegram ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 mr-1" />}
                        Test
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDisconnectTelegramModalOpen(true)}
                        className="text-xs font-semibold h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-semibold border-sky-200 text-sky-700 hover:bg-sky-50 dark:border-sky-800 dark:text-sky-300 dark:hover:bg-sky-950/30 self-end sm:self-center"
                      onClick={handleOpenConnectTelegram}
                    >
                      <Send className="mr-1.5 h-3.5 w-3.5 text-sky-500" /> Connect Telegram
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 shadow-sm">
              <h3 className="mb-2 font-display text-lg font-bold text-destructive">Danger Zone</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <ConfirmDeleteButton onConfirm={deleteAccount} asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                </Button>
              </ConfirmDeleteButton>
            </div>
          </TabsContent>

          {/* Active Devices Tab */}
          <TabsContent value="devices" className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-bold">Active & Saved Devices</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Devices logged into this account. If you remove a device, it will be logged out immediately and will require explicit approval to log back in.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={fetchDevices}>Refresh Devices</Button>
            </div>

            <div className="space-y-4">
              {loadingDevices ? (
                <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">
                  Fetching logged-in devices...
                </div>
              ) : devices.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No registered active devices found.
                </div>
              ) : (
                devices.map((dev) => {
                  const isCurrent = dev.is_current;
                  const isRevoked = dev.status === "revoked";
                  return (
                    <div
                      key={dev.id}
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-xl transition ${
                        isCurrent
                          ? "border-primary/40 bg-primary/5"
                          : isRevoked
                          ? "border-destructive/30 bg-destructive/5 opacity-70"
                          : "border-border bg-background"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${isCurrent ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {dev.platform === 'Mobile' ? <Smartphone className="h-6 w-6" /> : <Laptop className="h-6 w-6" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-foreground">{dev.device_name}</h4>
                            {isCurrent && (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Current Device
                              </span>
                            )}
                            {isRevoked && (
                              <span className="text-[10px] font-bold text-destructive bg-destructive/10 border border-destructive/20 px-2 py-0.5 rounded-full">
                                Removed (Requires Approval)
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            IP: <span className="font-mono">{dev.ip_address}</span> • {dev.browser} • Last Active: {dev.last_active_at ? new Date(dev.last_active_at).toLocaleString() : 'Active now'}
                          </p>
                        </div>
                      </div>

                      {!isRevoked && (
                        <Button
                          variant={isCurrent ? "destructive" : "outline"}
                          size="sm"
                          className="font-semibold text-xs self-end sm:self-center"
                          onClick={() => revokeDevice(dev.id)}
                        >
                          {isCurrent ? "Revoke & Log Out" : "Remove Device"}
                        </Button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Connect Telegram Dialog */}
      <Dialog open={connectTelegramModalOpen} onOpenChange={setConnectTelegramModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
              <Send className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-lg font-bold">Connect Telegram Bot</DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground">
              Link your Telegram account to receive instant notifications, task updates, and security alerts.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {loadingToken ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
                <p className="text-xs text-muted-foreground">Generating secure connection link...</p>
              </div>
            ) : (
              <>
                {/* 1-Click Telegram Deep Link Card */}
                <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-4 dark:border-sky-900/30 dark:bg-sky-950/20 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Bot className="h-4 w-4 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">Option 1: One-Click Instant Link</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Click below to open <strong>@{activeBotUsername}</strong> in Telegram and press <strong>START</strong>.
                      </p>
                    </div>
                  </div>

                  {telegramLinkUrl && (
                    <div className="space-y-2 pt-1">
                      <Button
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold gap-2 shadow-sm"
                        onClick={() => {
                          window.open(telegramLinkUrl, "_blank");
                        }}
                      >
                        <Send className="h-4 w-4" /> Open in Telegram & Press Start
                        <ExternalLink className="h-3.5 w-3.5 ml-auto opacity-70" />
                      </Button>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs flex-1 h-8 gap-1"
                          onClick={handleCopyLink}
                        >
                          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedLink ? "Copied!" : "Copy Link"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs flex-1 h-8 gap-1 text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            router.reload();
                            toast.info("Checking connection status...");
                          }}
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Check Status
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Option 2: Connect manually by Chat ID */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowManualLink(!showManualLink)}
                    className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 w-full text-center transition"
                  >
                    {showManualLink ? "Hide manual Chat ID option" : "Or connect manually using your Chat ID"}
                  </button>

                  {showManualLink && (
                    <form onSubmit={handleManualLink} className="mt-3 space-y-3 rounded-xl border border-border p-4 bg-muted/30">
                      <div>
                        <Label htmlFor="manualChatId" className="text-xs font-semibold">Telegram Chat ID *</Label>
                        <Input
                          id="manualChatId"
                          placeholder="e.g. 123456789"
                          value={manualChatId}
                          onChange={(e) => setManualChatId(e.target.value)}
                          className="mt-1 text-xs font-mono h-9"
                          required
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Tip: Message <strong>@{activeBotUsername}</strong> in Telegram to view your Chat ID.
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="manualUsername" className="text-xs font-semibold">Telegram Username (Optional)</Label>
                        <Input
                          id="manualUsername"
                          placeholder="e.g. john_doe"
                          value={manualUsername}
                          onChange={(e) => setManualUsername(e.target.value)}
                          className="mt-1 text-xs font-mono h-9"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={linkingManual}
                        className="w-full text-xs font-semibold h-9"
                      >
                        {linkingManual ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
                        Link Telegram ID
                      </Button>
                    </form>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Disconnect Telegram Confirmation Alert */}
      <AlertDialog open={disconnectTelegramModalOpen} onOpenChange={setDisconnectTelegramModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Telegram Account?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect your Telegram account ({telegramUsername ? `@${telegramUsername}` : `Chat #${telegramChatId}`})? You will no longer receive alerts or notifications via Telegram.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={disconnectingTelegram}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisconnectTelegram}
              disabled={disconnectingTelegram}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold"
            >
              {disconnectingTelegram ? "Disconnecting..." : "Yes, Disconnect"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

