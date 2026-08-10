import { router } from "@inertiajs/react";
import { Bell, Languages, LogOut, User, Laptop, CheckCircle2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/store/auth";
import { useLocaleStore } from "@/store/i18n";
import { useCollection } from "@/mocks/store";
import { ROLE_LABELS } from "@/lib/permissions";

import { ModeToggle } from "@/components/mode-toggle";

import { useEffect, useState } from "react";
import axios from "axios";

export function AppHeader() {
  const { t, i18n } = useTranslation();
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);

  const [notifications, setNotifications] = useState<any[]>([]);
  const unread = notifications.filter((n) => !n.read_at && !n.read).length;

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/api/v1/notifications");
      if (res.data?.data?.data) {
        setNotifications(res.data.data.data);
      } else if (Array.isArray(res.data?.data)) {
        setNotifications(res.data.data);
      }
    } catch (e) {
      console.error("Failed to load notifications", e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    try {
      await axios.post("/api/v1/notifications/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })));
    } catch (e) {
      console.error(e);
    }
  };

  const switchLocale = () => {
    const next = locale === "en" ? "ar" : "en";
    setLocale(next);
    void i18n.changeLanguage(next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
  };

  const initials = user?.name?.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase() ?? "?";

  const approveDeviceRequest = async (requestId: number, notifId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await axios.post(`/api/v1/profile/devices/approve/${requestId}`);
      if (res.data.success) {
        toast.success(res.data.message || "Device approved successfully!");
        setNotifications((prev) =>
          prev.map((n) => (n.id === notifId ? { ...n, read_at: new Date().toISOString() } : n))
        );
      } else {
        toast.error(res.data.message || "Failed to approve device.");
      }
    } catch (err) {
      toast.error("Error approving device.");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger />
      <div className="flex-1" />
      <ModeToggle />
      <Button variant="ghost" size="sm" onClick={switchLocale} className="gap-1">
        <Languages className="h-4 w-4" />
        <span className="text-xs uppercase">{locale}</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute inset-e-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground animate-pulse">
                {unread}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-84 shadow-xl border-border p-1">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="font-semibold text-sm">{t("common.notifications", "Notifications")}</span>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs text-primary hover:underline font-medium">
                Mark all read
              </button>
            )}
          </div>
          <DropdownMenuSeparator />
          <div className="max-h-[340px] overflow-y-auto divide-y divide-border/40">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {t("common.empty", "Nothing here yet")}
              </div>
            ) : (
              notifications.slice(0, 6).map((n) => {
                const data = typeof n.data === "string" ? JSON.parse(n.data) : (n.data || {});
                const isRead = !!n.read_at;
                const approvalReqId = data.extra?.approval_request_id || data.approval_request_id;
                const isCancelled = data.status === "cancelled" || data.title?.toLowerCase().includes("cancel");

                return (
                  <DropdownMenuItem
                    key={n.id}
                    className="flex flex-col items-start gap-1.5 p-3 cursor-pointer hover:bg-muted/60 transition rounded-lg my-0.5"
                    onClick={() => {
                      if (data.action_url) router.visit(data.action_url);
                    }}
                  >
                    <div className="flex w-full justify-between items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        {data.category === "security" ? (
                          <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        ) : (
                          <Bell className="w-3.5 h-3.5 text-primary shrink-0" />
                        )}
                        <span className="font-semibold text-xs text-foreground line-clamp-1">
                          {data.title || n.title || "System Alert"}
                        </span>
                      </div>
                      {!isRead && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                    </div>
                    <span className="text-xs text-muted-foreground line-clamp-2 text-start leading-relaxed">
                      {data.message || n.message}
                    </span>

                    {/* Actionable buttons inside notification item */}
                    <div className="flex items-center justify-between w-full mt-1 pt-1 border-t border-border/30">
                      <span className="text-[10px] text-muted-foreground/70">
                        {new Date(n.created_at || n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {approvalReqId && (
                          <Button
                            size="sm"
                            className="h-6 px-2 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1 rounded-md"
                            onClick={(e) => approveDeviceRequest(approvalReqId, n.id, e)}
                          >
                            <Laptop className="w-3 h-3" /> Approve
                          </Button>
                        )}

                        {isCancelled && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground border">
                            Cancelled
                          </span>
                        )}

                        {data.action_url && !approvalReqId && (
                          <span className="text-[10px] font-semibold text-primary hover:underline">
                            View →
                          </span>
                        )}
                      </div>
                    </div>
                  </DropdownMenuItem>
                );
              })
            )}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="justify-center text-center w-full font-semibold text-xs text-primary p-2"
            onClick={() => router.visit("/notifications")}
          >
            View All Notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 px-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {initials}
            </div>
            <div className="hidden text-start leading-tight md:block">
              <div className="text-xs font-semibold">{user?.name}</div>
              <div className="text-[10px] text-muted-foreground">
                {user ? ROLE_LABELS[user.role] : ""}
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.visit("/profile")}>
            <User className="me-2 h-4 w-4" />
            {t("auth.profileSettings", "Profile Settings")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              logout();
              router.visit("/login");
            }}
          >
            <LogOut className="me-2 h-4 w-4" />
            {t("auth.signOut")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
