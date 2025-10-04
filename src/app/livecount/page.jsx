// app/livecount/page.jsx
"use client";

import React, { useEffect, useState, useRef } from "react";

export default function LiveCountPage() {
  const [chanterCount, setNumChanters] = useState(0);
  const [rudraCount, setRudraCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);
  const [chantingInProgress, setChantingInProgress] = useState(true);
  const intervalRef = useRef(null);
  const POLL_MS = 2000;
  const timerValue = 60
  const eventDate = new Date("October 10, 2025")
  const [now, setNow] = useState(new Date());
  // useEffect(() => {
  //   const t = setInterval(() => setNow(new Date()), 1000);
  //   return () => clearInterval(t);
  // }, []);

  // useEffect(() => {
  //   // initial fetch
  //   // poll loop
  //   intervalRef.current = setInterval(fetchChanters, POLL_MS);
  //   return () => clearInterval(intervalRef.current);
  // }, []);

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
          <p className="mt-2 text-slate-600">View current number of chanters in the session and the current Rudra count</p>
        </header>

        <section className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-sm text-slate-500">{chantingInProgress ? "Chanting is in progress" : "Chanting on break for " + timerValue + "s"}</div>

          <div className="mt-6">
            <div className="inline-flex items-baseline gap-3">
              <div className="text-6xl font-extrabold text-amber-600">
                {loading ? "—" : chanterCount ?? 0}
              </div>
              <div className="text-sm text-slate-500">chanters</div>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={handleJoin}
              className={`px-6 py-2 rounded-lg font-medium ${(joined || chantingInProgress) ? "bg-amber-300 text-white cursor-default" : "bg-amber-600 text-white hover:bg-amber-700"}`}
              disabled={joined || chantingInProgress}
            >
              {joined ? "You are connected" : "Join Rudra"}
            </button>

            <button
              onClick={handleLeave}
              className={`px-6 py-2 rounded-lg border ${(chantingInProgress) ? "border-amber-300 text-amber-300 cursor-default" : "border-amber-600 text-amber-600 hover:bg-amber-50"}`}
              disabled={!joined || chantingInProgress}
            >
              Leave
            </button>
          </div>
        </section>
        <br style={{ marginBottom: 8 }} />
        <div className="text-sm text-slate-500 text-center">Please note that you may only leave or join the session once the current session is over.</div>
        <br style={{ marginBottom: 8 }} />
        <section className="bg-white bg-center rounded-lg shadow p-6">
          <div className="mt-6 flex justify-center gap-2">
            <div className="p-3 bg-amber-50 rounded text-center">
              <div className="text-2xl font-semibold">{rudraCount}</div>
              <div className="text-xs text-slate-500">Rudras Chanted</div>
            </div>
            <div className="p-3 bg-amber-50 rounded text-center">
              <div className="text-2xl font-semibold">09:12</div>
              <div className="text-xs text-slate-500">Current Session Elapsed Time</div>
            </div>
            <div className="p-3 bg-amber-50 rounded text-center">
              <div className="text-2xl font-semibold">{1331 - rudraCount}</div>
              <div className="text-xs text-slate-500">Rudras remaining</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}