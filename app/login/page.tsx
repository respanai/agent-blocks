"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

type AuthMode = "signin" | "signup";

const nodeTypes = [
  { label: "Start", color: "border-node-start text-node-start bg-node-start/10", dot: "bg-node-start" },
  { label: "Prompt", color: "border-node-prompt text-node-prompt bg-node-prompt/10", dot: "bg-node-prompt" },
  { label: "Decision", color: "border-node-decision text-node-decision bg-node-decision/10", dot: "bg-node-decision" },
  { label: "Human", color: "border-node-human text-node-human bg-node-human/10", dot: "bg-node-human" },
  { label: "End", color: "border-node-end text-node-end bg-node-end/10", dot: "bg-node-end" },
];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = getSupabase();

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        setSignupSuccess(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        router.replace(redirectTo);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const { error } = await getSupabase().auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface border-r border-surface-light flex-col justify-between p-16">
        <div>
          <h1 className="text-5xl font-mono font-bold text-stone-800">
            Agent Architect
          </h1>
          <p className="text-lg text-stone-500 mt-4 font-sans max-w-lg leading-relaxed">
            Design AI Agent architectures as finite state machines.
            Drag states onto a canvas, connect them with transitions,
            and export your design as YAML or JSON.
          </p>
        </div>

        {/* Decorative node type chips + flow line */}
        <div className="space-y-8">
          <div className="flex flex-wrap gap-3">
            {nodeTypes.map((node) => (
              <div
                key={node.label}
                className={`rounded-lg border-2 px-5 py-3 font-mono text-sm font-bold uppercase tracking-wider ${node.color}`}
              >
                {node.label}
              </div>
            ))}
          </div>

          {/* 5 dots matching the 5 chips above */}
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-surface-light" />
            {nodeTypes.map((node, i) => (
              <div key={node.label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${node.dot}`} />
                {i < nodeTypes.length - 1 && (
                  <div
                    className="w-14 h-px bg-stone-400"
                    style={i % 2 === 1 ? { borderTop: "2px dashed", background: "none" } : undefined}
                  />
                )}
              </div>
            ))}
            <div className="h-px flex-1 bg-surface-light" />
          </div>
        </div>

        <div className="text-sm text-stone-400 font-mono">
          Built for teams designing agentic workflows
        </div>
      </div>

      {/* Right panel — auth form */}
      <div className="flex-1 flex items-center justify-center p-10">
        <div className="w-full max-w-lg">
          {/* Mobile-only title */}
          <div className="lg:hidden mb-10 text-center">
            <h1 className="text-3xl font-mono font-bold text-stone-800">
              Agent Architect
            </h1>
            <p className="text-base text-stone-500 mt-2 font-sans">
              Design AI Agent architectures as finite state machines
            </p>
          </div>

          <div className="rounded-xl border border-surface-light bg-surface p-10">
            {signupSuccess ? (
              /* Signup success notice */
              <div className="text-center space-y-6">
                <div className="rounded-lg border border-node-start/30 bg-node-start/10 px-6 py-5">
                  <p className="text-sm text-node-start font-mono font-bold mb-2">
                    Check your email
                  </p>
                  <p className="text-sm text-stone-600 font-sans">
                    We sent a verification link to <strong>{email}</strong>.
                    Click the link, then sign in.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSignupSuccess(false);
                    setMode("signin");
                    setError(null);
                  }}
                  className="rounded-lg bg-selected/20 px-5 py-3 font-mono text-sm text-selected hover:bg-selected/30 transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <>
                {/* Tab toggle */}
                <div className="flex gap-3 mb-8">
                  {(["signin", "signup"] as AuthMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setMode(m);
                        setError(null);
                      }}
                      className={`flex-1 rounded-lg px-4 py-3 font-mono text-sm uppercase tracking-wider ${
                        mode === m
                          ? "bg-selected/20 text-selected border border-selected/40"
                          : "bg-surface-light text-stone-500 border border-transparent hover:text-stone-800"
                      } transition-colors`}
                    >
                      {m === "signin" ? "Sign In" : "Sign Up"}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm text-stone-500 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-lg bg-surface-light border border-surface-light px-4 py-3 text-base text-stone-800 focus:border-selected focus:outline-none"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-stone-500 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full rounded-lg bg-surface-light border border-surface-light px-4 py-3 text-base text-stone-800 focus:border-selected focus:outline-none"
                      placeholder="Min 6 characters"
                    />
                  </div>

                  {error && (
                    <div className="rounded-lg border border-node-end/30 bg-node-end/10 px-4 py-3 text-sm text-node-end">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-selected/20 px-5 py-3 font-mono text-base text-selected hover:bg-selected/30 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-selected border-t-transparent" />
                        {mode === "signin" ? "Signing in..." : "Creating account..."}
                      </span>
                    ) : mode === "signin" ? (
                      "Sign In"
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-surface-light" />
                  <span className="text-xs text-stone-400 font-mono uppercase tracking-wider">
                    or
                  </span>
                  <div className="flex-1 h-px bg-surface-light" />
                </div>

                {/* Google OAuth */}
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full rounded-lg bg-surface-light border border-surface-light px-5 py-3 font-mono text-base text-stone-600 hover:text-stone-800 hover:border-selected/40 transition-colors flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
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
                  Sign in with Google
                </button>
              </>
            )}
          </div>

          <p className="text-center text-xs text-stone-400 font-mono mt-6">
            Built with finite state machines in mind
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
