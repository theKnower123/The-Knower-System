import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/store/auth";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Camera, Save, Trash2, Smartphone, Monitor, ShieldCheck, CheckCircle2, Laptop } from "lucide-react";
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
    const err = urlParams.get("error");
    if (err) {
      toast.error(err);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

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
    </div>
  );
}
