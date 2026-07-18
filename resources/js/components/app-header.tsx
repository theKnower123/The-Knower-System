import { router } from "@inertiajs/react";
import { Bell, Languages, LogOut, User } from "lucide-react";
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

export function AppHeader() {
  const { t, i18n } = useTranslation();
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const notifications = useCollection("notifications");
  const notifArray = Array.isArray(notifications) ? notifications : [];
  const unread = notifArray.filter((n) => !n.read).length;

  const switchLocale = () => {
    const next = locale === "en" ? "ar" : "en";
    setLocale(next);
    void i18n.changeLanguage(next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
  };

  const initials = user?.name?.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase() ?? "?";

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
              <span className="absolute inset-e-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {unread}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="font-semibold">{t("common.notifications", "Notifications")}</span>
            {unread > 0 && (
              <span className="text-xs text-muted-foreground">{unread} unread</span>
            )}
          </div>
          <DropdownMenuSeparator />
          <div className="max-h-[300px] overflow-y-auto">
            {notifArray.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {t("common.empty", "Nothing here yet")}
              </div>
            ) : (
              notifArray.slice(0, 5).map((n) => (
                <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 p-3">
                  <div className="flex w-full justify-between items-center gap-2">
                    <span className="font-medium text-sm">{n.title}</span>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                  </div>
                  <span className="text-xs text-muted-foreground line-clamp-2 text-start">
                    {n.message}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60 mt-1">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-center text-center w-full font-medium" onClick={() => router.visit("/notifications")}>
            View all
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
