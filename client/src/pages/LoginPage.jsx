import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  demoLoginRequest,
  forgotPasswordRequest,
  loginRequest,
  resetPasswordRequest,
} from "../utils/api";
import { getPasswordStrength, isValidEmail } from "../utils/validation";
import LoadingDots from "../components/LoadingDots";

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = location.state?.from || "/app/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [mode, setMode] = useState("login"); // login | forgot | reset
  const [resetToken, setResetToken] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const strength = getPasswordStrength(newPwd);

  const setField = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isValidEmail(form.email)) return setError("Enter a valid email address.");
    setLoading(true);
    setError("");
    try {
      const { data } = await loginRequest(form);
      onLoginSuccess(data, rememberMe);
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await demoLoginRequest();
      onLoginSuccess(data, false);
      navigate("/app/dashboard", { replace: true });
    } catch {
      setError("Demo login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!isValidEmail(form.email)) return setError("Enter a valid email first.");
    setLoading(true);
    setError("");
    try {
      const { data } = await forgotPasswordRequest({ email: form.email });
      if (data.resetToken) setResetToken(data.resetToken);
      setInfo(data.message);
      setMode("reset");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not initiate reset.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!resetToken || !newPwd) return setError("Token and new password are required.");
    if (newPwd.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    setError("");
    try {
      const { data } = await resetPasswordRequest({ token: resetToken, newPassword: newPwd });
      setInfo(data.message);
      setMode("login");
      setResetToken("");
      setNewPwd("");
    } catch (err) {
      setError(err?.response?.data?.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 mesh-bg">
      <div className="fixed top-0 left-1/3 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-fade-up">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="font-display font-bold text-white text-xl">AspireHub AI</span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-white">
            {mode === "login" ? "Welcome back" : mode === "forgot" ? "Reset password" : "Set new password"}
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {mode === "login" ? "Continue your career journey." : "We'll get you back in."}
          </p>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/[0.08]">
          {error && (
            <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 animate-fade-up">
              {error}
            </div>
          )}
          {info && (
            <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400 animate-fade-up">
              {info}
            </div>
          )}

          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="you@example.com"
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Password</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-violet-500 rounded"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2"
              >
                {loading ? <LoadingDots size="sm" /> : "Sign In"}
              </button>

              <div className="relative flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-zinc-600">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <button
                type="button"
                onClick={handleDemo}
                disabled={loading}
                className="btn-ghost w-full py-3 rounded-xl flex items-center justify-center gap-2"
              >
                {loading ? <LoadingDots size="sm" /> : "Try Demo Account"}
              </button>
            </form>
          )}

          {mode === "forgot" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Your email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="you@example.com"
                  className="input-field"
                />
              </div>
              <button
                onClick={handleForgot}
                disabled={loading}
                className="btn-primary w-full py-3 rounded-xl flex items-center justify-center"
              >
                {loading ? <LoadingDots size="sm" /> : "Send Reset Token"}
              </button>
              <button
                onClick={() => setMode("login")}
                className="btn-ghost w-full py-2.5 rounded-xl text-sm"
              >
                Back to login
              </button>
            </div>
          )}

          {mode === "reset" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Reset Token</label>
                <input
                  type="text"
                  value={resetToken}
                  onChange={(e) => { setResetToken(e.target.value); setError(""); }}
                  placeholder="Paste your reset token"
                  className="input-field font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">New Password</label>
                <input
                  type="password"
                  value={newPwd}
                  onChange={(e) => { setNewPwd(e.target.value); setError(""); }}
                  placeholder="Min 6 characters"
                  className="input-field"
                />
                {newPwd && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-zinc-500 mb-1">
                      <span>Strength</span>
                      <span className={strength.percent >= 65 ? "text-emerald-400" : "text-zinc-400"}>{strength.label}</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/10">
                      <div className={`h-1 rounded-full transition-all ${strength.color}`} style={{ width: `${strength.percent}%` }} />
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={handleReset}
                disabled={loading}
                className="btn-primary w-full py-3 rounded-xl flex items-center justify-center"
              >
                {loading ? <LoadingDots size="sm" /> : "Reset Password"}
              </button>
              <button onClick={() => setMode("login")} className="btn-ghost w-full py-2.5 rounded-xl text-sm">
                Back to login
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-zinc-500 mt-5">
          New to AspireHub?{" "}
          <Link to="/register" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
