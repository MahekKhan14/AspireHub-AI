import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerRequest } from "../utils/api";
import { getPasswordStrength, isValidEmail } from "../utils/validation";
import LoadingDots from "../components/LoadingDots";

export default function RegisterPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const strength = getPasswordStrength(form.password);

  const setField = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Please enter your name.");
    if (!isValidEmail(form.email)) return setError("Enter a valid email address.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    setError("");
    try {
      const { data } = await registerRequest(form);
      onLoginSuccess(data, true);
      navigate("/app/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 mesh-bg">
      <div className="fixed top-1/4 right-1/3 w-72 h-72 bg-pink-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="font-display font-bold text-white text-xl">AspireHub AI</span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-white">Create your account</h1>
          <p className="text-zinc-500 text-sm mt-1">Start building your AI career plan today.</p>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/[0.08]">
          {error && (
            <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 animate-fade-up">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Your full name"
                className="input-field"
              />
            </div>

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
                placeholder="Min 6 characters"
                className="input-field"
              />
              {form.password && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-zinc-500 mb-1">
                    <span>Password strength</span>
                    <span className={strength.percent >= 65 ? "text-emerald-400" : "text-zinc-500"}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-white/10">
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.percent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <LoadingDots size="sm" /> : "Create Account →"}
            </button>
          </form>

          <p className="text-xs text-zinc-600 text-center mt-4">
            By signing up, you agree to use this platform responsibly.
          </p>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
