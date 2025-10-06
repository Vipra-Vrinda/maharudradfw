// app/livecount/page.jsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ref, onValue, runTransaction, set, get } from "firebase/database";
import { db } from "@/lib/firebase"; // your initialized Firebase app


export default function LiveCountPage() {
  const { user, loading } = useAuth();
  const [chanterCount, setNumChanters] = useState(0);
  const [rudraCount, setRudraCount] = useState(2);
  const [breakTimer, setBreakTimer] = useState(0);
  const [scheduledBreaks, setScheduledBreaks] = useState(0);
  const [chanterCountLoading, setChanterCountLoading] = useState(false);
  const [rudraCountLoading, setRudraCountLoading] = useState(false);
  const [leaveEnabled, enableLeave] = useState(false);
  const [joined, setJoined] = useState(false);
  const [chantingInProgress, setChantingInProgress] = useState(false);
  const [sessions, setSessions] = useState({});
  const router = useRouter();
  const intervalRef = useRef(null);
  const BREAK_TIME = 45;
  const POLL_MS = 2000;
  const MASTER_UIDS = [
    "DmxX6SWOSBP9Y1kKvZWu15KcNTt2",
  ]
  const USER_NAMES = {
    OXSK1l4Nu0dGAN2cp9cZeQNrlwJ3: "Brahmana Murthy",
    DmxX6SWOSBP9Y1kKvZWu15KcNTt2: "Aaditya Murthy"
  }
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !MASTER_UIDS.includes(user.uid)) {
      return;
    }
    const sessionsRef = ref(db, "sessions");
    const breakRef = ref(db, "scheduledBreaks");
    const unsubscribeSessions = onValue(sessionsRef, (snapshot) => {
      if (snapshot.exists()) {
        setSessions(snapshot.val());
      } else {
        setSessions({});
      }
    });
    const unsubscribeBreaks = onValue(breakRef, (snapshot) => {
      if (snapshot.exists()) {
        setScheduledBreaks(snapshot.val());
      } else {
        setScheduledBreaks({});
      }
    });

    // cleanup
    return () => {
      unsubscribeSessions();
      unsubscribeBreaks();
    }
  }, [user]);

  useEffect(() => {
    const rudraRef = ref(db, "counters/rudraCount");
    const chanterRef = ref(db, "counters/chanterCount");
    const breakRef = ref(db, "breakTimer");
    const chantingInProgressRef = ref(db, "chanting");

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

    return () => {
      unsubscribeRudra();
      unsubscribeChanter();
      unsubscribeBreak();
      unsubscribeChanting();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const joinedRef = ref(db, `sessions/${user.uid}/joined`);
    const leaveEnabledRef = ref(db, `sessions/${user.uid}/leaveEnabled`);

    const unsubscribeLeave = onValue(leaveEnabledRef, (snapshot) => {
      enableLeave(snapshot.exists() ? snapshot.val() : false);
    });

    const unsubscribeJoined = onValue(joinedRef, (snapshot) => {
      setJoined(snapshot.exists() ? snapshot.val() : false);
    });

    // attach listeners here...
    return () => {
      unsubscribeLeave();
      unsubscribeJoined();
    };
  }, [user]);

  const joinRudra = async () => {
    if (joined) return;
    const chanterRef = ref(db, "counters/chanterCount");
    const joinedRef = ref(db, `sessions/${user.uid}/joined`);
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
    const joinedRef = ref(db, `sessions/${user.uid}/joined`);
    const leaveEnabledRef = ref(db, `sessions/${user.uid}/leaveEnabled`);
    const chanterRef = ref(db, "counters/chanterCount");
    try {
      await runTransaction(joinedRef, () => {
        return false; // increment
      });
      await runTransaction(chanterRef, (currentValue) => {
        return (currentValue || 0) - 1; // decrement
      });
      await runTransaction(leaveEnabledRef, (currentValue) => {
        return false; // leave disabled
      });
    } catch (err) {
      console.error("Failed to increment count:", err);
    }
  }

  const chantingSwitch = async () => {
    if (!MASTER_UIDS.includes(user.uid)) {
      return;
    }
    const chantingRef = ref(db, "chanting");
    const rudraRef = ref(db, "counters/rudraCount");
    const scheduledBreaksRef = ref(db, `scheduledBreaks`);
    try {
      if (chantingInProgress) {
        await runTransaction(rudraRef, (currentValue) => {
          return currentValue + chanterCount;
        });
        await set(scheduledBreaksRef, 0);
      }
      await runTransaction(chantingRef, (currentValue) => {
        return !currentValue; // flip
      });
    } catch (err) {
      console.error("Failed to start/stop chanting", err);
    }
  }

  const triggerEnableLeave = async (uid) => {
    if (!MASTER_UIDS.includes(user.uid) || !chantingInProgress) {
      return;
    }
    const enableLeaveRef = ref(db, `sessions/${uid}/leaveEnabled`);
    const scheduledBreaksRef = ref(db, `scheduledBreaks`);
    try {
      const enabledLeave = await get(enableLeaveRef);
      if (!enabledLeave.exists() || !enabledLeave.val()) {
        await set(enableLeaveRef, true);
        await runTransaction(scheduledBreaksRef, (currentValue) => {
          return currentValue + 1; // increment
        });
      }
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
          <h1 className="text-4xl font-bold">Namaskara, {USER_NAMES[user.uid]}</h1>
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
        {leaveEnabled ? (
          <section className="bg-white rounded-lg shadow p-8 text-left">
            <div className="text-sm text-slate-500 underline text-center">Etiquette</div>
            <ol className="text-sm text-slate-500 list-decimal pl-5">
              <li>Breaks are granted on a case-by-case basis. Please do not misuse it.</li>
              <li>Once the current round of rudra stops, a 45s break timer will start. You must click the leave button within this time.</li>
              <li>Once you have finished your break, you must re-click the join button when that round of rudra finishes and the 45s break timer starts.</li>
              <li>After leaving, the leave option will disappear. Any future breaks will require another approval from a moderator</li>
            </ol>
          </section>)
          : (<div className="text-sm text-slate-500 text-center">Please contact Ravi Balasubramanya or Aaditya Murthy well before the current rudra ends if a break is required.</div>)}
        <br style={{ marginBottom: 8 }} />
        <section className="bg-white bg-center rounded-lg shadow p-6">
          <div className="mt-6 flex justify-center gap-2">
            <div className="p-3 bg-amber-50 rounded text-center">
              <div className="text-2xl font-semibold">{rudraCountLoading ? "-" : rudraCount ?? 0}</div>
              <div className="text-xs text-slate-500">Rudras Chanted</div>
            </div>
            <div className="p-3 bg-amber-50 rounded text-center">
              <div className="text-2xl font-semibold">-</div>
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
            <h2>Scheduled Breaks: {scheduledBreaks}</h2>
            <ul>
              {Object.entries(sessions).map(([uid, session]) =>
                "joined" in session && session.joined ? (
                  <li key={uid}>
                    <div className="mt-6 flex justify-center gap-2">
                      <button
                        onClick={() => triggerEnableLeave(uid)}
                        className="px-6 py-2 rounded-lg font-medium bg-amber-600 text-white hover:bg-amber-700"
                      >
                        Enable leave for {USER_NAMES[uid]}
                      </button>
                      <div class="flex items-center gap-2">
                        {("leaveEnabled" in session && session.leaveEnabled) ? <span className="h-3 w-3 rounded-full bg-green-500"></span> : <span class="h-3 w-3 rounded-full bg-red-500"></span>}
                      </div>
                    </div>
                  </li>
                ) : null
              )}
            </ul>
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