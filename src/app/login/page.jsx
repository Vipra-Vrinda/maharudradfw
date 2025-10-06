"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { signInWithEmailAndPassword} from "firebase/auth";
import { ref, set } from "firebase/database";

export default function LoginPage() {
  const { user, loading, uid } = useAuth();
  const [username, setUsername] = useState("");
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
    if (!username) return "Please enter your username.";
    if (!password) return "Please enter your password.";
    return "";
  }

  async function registerSession(userCredential) {
    const sessionId = crypto.randomUUID();
    await set(ref(db, `sessions/${userCredential.user.uid}/sessionId`), sessionId);
    localStorage.setItem("sessionId", sessionId); // store locally to validate later
    return sessionId;
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
    signInWithEmailAndPassword(auth, username + "@maharudradfw.org", password + "Gotra")
      .then(userCredential => {
        // Signed in 
        setSuccess(true);
        // ...
        registerSession(userCredential);
        router.push("/livecount"); // redirect to livecount
      })
      .catch((error) => {
        setError("Incorrect Login Credentials. Refer to registration desk for correct spellings of gotras. If issues persist, please contact technical support team.");
      });
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
                onChange={(e) => setUsername(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
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
