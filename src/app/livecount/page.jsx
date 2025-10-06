// app/livecount/page.jsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ref, onValue, runTransaction, set } from "firebase/database";
import { db } from "@/lib/firebase"; // your initialized Firebase app


export default function LiveCountPage() {
  const { user, loading } = useAuth();
  const [chanterCount, setNumChanters] = useState(0);
  const [rudraCount, setRudraCount] = useState(2);
  const [breakTimer, setBreakTimer] = useState(0);
  const [chanterCountLoading, setChanterCountLoading] = useState(false);
  const [rudraCountLoading, setRudraCountLoading] = useState(false);
  const [leaveEnabled, enableLeave] = useState(false);
  const [joined, setJoined] = useState(false);
  const [chantingInProgress, setChantingInProgress] = useState(false);
  const router = useRouter();
  const intervalRef = useRef(null);
  const BREAK_TIME = 45;
  const POLL_MS = 2000;
  const MASTER_UIDS = [
    "DmxX6SWOSBP9Y1kKvZWu15KcNTt2",
  ]
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const rudraRef = ref(db, "counters/rudraCount");
    const chanterRef = ref(db, "counters/chanterCount");
    const breakRef = ref(db, "breakTimer");
    const chantingInProgressRef = ref(db, "chanting");
    const leaveEnabledRef = ref(db, "sessions/" + user.uid + "/leaveEnabled");
    const joinedRef = ref(db, "sessions/" + user.uid + "/joined");

    // Listen for changes
    const unsubscribeRudra = onValue(rudraRef, (snapshot) => {
      setRudraCount(snapshot.val() || 0);
    });

    const unsubscribeChanter = onValue(chanterRef, (snapshot) => {
      setNumChanters(snapshot.val() || 0);
    });

    const unsubscribeBreak = onValue(breakRef, (snapshot) => {
      setBreakTimer(snapshot.val() || 0);
    });

    const unsubscribeChanting = onValue(chantingInProgressRef, (snapshot) => {
      setChantingInProgress(snapshot.val() || false);
    });

    const unsubscribeLeave = onValue(leaveEnabledRef, (snapshot) => {
      enableLeave(snapshot.val() || false);
    });

    const unsubscribeJoined = onValue(joinedRef, (snapshot) => {
      setJoined(snapshot.val() || false);
    });

    return () => {
      unsubscribeRudra();
      unsubscribeChanter();
      unsubscribeBreak();
      unsubscribeChanting();
      unsubscribeLeave();
      unsubscribeJoined();
    };
  }, []);

  const joinRudra = async () => {
    if (joined) return;
    setJoined(true);
    const chanterRef = ref(db, "counters/chanterCount");
    const joinedRef = ref(db, "sessions/" + user.uid + "/joined");
    try {
      await runTransaction(joinedRef, () => {
        return true; // increment
      });

      await runTransaction(chanterRef, (currentValue) => {
        return (currentValue || 0) + 1; // increment
      });
    } catch (err) {
      console.error("Failed to increment count:", err);
    }
  }

  const leaveRudra = async () => {
    if (!joined || !leaveEnabled) return;
    const joinedRef = ref(db, `sessions/${user.uid}/sessionId`);
    const chanterRef = ref(db, "counters/chanterCount");
    try {
      await runTransaction(chanterRef, () => {
        return false; // increment
      });
      await runTransaction(chanterRef, (currentValue) => {
        return (currentValue || 0) - 1; // decrement
      });
    } catch (err) {
      console.error("Failed to increment count:", err);
    }
  }

  const chantingSwitch = async () => {
    if (!MASTER_UIDS.includes(uid)) {
      return;
    }
    const chantingRef = ref(db, "chanting");
    const rudraRef = ref(db, "counters/rudraCount");
    try {
      if (chantingInProgress) {
        await runTransaction(rudraRef, (currentValue) => {
          return currentValue + chanterCount;
        })
      }
      await runTransaction(chantingRef, (currentValue) => {
        return !currentValue; // flip
      });
    } catch (err) {
      console.error("Failed to start/stop chanting", err);
    }
  }

  const startBreak = async () => {
    if (!MASTER_UIDS.includes(user.uid)) {
      return;
    }
    const breakRef = ref(db, "breakTimer");
    try {
      await set(breakRef, 45);

      const interval = setInterval(async () => {
        await runTransaction(breakRef, (currentValue) => {
          if (currentValue > 0) {
            return currentValue - 1; // decrement
          } else {
            clearInterval(interval); // stop timer
            return 0;
          }
        });
      }, 1000);
    } catch (err) {
      console.error("Failed to start break timer", err);
    }
  }
  if (loading) return <p>Loading...</p>;
  if (!user) return null; // temporarily render nothing while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-slate-900 p-6">
      <main className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold">Live Rudra Counter</h1>
          <p className="mt-2 text-slate-600">For the best chanting experience, we recommend putting your phone on Do Not Disturb and turning off all notifications. Closing this tab while staying signed in will not disconnect you from the live 
            rudra.
          </p>
        </header>

        <section className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-sm text-slate-500">{chantingInProgress ? "Chanting is in progress" : breakTimer ? "Chanting on break for " + breakTimer + "s" : "Chanting on break"}</div>

          <div className="mt-6">
            <div className="inline-flex items-baseline gap-3">
              <div className="text-6xl font-extrabold text-amber-600">
                {chanterCountLoading ? "—" : chanterCount ?? 0}
              </div>
              <div className="text-sm text-slate-500">chanters</div>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={joinRudra}
              className={`px-6 py-2 rounded-lg font-medium ${(joined || chantingInProgress) ? "bg-amber-300 text-white cursor-default" : "bg-amber-600 text-white hover:bg-amber-700"}`}
              disabled={joined || chantingInProgress}
            >
              {joined ? "You are connected" : "Join Rudra"}
            </button>
            {leaveEnabled ? (
            <button
              onClick={leaveRudra}
              className={`px-6 py-2 rounded-lg border ${(chantingInProgress) ? "border-amber-300 text-amber-300 cursor-default" : "border-amber-600 text-amber-600 hover:bg-amber-50"}`}
              disabled={!joined || chantingInProgress}
            >
              Leave
            </button>) : <></>}
          </div>
        </section>
        <br style={{ marginBottom: 8 }} />
        <div className="text-sm text-slate-500 text-center">Please contact a member of the technical support team (Ravi Balasubramanya or Aaditya Murthy) if a break is required.</div>
        <br style={{ marginBottom: 8 }} />
        <section className="bg-white bg-center rounded-lg shadow p-6">
          <div className="mt-6 flex justify-center gap-2">
            <div className="p-3 bg-amber-50 rounded text-center">
              <div className="text-2xl font-semibold">{rudraCountLoading ? "-" : rudraCount ?? 0}</div>
              <div className="text-xs text-slate-500">Rudras Chanted</div>
            </div>
            <div className="p-3 bg-amber-50 rounded text-center">
              <div className="text-2xl font-semibold">09:12</div>
              <div className="text-xs text-slate-500">Ekadasha Parayana Elapsed Time</div>
            </div>
            <div className="p-3 bg-amber-50 rounded text-center">
              <div className="text-2xl font-semibold">{1331 - rudraCount}</div>
              <div className="text-xs text-slate-500">Rudras remaining</div>
            </div>
            <div className="p-3 bg-amber-50 rounded text-center">
              <div className="text-2xl font-semibold">{rudraCount ? "-" : "-"}</div>
              <div className="text-xs text-slate-500">Previous Rudra Duration</div>
            </div>
          </div>
        </section>
        <br style={{ marginBottom: 8 }} />
        {MASTER_UIDS.includes(user.uid) ? (
          <section className="bg-white bg-center rounded-lg shadow p-6 text-center">
            <h3>Chanting Controls</h3>
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={chantingSwitch}
                className="px-6 py-2 rounded-lg font-medium bg-amber-600 text-white hover:bg-amber-700"
              >
                Start/Stop Chanting
              </button>
              <button
                onClick={startBreak}
                className="px-6 py-2 rounded-lg font-medium bg-amber-600 text-white hover:bg-amber-700"
                disabled={chantingInProgress}
              >
                Start Break Timer
              </button>
            </div>
          </section>) : <></>}
        {MASTER_UIDS.includes(user.uid) ? (<br style={{ marginBottom: 8 }} />) : <></>}
        {MASTER_UIDS.includes(user.uid) ? (
          <section className="bg-white bg-center rounded-lg shadow p-6 text-center">
            <h3>Leave Controls</h3>
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={chantingSwitch}
                className="px-6 py-2 rounded-lg font-medium bg-amber-600 text-white hover:bg-amber-700"
              >
                Start/Stop Chanting
              </button>
              <button
                onClick={startBreak}
                className="px-6 py-2 rounded-lg font-medium bg-amber-600 text-white hover:bg-amber-700"
                disabled={chantingInProgress}
              >
                Start Break Timer
              </button>
            </div>
          </section>) : <></>}
        {MASTER_UIDS.includes(user.uid) ? (<br style={{ marginBottom: 8 }} />) : <></>}
        <div className="flex justify-center">
          <button
            onClick={() => { router.push("/") }}
            className="px-6 py-2 rounded-lg font-medium bg-amber-600 text-white hover:bg-amber-700 "
          >Back to MahaRudra Dashboard</button>
        </div>
      </main>
    </div>
  );
}