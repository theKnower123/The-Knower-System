import { router, Link } from "@inertiajs/react";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/auth";
import {
  Sparkles, Eye, EyeOff, LogIn, Lock, Mail, KeyRound,
  User, Sun, Moon, ArrowRight, CheckCircle2, ShieldCheck, Layers, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

interface LastAccount {
  email: string;
  name?: string;
  role?: string;
  avatar?: string;
}

export default function LoginPage() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const login = useAuth((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastAccount, setLastAccount] = useState<LastAccount | null>(null);
  const [isLastAccountSelected, setIsLastAccountSelected] = useState(false);

  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("knower_last_account");
      if (saved) {
        setLastAccount(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Error parsing last account:", e);
    }
  }, []);

  const selectLastAccount = (acc: LastAccount) => {
    const targetEmail = acc.email || "omarmehawed@knoweros.com";
    setEmail(targetEmail);
    setIsLastAccountSelected(true);
    toast.success(`Selected ${acc.name || targetEmail}`);
    setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 120);
  };

  const handleDeselectAccount = () => {
    setIsLastAccountSelected(false);
    setEmail("");
    setPassword("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      
      // Save last account details to localStorage
      const userObj = useAuth.getState().user;
      const accountData: LastAccount = {
        email,
        name: userObj?.name || email.split("@")[0],
        role: userObj?.role || "User",
      };
      localStorage.setItem("knower_last_account", JSON.stringify(accountData));

      toast.success("Login successful!");
      router.visit("/dashboard");
    } catch (error) {
      toast.error("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/auth/google";
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const renderLastAccountWidget = () => {
    if (!lastAccount || isLastAccountSelected) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="overflow-hidden rounded-2xl border border-border/80 bg-card/90 hover:border-primary/50 hover:bg-muted/50 shadow-sm transition-all duration-300"
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-primary" /> Last Login Account
            </span>
          </div>

          <button
            type="button"
            onClick={() => selectLastAccount(lastAccount)}
            className="mt-3 flex w-full items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-md">
                {lastAccount.name ? lastAccount.name.slice(0, 2).toUpperCase() : "US"}
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                  {lastAccount.name || "Saved Account"}
                </div>
                <div className="text-[11px] font-semibold text-primary/80 truncate">
                  Click to enter password
                </div>
              </div>
            </div>
            <div className="text-xs font-bold text-primary flex items-center gap-1 shrink-0 group-hover:translate-x-1 transition-transform">
              <span>Password</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12 transition-colors duration-300">
      {/* Background Orbs & Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--primary)_15%,transparent),transparent_70%)]" />
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      {/* Top Header Controls (Theme Switcher & Logo) */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full border-border/80 bg-card/80 shadow-md backdrop-blur-md hover:border-primary/50 hover:bg-muted"
          title="Toggle Light / Dark Mode"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-slate-700" />
          )}
        </Button>
      </div>

      <div className="relative z-10 grid w-full max-w-5xl gap-8 md:grid-cols-[1.1fr_1fr]">
        
        {/* DESKTOP SIDEBAR — Hidden on Mobile */}
        <div className="hidden flex-col justify-between rounded-3xl border border-border/80 bg-card/70 p-10 backdrop-blur-2xl shadow-2xl md:flex">
          <div>
            <a href="/" className="group flex items-center gap-3 w-fit transition-all hover:opacity-90">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 via-primary/10 to-accent/20 p-0.5 shadow-md shadow-primary/20 transition-transform duration-300 group-hover:scale-105">
                <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-background/90 backdrop-blur-md">
                  <img src="/favicon-96x96.png" alt="The Knower OS Logo" className="h-6 w-6 object-contain" />
                </div>
                <div className="absolute -inset-1 rounded-2xl bg-primary/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div>
                <div className="font-display text-xl font-extrabold leading-none text-foreground group-hover:text-primary transition-colors">
                  The Knower OS
                </div>
                <div className="mt-1 text-xs font-mono font-semibold text-primary uppercase tracking-wider">
                  ONE SYSTEM . ANY BUSINESS
                </div>
              </div>
            </a>
            <div className="mt-5 space-y-4">
              <h2 className="font-display text-3xl font-extrabold leading-tight text-foreground">
                One System for your entire Software House
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                CRM, Agile Projects, Managed Hosting, Multi-Currency Invoicing, HR & AI Copilot — integrated under one secure dashboard.
              </p>
            </div>

            <ul className="mt-8 space-y-3.5 text-sm text-muted-foreground">
              {[
                "12 Role-based specialized dashboards",
                "Complete client portal for approvals & billing",
                "Full project lifecycle from proposal to deployment",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 font-medium text-foreground">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 pt-6 border-t border-border/60 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Internal system — Accounts created by system administrators
            </div>

            {/* Desktop Last Account Placement under internal system text */}
            {renderLastAccountWidget()}
          </div>
        </div>

        {/* LOGIN FORM CARD (Mobile & Desktop) */}
        <div className="rounded-3xl border border-border/80 bg-card p-8 shadow-2xl backdrop-blur-2xl sm:p-10 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <LogIn className="h-6 w-6 text-primary" /> Sign In
            </h1>
            <a href="/" title="Go to homepage" className="md:hidden flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 p-0.5 shadow-sm transition-transform group-hover:scale-105">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-background/90">
                  <img src="/favicon-96x96.png" alt="The Knower OS Logo" className="h-5 w-5 object-contain" />
                </div>
              </div>
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            Welcome back to The Knower OS
          </p>

          {/* Login with Google Button */}
          <div className="mt-6">
            <Button
              variant="outline"
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-6 text-sm font-semibold rounded-2xl transition-all duration-200 border-border/80 hover:border-primary/50 hover:bg-accent/10 shadow-sm"
            >
              <svg className="mr-2.5 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Login with Google
            </Button>
          </div>

          {/* MOBILE ONLY: Last Login Account directly under Google Login */}
          <div className="md:hidden">
            {renderLastAccountWidget()}
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-wider">
              <span className="bg-card px-3 text-muted-foreground">Or email login</span>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {/* IF LAST ACCOUNT IS SELECTED: Show Avatar Profile Header instead of Email Input */}
            <AnimatePresence mode="wait">
              {isLastAccountSelected && lastAccount ? (
                <motion.div
                  key="avatar-profile"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/10 p-3.5 shadow-sm"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-extrabold text-base shadow-md">
                      {lastAccount.name ? lastAccount.name.slice(0, 2).toUpperCase() : "US"}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-sm text-foreground truncate">
                        {lastAccount.name || "Welcome Back"}
                      </div>
                      <div className="text-[11px] font-medium text-primary truncate">
                        {lastAccount.email ? `${lastAccount.email} • ` : ""}Type password to continue
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDeselectAccount}
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline shrink-0 bg-background/80 px-2.5 py-1 rounded-lg border border-border/60 shadow-xs"
                    title="Use a different email"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Change</span>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="email-input"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-xs font-bold text-foreground">
                    {t("auth.email")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-10 h-11 rounded-xl bg-background/60 border-border/80 focus-visible:ring-primary"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* PASSWORD INPUT (Always visible, focused when account selected) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold text-foreground">
                  {t("auth.password")}
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={passwordInputRef}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 rounded-xl bg-background/60 border-border/80 focus-visible:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-bold rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all mt-2"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>

          <p className="mt-6 text-center text-[11px] text-muted-foreground">
            Accounts are provisioned internally by your administrator. No public registration.
          </p>
        </div>

      </div>
    </div>
  );
}

