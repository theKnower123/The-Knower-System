import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Check, Trash2, ShieldAlert, Users, FolderKanban, HelpCircle, Laptop, Bell } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { router } from "@inertiajs/react";

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/notifications");
      if (res.data?.data?.data) {
        setNotifications(res.data.data.data);
      } else if (Array.isArray(res.data?.data)) {
        setNotifications(res.data.data);
      }
    } catch (e) {
      console.error("Failed to load notifications", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await axios.post("/api/v1/notifications/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })));
      toast.success("All notifications marked as read.");
    } catch (e) {
      toast.error("Failed to mark notifications as read.");
    }
  };

  const markRead = async (id: string) => {
    try {
      await axios.post(`/api/v1/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
      );
    } catch (e) {
      toast.error("Failed to update notification.");
    }
  };

  const deleteNotif = async (id: string) => {
    try {
      await axios.delete(`/api/v1/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notification deleted.");
    } catch (e) {
      toast.error("Failed to delete notification.");
    }
  };

  const approveDeviceRequest = async (requestId: number, notifId: string) => {
    try {
      const res = await axios.post(`/api/v1/profile/devices/approve/${requestId}`);
      if (res.data.success) {
        toast.success(res.data.message || "Device approved successfully!");
        markRead(notifId);
      } else {
        toast.error(res.data.message || "Failed to approve device.");
      }
    } catch (e) {
      toast.error("Error approving device.");
    }
  };

  const categories = [
    { key: "all", label: "All Activity", icon: Bell },
    { key: "security", label: "Security & Devices", icon: ShieldAlert },
    { key: "crm", label: "Clients & Leads", icon: Users },
    { key: "projects", label: "Projects & Tasks", icon: FolderKanban },
    { key: "support", label: "Support Tickets", icon: HelpCircle },
  ];

  const filtered = notifications.filter((n) => {
    if (activeCategory === "all") return true;
    const data = typeof n.data === "string" ? JSON.parse(n.data) : (n.data || {});
    const cat = (data.category || "").toLowerCase();
    if (activeCategory === "security") return cat.includes("security") || cat.includes("auth") || cat.includes("device");
    if (activeCategory === "crm") return cat.includes("crm") || cat.includes("client") || cat.includes("lead");
    if (activeCategory === "projects") return cat.includes("project") || cat.includes("task") || cat.includes("bug");
    if (activeCategory === "support") return cat.includes("support") || cat.includes("ticket");
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title={t("common.notifications", "System Notifications")}
        description="Real-time alerts across Clients, Projects, Leads, Support, Devices, and Security events"
        actions={
          <Button variant="outline" onClick={markAllRead}>
            <Check className="me-2 h-4 w-4" />
            Mark All Read
          </Button>
        }
      />

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 pb-2">
        {categories.map((c) => {
          const Icon = c.icon;
          const isActive = activeCategory === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-primary/20 scale-105"
                  : "bg-card border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden divide-y divide-border">
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground animate-pulse">
            Loading system notifications...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
            <Bell className="w-8 h-8 opacity-40" />
            No notifications found in this category.
          </div>
        ) : (
          filtered.map((n) => {
            const data = typeof n.data === "string" ? JSON.parse(n.data) : (n.data || {});
            const isRead = !!n.read_at;
            const isDeviceApproval = data.extra?.approval_request_id || data.title?.includes("Unapproved Device");

            return (
              <div
                key={n.id}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 transition-colors ${
                  isRead ? "bg-card/40 opacity-70" : "bg-card font-medium border-l-4 border-l-primary"
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-2.5 rounded-xl text-white shrink-0 shadow-sm ${
                    data.category === 'security' ? 'bg-red-500' : 'bg-primary'
                  }`}>
                    {data.category === 'security' ? <ShieldAlert className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-foreground">{data.title || n.title || "Notification"}</h4>
                      {data.category && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                          {data.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{data.message || n.message}</p>
                    <p className="text-[10px] text-muted-foreground/60">
                      {new Date(n.created_at || n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {isDeviceApproval && (
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 shadow-md shadow-emerald-600/20"
                      onClick={() => approveDeviceRequest(data.extra.approval_request_id, n.id)}
                    >
                      <Laptop className="w-3.5 h-3.5" /> Approve Device Login
                    </Button>
                  )}

                  {data.action_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => router.visit(data.action_url)}
                    >
                      View Details
                    </Button>
                  )}

                  {!isRead && (
                    <Button size="sm" variant="ghost" onClick={() => markRead(n.id)} title="Mark as Read">
                      <Check className="h-4 w-4" />
                    </Button>
                  )}

                  <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => deleteNotif(n.id)} title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
