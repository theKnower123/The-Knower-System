import { Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { Lock, Clock, AlertTriangle, CheckCircle2, ArrowLeft } from "lucide-react";

interface Props {
  email: string;
  token: string;
  is_expired?: boolean;
  is_used?: boolean;
  seconds_remaining?: number;
}

export default function ResetPasswordPage({
  email: initialEmail,
  token,
  is_expired = false,
  is_used = false,
  seconds_remaining = 300,
}: Props) {
  const [email, setEmail] = useState(initialEmail || "");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(seconds_remaining);
  const [expired, setExpired] = useState(is_expired || is_used || seconds_remaining <= 0);

  useEffect(() => {
    if (expired) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [expired]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (expired) {
      toast.error("This reset link has expired. Please request a new one.");
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/reset-password", {
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });

      toast.success(res.data?.message || "Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        router.visit("/login");
      }, 1200);
    } catch (error: any) {
      const msg = error.response?.data?.message || error.response?.data?.errors?.email?.[0] || error.response?.data?.errors?.password?.[0] || "Failed to reset password.";
      toast.error(msg);
      if (msg.toLowerCase().includes("expired") || msg.toLowerCase().includes("used")) {
        setExpired(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--primary)_20%,transparent),transparent_60%)]" />
      <div className="relative w-full max-w-md">
        <div className="flex flex-col justify-center rounded-2xl border border-border bg-card p-8 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="font-display text-lg font-bold">K</span>
              </div>
              <div className="font-display text-lg font-semibold leading-none">The Knower OS</div>
            </div>

            {!expired && (
              <div className="flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Clock className="h-3.5 w-3.5 animate-pulse" />
                <span>Expires in {timeFormatted}</span>
              </div>
            )}
          </div>

          <h1 className="font-display text-2xl font-semibold">Set New Password</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your new secure password below to complete account recovery.
          </p>

          {expired ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-center">
                <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
                <p className="font-semibold text-sm text-destructive">Link Expired or Already Used</p>
                <p className="text-xs text-muted-foreground mt-1">
                  For your security, Telegram password reset links are strictly single-use and expire within 5 minutes.
                </p>
              </div>

              <Button asChild className="w-full">
                <Link href="/forgot-password">Request New Reset Link</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm New Password</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                <Lock className="h-4 w-4" />
                {loading ? "Updating Password..." : "Reset Password & Sign In"}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-sm">
            <Link href="/login" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
