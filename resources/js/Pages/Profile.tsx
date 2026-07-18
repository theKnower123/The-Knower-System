import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/auth";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Camera, Save } from "lucide-react";

export default function ProfilePage() {
  const { t } = useTranslation();
  const user = useAuth((s) => s.user);
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
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

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Profile Settings"
        description="Manage your personal information and security preferences."
      />

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center">
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
            <p className="text-sm text-muted-foreground">{user?.role?.replace("_", " ")}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Allowed formats: JPG, PNG, GIF. Max size: 2MB.
          </p>
        </div>

        <div className="space-y-6">
          {/* General Info */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-display text-lg font-semibold">General Information</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                />
              </div>
              <Button onClick={saveProfile} className="mt-2 w-fit">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </div>
          </div>

          {/* Security */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-display text-lg font-semibold">Security</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <Button onClick={savePassword} variant="secondary" className="mt-2 w-fit">
                <Save className="mr-2 h-4 w-4" /> Update Password
              </Button>
            </div>
          </div>

          {/* Connected Accounts */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-display text-lg font-semibold">Connected Accounts</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Link your social or developer accounts for single sign-on and workflow integrations.
            </p>
            <div className="space-y-4">
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
                    <p className="text-xs text-muted-foreground">Link commits and PRs to your tasks</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.success("Redirecting to GitHub OAuth...")}>Connect</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
