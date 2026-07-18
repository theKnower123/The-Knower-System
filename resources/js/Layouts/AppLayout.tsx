import { ReactNode, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { usePage } from "@inertiajs/react";
import { PageTransition } from "@/components/animations/PageTransition";

import { useAuth } from "@/store/auth";
import type { Role } from "@/lib/permissions";

import { useTranslation } from "react-i18next";

interface Props {
  children: ReactNode;
}

export default function AppLayout({ children }: Props) {
  const { url, props } = usePage();
  const setUser = useAuth((s) => s.setUser);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (props.auth && props.auth.user) {
      const serverUser = props.auth.user as any;
      
      // Normalize role
      let backendRole = (serverUser.role || "client").toLowerCase().replace(/ /g, "_");
      if (backendRole === "organization_admin") backendRole = "ceo";
      if (backendRole === "hr_manager") backendRole = "hr";
      
      const validRole = ["super_admin", "ceo", "sales", "project_manager", "team_leader", "developer", "designer", "qa", "accountant", "hr", "support", "client"].includes(backendRole) ? backendRole : "client";

      setUser({
        id: serverUser.id,
        name: serverUser.name,
        email: serverUser.email,
        role: validRole as Role,
        avatar: serverUser.avatar,
      });
    }
  }, [props.auth, setUser]);

  const isRtl = i18n.language === "ar";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background" dir={isRtl ? "rtl" : "ltr"}>
        <AppSidebar />
        <SidebarInset className="min-w-0 flex-1">
          <AppHeader />
          <main className="mx-auto w-full max-w-[1600px] p-6 overflow-x-hidden">
            <PageTransition key={url}>
              {children}
            </PageTransition>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
