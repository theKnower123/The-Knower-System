import { Outlet, createFileRoute } from "@tanstack/react-router";
import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";
import { ChatWidget } from "@/components/public/ChatWidget";
import { PageTransitionProvider } from "@/components/public/PageTransitionManager";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <PageTransitionProvider>
      <div className="flex min-h-screen flex-col bg-background selection:bg-primary/30 selection:text-primary">
        <PublicHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <PublicFooter />
        <ChatWidget />
      </div>
    </PageTransitionProvider>
  );
}
