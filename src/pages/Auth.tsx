import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Coffee, Loader2, LogIn, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Auth = () => {
  const { user, loading, signInOrSignUp } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && user) return <Navigate to="/" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!email || password.length < 6) {
      toast.error("Enter a valid email and a password of at least 6 characters.");
      return;
    }
    setBusy(true);
    const { error, created } = await signInOrSignUp(email.trim(), password);
    setBusy(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(created ? "Account created — welcome!" : "Welcome back!");
    nav("/", { replace: true });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      <div className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />

      <div className="container relative flex min-h-screen items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant">
              <Coffee className="h-7 w-7" />
            </div>
            <h1 className="font-display text-3xl font-bold">Barath's Refresh Portal</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to continue. New here? We'll create your account automatically.
            </p>
          </div>

          <form
            onSubmit={submit}
            className="rounded-2xl border border-border bg-card p-6 shadow-elegant sm:p-7"
          >
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div className="mb-5">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="At least 6 characters"
                minLength={6}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              {busy ? "Continuing…" : "Continue"}
            </button>

            <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              One step. We sign you in or create your account from the same form.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
