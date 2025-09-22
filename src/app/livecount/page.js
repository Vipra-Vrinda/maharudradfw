// app/livecount/page.jsx
"use client";

import React, { useEffect, useState, useRef } from "react";

export default function LiveCountPage() {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const intervalRef = useRef(null);
  const POLL_MS = 2000;

  async function fetchCount() {
    try {
      const res = await fetch("/api/livecount");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCount(data.count ?? 0);
      setLoading(false);
    } catch (e) {
      console.error("fetchCount error", e);
      setLoading(false);
    }
  }

  async function updateCount(delta) {
    try {
      const res = await fetch("/api/livecount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delta }),
      });
      if (!res.ok) throw new Error("update failed");
      const data = await res.json();
      setCount(data.count);
    } catch (e) {
      console.error("updateCount error", e);
    }
  }

  useEffect(() => {
    // initial fetch
    fetchCount();

    // poll loop
    intervalRef.current = setInterval(fetchCount, POLL_MS);
    return () => clearInterval(intervalRef.current);
  }, []);

  function handleJoin() {
    if (joined) return;
    setJoined(true);
    updateCount(1);
  }

  function handleLeave() {
    if (!joined) return;
    setJoined(false);
    updateCount(-1);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-slate-900 p-6">
      <main className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold">Live Rudra Counter</h1>
          <p className="mt-2 text-slate-600">See how many devotees are connected to the Mahā Rudra right now.</p>
        </header>

        <section className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-sm text-slate-500">Current connected devotees</div>

          <div className="mt-6">
            <div className="inline-flex items-baseline gap-3">
              <div className="text-6xl font-extrabold text-amber-600">
                {loading ? "—" : count ?? 0}
              </div>
              <div className="text-sm text-slate-500">devotees</div>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={handleJoin}
              className={`px-6 py-2 rounded-lg font-medium ${joined ? "bg-amber-300 text-white cursor-default" : "bg-amber-600 text-white hover:bg-amber-700"}`}
              disabled={joined}
            >
              {joined ? "You are connected" : "Join Rudra"}
            </button>

            <button
              onClick={handleLeave}
              className="px-6 py-2 rounded-lg border border-amber-600 text-amber-600 hover:bg-amber-50"
              disabled={!joined}
            >
              Leave
            </button>
          </div>

          <div className="mt-6 text-sm text-slate-500">
            This demo uses simple polling. For production use a persistent store (Redis / DB) and push updates via WebSocket / SSE for real-time accuracy.
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">How it works (demo)</h2>
          <ol className="mt-2 list-decimal ml-5 text-sm text-slate-600 space-y-1">
            <li>The page polls <code>/api/livecount</code> every 2 seconds to fetch the current count.</li>
            <li>Click <strong>Join Rudra</strong> to increment; click <strong>Leave</strong> to decrement.</li>
            <li>Server keeps the count in memory (demo only) — use Redis / DB for production.</li>
          </ol>
        </section>
      </main>
    </div>
  );
}