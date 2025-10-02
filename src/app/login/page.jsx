"use client";

import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function validate() {
    if (!email) return "Please enter your email.";
    // simple email check
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email.";
    if (!password) return "Please enter your password.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Login failed");
      }

      const data = await res.json();
      setSuccess(data.message || "Logged in");
      // redirect or update app state as needed
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-slate-900 p-6 flex items-center justify-center">
      <main className="w-full max-w-md">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Sign in to VipraVrinda</h1>
          <p className="mt-2 text-slate-600 text-sm">Access your Mahā Rudra dashboard and join live events.</p>
        </header>

        <section className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded p-2">{error}</div>
            )}
            {success && (
              <div className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-100 rounded p-2">{success}</div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-2">Remember me</span>
              </label>

              <a href="#" className="text-sm text-amber-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-lg font-medium text-white ${loading ? "bg-amber-300 cursor-wait" : "bg-amber-600 hover:bg-amber-700"}`}>
                {loading ? "Signing in…" : "Sign in"}
              </button>

              <button
                type="button"
                onClick={() => alert('TODO: social auth')}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50">
                Sign in with Google
              </button>
            </div>

            <div className="text-xs text-slate-500 text-center pt-2">
              By signing in you agree to our <a className="text-amber-600 hover:underline" href="#">Terms</a>.
            </div>
          </form>
        </section>

        <section className="mt-6 text-center text-sm text-slate-600">
          <div>Don't have an account? <a href="#" className="text-amber-600 hover:underline">Create one</a></div>

          <div className="mt-4 bg-white rounded-lg shadow p-4 text-left text-xs text-slate-500">
            <div className="font-semibold text-slate-700">Notes</div>
            <ol className="list-decimal ml-5 mt-2 space-y-1">
              <li>This layout mirrors the Live Rudra Counter: calm amber palette, rounded cards, and a centered max-width container.</li>
              <li>For production, implement proper auth: rate limits, CSRF protection, secure cookies, and server-side validation.</li>
            </ol>
          </div>
        </section>
      </main>
    </div>
  );
}
