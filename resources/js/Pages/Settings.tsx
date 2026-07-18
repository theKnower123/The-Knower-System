import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ROLE_LABELS, ROLE_PERMISSIONS, ALL_ROLES, PERMISSIONS, Permission } from "@/lib/permissions";
import { StatusBadge } from "@/components/status-badge";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit, Plus } from "lucide-react";

export default function SettingsPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <PageHeader title={t("nav.settings")} description="Company, security, integrations, and roles" />
      <Tabs defaultValue="company">
        <TabsList>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="smtp">SMTP</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
          <Row label="Company name" defaultValue="The Knower System" />
          <Row label="Website" defaultValue="theknowersystem.com" />
          <Row label="Tax number" defaultValue="123-456-789" />
          <Row label="Address" defaultValue="Cairo, Egypt" />
          <Button>Save</Button>
        </TabsContent>

        <TabsContent value="smtp" className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
          <Row label="SMTP host" defaultValue="smtp.mailtrap.io" />
          <Row label="SMTP port" defaultValue="587" />
          <Row label="Username" defaultValue="admin" />
          <Row label="From email" defaultValue="no-reply@theknower.io" />
          <Button>Save</Button>
        </TabsContent>

        <TabsContent value="api" className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
          <Row label="API base URL" defaultValue="https://api.theknowersystem.com/api/v1" />
          <Row label="Version" defaultValue="v1" />
          <p className="text-xs text-muted-foreground">Rotate API tokens from your Laravel Sanctum dashboard.</p>
        </TabsContent>

        <TabsContent value="backup" className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between"><Label>Automatic daily backup</Label><Switch defaultChecked /></div>
          <Row label="S3 bucket" defaultValue="knower-backups" />
          <Row label="Retention (days)" defaultValue="30" />
          <Button>Backup now</Button>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
          {["Invoice paid", "Domain expiring", "Hosting expiring", "New ticket", "New bug"].map((n) => (
            <div key={n} className="flex items-center justify-between">
              <Label>{n}</Label>
              <Switch defaultChecked />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between"><Label>Two-factor authentication</Label><Switch /></div>
          <div className="flex items-center justify-between"><Label>Enforce strong passwords</Label><Switch defaultChecked /></div>
          <div className="flex items-center justify-between"><Label>Session timeout (30 min)</Label><Switch defaultChecked /></div>
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <RolesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Row({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[200px_1fr] sm:items-center">
      <Label>{label}</Label>
      <Input defaultValue={defaultValue} />
    </div>
  );
}

function RolesTab() {
  const [roles, setRoles] = useState(() => 
    ALL_ROLES.map((id) => ({
      id,
      name: ROLE_LABELS[id],
      permissions: [...ROLE_PERMISSIONS[id]] as Permission[],
    }))
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editRole, setEditRole] = useState<{ id: string; name: string; permissions: Permission[] } | null>(null);

  const handleDelete = (id: string) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
    toast.success("Role deleted successfully.");
  };

  const handleSave = () => {
    if (!editRole || !editRole.name.trim()) {
      toast.error("Role name cannot be empty.");
      return;
    }
    
    setRoles((prev) => {
      const exists = prev.find((r) => r.id === editRole.id);
      if (exists) {
        return prev.map((r) => r.id === editRole.id ? editRole : r);
      }
      return [...prev, editRole];
    });
    
    toast.success("Role saved successfully.");
    setIsEditing(false);
  };

  const togglePermission = (perm: Permission) => {
    if (!editRole) return;
    setEditRole((prev) => {
      if (!prev) return prev;
      const has = prev.permissions.includes(perm);
      return {
        ...prev,
        permissions: has ? prev.permissions.filter((p) => p !== perm) : [...prev.permissions, perm],
      };
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => {
          setEditRole({ id: `role_${Date.now()}`, name: "", permissions: [] });
          setIsEditing(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Add Role
        </Button>
      </div>

      <div className="space-y-4">
        {roles.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display font-semibold">{r.name}</h4>
                <span className="text-xs text-muted-foreground">{r.permissions.length} permissions</span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => {
                  setEditRole(r);
                  setIsEditing(true);
                }}>
                  <Edit className="h-4 w-4" />
                </Button>
                {r.id !== "super_admin" && (
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(r.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {r.permissions.slice(0, 12).map((p) => (
                <StatusBadge key={p} value={p.replace(".", " ")} />
              ))}
              {r.permissions.length > 12 && (
                <span className="text-xs text-muted-foreground">+{r.permissions.length - 12} more</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editRole?.id.startsWith('role_') ? 'Create Role' : 'Edit Role'}</DialogTitle>
          </DialogHeader>
          {editRole && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Role Name</Label>
                <Input 
                  value={editRole.name} 
                  onChange={(e) => setEditRole({ ...editRole, name: e.target.value })}
                  placeholder="e.g. Marketing Manager" 
                />
              </div>
              <div className="space-y-3">
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {PERMISSIONS.map((perm) => (
                    <div key={perm} className="flex items-center space-x-2">
                      <Checkbox 
                        id={perm} 
                        checked={editRole.permissions.includes(perm)}
                        onCheckedChange={() => togglePermission(perm)}
                      />
                      <label 
                        htmlFor={perm} 
                        className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {perm.replace(".", " ")}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
