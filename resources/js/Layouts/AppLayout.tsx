import { ReactNode, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { usePage } from "@inertiajs/react";
import { PageTransition } from "@/components/animations/PageTransition";
import { MandatoryGoogleModal } from "@/components/MandatoryGoogleModal";

import { useAuth } from "@/store/auth";
import type { Role } from "@/lib/permissions";

import { useTranslation } from "react-i18next";

interface Props {
  children: ReactNode;
}

export default function AppLayout({ children }: Props) {
  const { url, props } = usePage();
  const user = useAuth((s) => s.user);
  const setUser = useAuth((s) => s.setUser);
  const { i18n } = useTranslation();

  const authData = (props as any)?.auth;
  const serverUser = authData?.user || null;

  useEffect(() => {
    if (serverUser) {
      // Normalize role
      let backendRole = (serverUser.role || "client").toLowerCase().replace(/ /g, "_");
      if (backendRole === "organization_admin") backendRole = "ceo";
      if (backendRole === "hr_manager") backendRole = "hr";
      
      const validRole = [
        "super_admin", "administrator", "ceo", "sales", "marketing_admin", "social_manager", 
        "ads_specialist", "content_creator", "project_manager", "team_leader", "developer", 
        "designer", "qa", "accountant", "hr", "support", "support_manager", "client"
      ].includes(backendRole) ? backendRole : "client";

      setUser({
        id: serverUser.id,
        name: serverUser.name,
        email: serverUser.email,
        role: validRole as Role,
        avatar: serverUser.avatar,
        google_id: serverUser.google_id || null,
        must_connect_google: !serverUser.google_id,
        client_id: serverUser.client_id,
        department: serverUser.department,
        position: serverUser.position,
      });
    }
  }, [serverUser, setUser]);

  const isRtl = i18n.language === "ar";
  
  // Mandatory Google Connection enforcement for ALL users across the entire system
  const hasGoogle = Boolean(serverUser?.google_id || (user && user.google_id));
  const isMustConnect = serverUser && !hasGoogle;

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

      {/* Prominent Mandatory Google Connection Modal if not connected */}
      {isMustConnect && (
        <MandatoryGoogleModal
          userName={serverUser?.name || user?.name}
          userEmail={serverUser?.email || user?.email}
          userRole={serverUser?.role || user?.role}
        />
      )}
    </SidebarProvider>
  );
}
