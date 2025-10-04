"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const gotra = "rishi";
  const users = {
    "brahmana": gotra
  }

  function validate() {
    if (!username) return "Please enter your username.";
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
      // validate with firebase Auth
      if (users[username] != password) {
        throw new Error("Login details are not correct. Please refer to registration desk for the correct spelling of gotras. If login issues persist, please find a member of the technical support team (Ravi Balasubramanya or Aaditya Murthy).");
      }
      setSuccess("Logged in");
      // redirect or update app state as needed
      router.push("/livecount"); // redirect to livecount
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
          <h1 className="text-3xl font-bold">Sign in to MahaRudra</h1>
          <p className="mt-2 text-slate-600 text-sm">Access your Mahā Rudra chanting experience to join live rudra.</p>
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
                Username
              </label>
              <input
                id="username"
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value + "@maharudradfw.org")}
                className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="Last name and first initial (Eg: kashyaps)"
                autoComplete="username"
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
                onChange={(e) => setPassword(e.target.value + "Gotra1010")}
                className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="Enter your gotra here (first letter capital)"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-lg font-medium text-white ${loading ? "bg-amber-300 cursor-wait" : "bg-amber-600 hover:bg-amber-700"}`}>
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
