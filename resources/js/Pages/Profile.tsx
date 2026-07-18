import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/store/auth";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Camera, Save, Trash2, Smartphone, Monitor } from "lucide-react";

export default function ProfilePage() {
  const { t } = useTranslation();
  const user = useAuth((s) => s.user);
  
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || ""); // Email cannot be changed
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [idNumber, setIdNumber] = useState(user?.idNumber || "");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const saveProfile = () => {
    // Mock save logic
    toast.success("Profile updated successfully!");
  };

  const savePassword = () => {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }
    // Mock save logic
    toast.success("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
  };

  const deleteAccount = () => {
    if (confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      toast.success("Account deleted.");
    }
  };

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "US";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Profile Settings"
        description="Manage your personal information, security preferences, and active devices."
      />

      <div className="grid gap-6 md:grid-cols-[1fr_3fr] items-start">
        {/* Avatar Section (Persistent Sidebar style) */}
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center sticky top-6">
          <div className="relative group">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-primary/10 text-4xl font-semibold text-primary shadow-sm">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-sm transition-transform hover:scale-105"
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
            <h3 className="font-display text-lg font-semibold">{name || "User"}</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {user?.role?.replace("_", " ") || "Employee"}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="security">Security & Login</TabsTrigger>
            <TabsTrigger value="devices">Active Devices</TabsTrigger>
          </TabsList>

          {/* General Info Tab */}
          <TabsContent value="general" className="space-y-6 rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-display text-lg font-semibold">Personal Details</h3>
            
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
                  className="bg-muted text-muted-foreground cursor-not-allowed"
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

            <h3 className="mt-8 mb-4 font-display text-lg font-semibold">Company Details</h3>
            <div className="grid gap-4 sm:grid-cols-3">
               <div className="space-y-2">
                <Label>System Role</Label>
                <Input value={user?.role?.replace("_", " ") || "Employee"} disabled className="bg-muted capitalize" />
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
              <Button onClick={saveProfile}>
                <Save className="mr-2 h-4 w-4" /> Save General Details
              </Button>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-display text-lg font-semibold">Change Password</h3>
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
                <Button onClick={savePassword} variant="secondary">
                  <Save className="mr-2 h-4 w-4" /> Update Password
                </Button>
              </div>
            </div>

            {/* Connected Accounts */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-display text-lg font-semibold">Connected Accounts</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Link your social or developer accounts for single sign-on.
              </p>
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Google</h4>
                      <p className="text-xs text-muted-foreground">Sign in with Google</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast.success("Redirecting to Google OAuth...")}>Connect</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">GitHub</h4>
                      <p className="text-xs text-muted-foreground">Link commits and PRs</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast.success("Redirecting to GitHub OAuth...")}>Connect</Button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
              <h3 className="mb-2 font-display text-lg font-semibold text-destructive">Danger Zone</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button variant="destructive" onClick={deleteAccount}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Account
              </Button>
            </div>
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-6 rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-display text-lg font-semibold">Active Devices</h3>
            <p className="text-sm text-muted-foreground mb-6">
              You are currently logged in to these devices. If you don't recognize a device, log out immediately.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-background">
                <div className="flex items-center gap-4">
                  <Monitor className="h-6 w-6 text-primary" />
                  <div>
                    <h4 className="font-medium text-sm">MacBook Pro - Safari</h4>
                    <p className="text-xs text-muted-foreground">Cairo, Egypt • Active now</p>
                  </div>
                </div>
                <div className="text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded">Current</div>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-background">
                <div className="flex items-center gap-4">
                  <Smartphone className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium text-sm">iPhone 14 - Safari</h4>
                    <p className="text-xs text-muted-foreground">Cairo, Egypt • Last active: 2 hours ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.success("Device logged out.")}>Log Out</Button>
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
