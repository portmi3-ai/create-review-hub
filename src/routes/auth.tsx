import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — InvestorOS" },
      { name: "description", content: "Sign in or create an investor account to access the Discharge Bridge investor room." },
    ],
  }),
  component: AuthPage,
});

const credentialsSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Use at least 8 characters").max(72),
});

const signupSchema = credentialsSchema.extend({
  displayName: z.string().trim().min(1, "Required").max(80),
  firm: z.string().trim().max(120).optional().or(z.literal("")),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [firm, setFirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled && data.session) navigate({ to: "/", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate({ to: "/", replace: true });
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const parsed = signupSchema.parse({ email, password, displayName, firm });
        const { error } = await supabase.auth.signUp({
          email: parsed.email,
          password: parsed.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: parsed.displayName, firm: parsed.firm || null },
          },
        });
        if (error) throw error;
        setInfo("Account created. If email confirmation is required, check your inbox.");
      } else {
        const parsed = credentialsSchema.parse({ email, password });
        const { error } = await supabase.auth.signInWithPassword(parsed);
        if (error) throw error;
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0]?.message ?? "Invalid input");
      } else {
        setError(err instanceof Error ? err.message : "Authentication failed");
      }
    } finally {
      setLoading(false);
    }
  }

  async function signInGoogle() {
    setError(null);
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        setError(result.error instanceof Error ? result.error.message : "Google sign-in failed");
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">InvestorOS</p>
        <h1 style={{ fontSize: 36 }}>{mode === "signin" ? "Sign in" : "Create account"}</h1>
        <p style={{ marginTop: 8 }}>
          {mode === "signin"
            ? "Access the Discharge Bridge investor room."
            : "New accounts get the investor role by default. An admin can elevate later."}
        </p>

        <button className="google-btn" onClick={signInGoogle} disabled={loading}>
          Continue with Google
        </button>

        <div className="divider"><span>or</span></div>

        <form onSubmit={submit} className="auth-form">
          {mode === "signup" && (
            <>
              <label>
                <small>Display name</small>
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
              </label>
              <label>
                <small>Firm (optional)</small>
                <input value={firm} onChange={(e) => setFirm(e.target.value)} />
              </label>
            </>
          )}
          <label>
            <small>Email</small>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </label>
          <label>
            <small>Password</small>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              minLength={8}
            />
          </label>
          {error && <div className="auth-error">{error}</div>}
          {info && <div className="auth-info">{info}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p style={{ marginTop: 16, fontSize: 14 }}>
          {mode === "signin" ? "No account?" : "Already have one?"}{" "}
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setInfo(null);
            }}
          >
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>
    </main>
  );
}
