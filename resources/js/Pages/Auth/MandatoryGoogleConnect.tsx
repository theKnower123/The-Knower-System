import React from "react";
import { KnowerLogo } from "@/components/knower-logo";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight, Lock } from "lucide-react";
import { useAuth } from "@/store/auth";

export default function MandatoryGoogleConnect() {
  const user = useAuth((s) => s.user);

  const handleGoogleConnect = () => {
    window.location.href = "/auth/google";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Decorator Gradients */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-8 space-y-6 relative z-10 text-center">
        <div className="flex justify-center">
          <KnowerLogo showText={true} size="lg" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" /> Mandatory First-Time Step
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
            Connect Your Google Account
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Welcome to Knower OS, <span className="font-semibold text-foreground">{user?.name || "User"}</span>! To ensure maximum security and enable Single Sign-On, you must connect your account with Google before accessing the platform.
          </p>
        </div>

        <div className="bg-muted/40 p-4 rounded-2xl border border-border/50 text-left space-y-3">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-foreground">Enhanced Account Security</span>
              <p className="text-muted-foreground">Links your identity with Google OAuth multi-factor protection.</p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleGoogleConnect}
          className="w-full py-6 text-sm font-semibold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 gap-2 group transition-all"
        >
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
          Connect Account with Google
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>

        <p className="text-[10px] text-muted-foreground text-center">
          This step is required once during your initial login. You will not be able to bypass this screen.
        </p>
      </div>
    </div>
  );
}
