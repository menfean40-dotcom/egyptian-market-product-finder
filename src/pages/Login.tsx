import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Sparkles, User, Lock, Mail, ArrowLeft } from "lucide-react";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("local_auth_token", data.token);
      window.location.href = "/";
    },
    onError: (err) => setError(err.message),
  });

  const registerMutation = trpc.localAuth.register.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("local_auth_token", data.token);
      window.location.href = "/";
    },
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mode === "login") {
      loginMutation.mutate({ username, password });
    } else {
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      registerMutation.mutate({
        username,
        password,
        displayName: displayName || undefined,
        email: email || undefined,
      });
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{ background: "#0C0C1A" }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #9D8CFF, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #ff4ecd, transparent 70%)" }}
        />
      </div>

      <div className="relative w-full max-w-[420px] mx-4">
        <Link
          to="/"
          className="flex items-center gap-1 text-[#9494A8] hover:text-[#EAEAEF] text-[14px] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="card-glow p-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-[#9D8CFF]" />
            <span className="text-[22px] font-medium text-[#EAEAEF]">Genie</span>
          </div>
          <p className="text-[#9494A8] text-[14px] mb-6">
            {mode === "login"
              ? "Sign in to your account"
              : "Create your free account"}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[rgba(255,107,107,0.1)] border border-[rgba(255,107,107,0.2)] text-[#FF6B6B] text-[14px]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
            <div>
              <label className="text-[#9494A8] text-[13px] mb-1.5 block">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9494A8]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[rgba(18,18,42,0.6)] border border-[rgba(255,255,255,0.06)] rounded-md pl-10 pr-4 py-2.5 text-[#EAEAEF] text-[15px] placeholder:text-[#9494A8] focus:border-[#9D8CFF] focus:outline-none transition-colors"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            {mode === "register" && (
              <>
                <div>
                  <label className="text-[#9494A8] text-[13px] mb-1.5 block">
                    Display Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9494A8]" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-[rgba(18,18,42,0.6)] border border-[rgba(255,255,255,0.06)] rounded-md pl-10 pr-4 py-2.5 text-[#EAEAEF] text-[15px] placeholder:text-[#9494A8] focus:border-[#9D8CFF] focus:outline-none transition-colors"
                      placeholder="Your display name"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[#9494A8] text-[13px] mb-1.5 block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9494A8]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[rgba(18,18,42,0.6)] border border-[rgba(255,255,255,0.06)] rounded-md pl-10 pr-4 py-2.5 text-[#EAEAEF] text-[15px] placeholder:text-[#9494A8] focus:border-[#9D8CFF] focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-[#9494A8] text-[13px] mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9494A8]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[rgba(18,18,42,0.6)] border border-[rgba(255,255,255,0.06)] rounded-md pl-10 pr-4 py-2.5 text-[#EAEAEF] text-[15px] placeholder:text-[#9494A8] focus:border-[#9D8CFF] focus:outline-none transition-colors"
                  placeholder={mode === "register" ? "Min 6 characters" : "Enter password"}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isPending
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[rgba(255,255,255,0.06)]" />
            </div>
            <div className="relative flex justify-center text-[12px]">
              <span className="px-3 bg-[#12122A] text-[#9494A8]">or</span>
            </div>
          </div>

          <button
            onClick={() => {
              window.location.href = getOAuthUrl();
            }}
            className="w-full py-2.5 rounded-full border border-[rgba(255,255,255,0.12)] text-[#EAEAEF] text-[15px] font-medium hover:border-[#9D8CFF] hover:text-[#9D8CFF] transition-all"
          >
            Sign in with Kimi
          </button>

          <p className="text-center text-[#9494A8] text-[14px] mt-6">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => { setMode("register"); setError(""); }}
                  className="text-[#9D8CFF] hover:text-[#B8AEFF] transition-colors"
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => { setMode("login"); setError(""); }}
                  className="text-[#9D8CFF] hover:text-[#B8AEFF] transition-colors"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
