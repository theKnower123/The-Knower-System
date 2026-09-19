import { Link } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Send, CheckCircle2, ShieldAlert, ArrowRight, Bot, UserCheck } from "lucide-react";
import { useAuth } from "@/store/auth";

interface Props {
  chat_id: string;
  telegram_username?: string;
  sig: string;
  already_linked_to_other: boolean;
  current_user_linked_to_other: boolean;
  is_already_connected: boolean;
}

export default function TelegramConnectPage({
  chat_id,
  telegram_username,
  sig,
  already_linked_to_other,
  current_user_linked_to_other,
  is_already_connected: initialConnected,
}: Props) {
  const user = useAuth((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(initialConnected);
  const [error, setError] = useState<string | null>(null);

  const confirmConnect = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("/telegram/connect/confirm", {
        chat_id,
        telegram_username,
        sig,
      });

      setConnected(true);
      toast.success(res.data?.message || "Telegram account linked successfully!");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to link Telegram account.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--primary)_20%,transparent),transparent_60%)]" />
      <div className="relative w-full max-w-lg">
        <div className="flex flex-col justify-center rounded-2xl border border-border bg-card p-8 shadow-xl">
          {/* Header icon badge */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
            <Send className="h-8 w-8" />
          </div>

          <h1 className="text-center font-display text-2xl font-bold tracking-tight text-foreground">
            Connect Telegram Account
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Link your Telegram account to receive real-time notifications, task updates, and security recovery alerts.
          </p>

          {/* Identity comparison cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-2">
                Platform Account
              </span>
              <p className="font-semibold text-foreground truncate">{user?.name || "Authenticated User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              <span className="inline-block mt-2 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {user?.role || "Member"}
              </span>
            </div>

            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-2">
                Telegram Profile
              </span>
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <Bot className="h-4 w-4 text-sky-500" />
                {telegram_username ? `@${telegram_username}` : "Telegram User"}
              </p>
              <p className="text-xs font-mono text-muted-foreground mt-0.5">Chat ID: {chat_id}</p>
              <span className="inline-block mt-2 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400">
                Verified Link
              </span>
            </div>
          </div>

          {/* Block / Conflict Errors */}
          {(already_linked_to_other || current_user_linked_to_other || error) && (
            <div className="mt-5 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-sm block mb-1">Connection Blocked</span>
                <span>
                  {error ||
                    (already_linked_to_other
                      ? "This Telegram account is already associated with another user on this platform."
                      : "Your account is already linked to a different Telegram account. Please unlink it from your settings first.")}
                </span>
              </div>
            </div>
          )}

          {/* Success state */}
          {connected && !error ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-base text-foreground">Successfully Connected!</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  Your Telegram account is now active. You will receive notifications and recovery alerts directly via the bot.
                </p>
              </div>

              <Button asChild className="w-full gap-2">
                <Link href="/dashboard">
                  Continue to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : !already_linked_to_other && !current_user_linked_to_other ? (
            <div className="mt-6 space-y-3">
              <Button
                onClick={confirmConnect}
                disabled={loading}
                className="w-full gap-2 text-base font-semibold py-6"
              >
                <UserCheck className="h-5 w-5" />
                {loading ? "Connecting..." : "Confirm & Connect Account"}
              </Button>

              <p className="text-center text-[11px] text-muted-foreground">
                By connecting, you authorize The Knower Bot to dispatch transactional messages to this chat.
              </p>
            </div>
          ) : (
            <div className="mt-6">
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
