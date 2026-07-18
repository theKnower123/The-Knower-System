import { Link } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Assuming a backend route for password reset exists at /forgot-password
      await axios.post("/forgot-password", { email });
      setSent(true);
      toast.success("Password reset link sent! Check your email.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--primary)_20%,transparent),transparent_60%)]" />
      <div className="relative w-full max-w-md">
        <div className="flex flex-col justify-center rounded-2xl border border-border bg-card p-8 shadow-xl">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="font-display text-lg font-bold">K</span>
            </div>
            <div>
              <div className="font-display text-lg font-semibold leading-none">The Knower OS</div>
            </div>
          </div>

          <h1 className="font-display text-2xl font-semibold">Reset Password</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {sent 
              ? "We've sent a password reset link to your email." 
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>

          {!sent ? (
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <div className="mt-6">
              <Button onClick={() => setSent(false)} variant="outline" className="w-full">
                Try another email
              </Button>
            </div>
          )}

          <div className="mt-6 text-center text-sm">
            <Link href="/login" className="font-medium text-primary hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
