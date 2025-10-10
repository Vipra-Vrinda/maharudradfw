"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const { user, loading, uid } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/livecount");
    }
  }, [user, loading, router]);

  function validate() {
    if (!phone) return "Please enter your phone number.";
    if (!password) return "Please enter your password.";
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

    // validate with firebase Auth, if success, set loading to false, and redirect
    signInWithEmailAndPassword(auth, phone + "@maharudradfw.org", password + "Gotra")
      .then(async () => {
        // Signed in 
        setSuccess(true);
        router.push("/livecount"); // redirect to livecount
      })
      .catch(() => {
        setError("Incorrect Login Credentials. Refer to registration desk for the password. If issues persist, please contact the technical support team.");
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-slate-900 p-6 flex items-center justify-center">
      <main className="w-full max-w-md">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Sign in to Maharudra</h1>
          <p className="mt-2 text-slate-600 text-sm">Access your Mahārudra chanting dashboard to join the live rudra session.</p>
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
                Phone # used to register for MahaRudra
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="Enter phone number (digits only)"
                autoComplete="tel"
                inputMode="numeric"
                pattern="[0-9]*"
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
                placeholder="Password (given by registration)"
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
