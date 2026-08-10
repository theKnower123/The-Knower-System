import React, { useState } from "react";
import { useAuth } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { KnowerLogo } from "@/components/knower-logo";
import { ShieldCheck, Lock, CheckCircle2, ArrowRight, LogOut } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function MustConnectGoogle() {
  const { user, logout } = useAuth();
  const [connecting, setConnecting] = useState(false);

  const handleConnectGoogle = () => {
    setConnecting(true);
    toast.loading("Connecting with Google...", { duration: 3000 });
    window.location.href = "/auth/google/redirect";
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (e) {
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-primary/20 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-[110px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-xl rounded-3xl border border-primary/30 bg-card/95 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl relative z-10 text-center space-y-6"
      >
        {/* System Logo */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border border-primary/20 shadow-md">
            <KnowerLogo showText={true} size="lg" />
          </div>

          <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
            <ShieldCheck className="h-4 w-4" />
            <span>MANDATORY ACCOUNT VERIFICATION • ALL ROLES</span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2.5">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Connect Your Google Account
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            Welcome <span className="font-bold text-foreground">{user?.name || "User"}</span>! System policy mandates that 
            <span className="font-semibold text-foreground"> every user account across all roles </span> 
            must connect an official Google account before accessing the system.
          </p>
        </div>

        {/* Info Card */}
        <div className="rounded-2xl border border-border/80 bg-muted/30 p-4.5 text-left space-y-3.5">
          <div className="flex items-start gap-3.5">
            <div className="h-7 w-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Universal Security Mandate</h4>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Enforced across all accounts to ensure authenticated ownership and system integrity.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="h-7 w-7 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Single Sign-On Authentication</h4>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Once connected, you can sign in directly using Google or your usual credentials.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button
            onClick={handleConnectGoogle}
            disabled={connecting}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-base shadow-xl shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all gap-3 cursor-pointer"
          >
            <svg className="h-6 w-6 shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            <span>{connecting ? "Opening Google Sign-In..." : "Connect with Google"}</span>
            <ArrowRight className="h-5 w-5" />
          </Button>

          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground hover:text-foreground gap-2 py-2"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign out of this session</span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
