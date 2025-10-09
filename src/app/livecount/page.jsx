// app/livecount/page.jsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ref, onValue, runTransaction, set } from "firebase/database";
import { db } from "@/lib/firebase"; // your initialized Firebase app
import chanters from "@/data/chanters.json";


export default function LiveCountPage() {
  const { user, loading } = useAuth();
  const [chanterCount, setNumChanters] = useState(0);
  const [rudraCount, setRudraCount] = useState(2);
  const [chanterCountLoading, setChanterCountLoading] = useState(true);
  const [rudraCountLoading, setRudraCountLoading] = useState(true);
  const [ekadashaStart, setEkadashaStart] = useState(0);
  const [rudraStart, setRudraStart] = useState(0);
  const [joined, setJoined] = useState(false);
  const [chantingInProgress, setChantingInProgress] = useState(false);
  const [adminMessage, setAdminMessage] = useState("");
  const router = useRouter();
  const POLL_MS = 1000;
  const MASTER_UIDS = [
    "JXG9CSifc2gWRsfkzZInWRgV9fJ3",
  ]
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const { users } = chanters;

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), POLL_MS);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const rudraRef = ref(db, "counters/rudraCount");
    const chanterRef = ref(db, "counters/chanterCount");
    const chantingInProgressRef = ref(db, "chanting");
    const ekadashaRef = ref(db, "timestamps/ekadashaStart");
    const rudraTimeRef = ref(db, "timestamps/rudraStart");


    // Listen for changes
    const unsubscribeRudra = onValue(rudraRef, (snapshot) => {
      setRudraCount(snapshot.val() || 0);
      setRudraCountLoading(false);
    });

    const unsubscribeChanter = onValue(chanterRef, (snapshot) => {
      setNumChanters(snapshot.val() || 0);
      setChanterCountLoading(false);
    });

    const unsubscribeChanting = onValue(chantingInProgressRef, (snapshot) => {
      setChantingInProgress(snapshot.val() || false);
    });

    const unsubscribeEkadasha = onValue(ekadashaRef, (snapshot) => {
      setEkadashaStart(snapshot.val() || 0);
    });

    const unsubscribeRudraStart = onValue(rudraTimeRef, (snapshot) => {
      setRudraStart(snapshot.val() || 0);
    });

    return () => {
      unsubscribeRudra();
      unsubscribeChanter();
      unsubscribeChanting();
      unsubscribeEkadasha();
      unsubscribeRudraStart();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const joinedRef = ref(db, `sessions/${user.uid}/joined`);

    const unsubscribeJoined = onValue(joinedRef, (snapshot) => {
      setJoined(snapshot.exists() ? snapshot.val() : false);
    });

    // attach listeners here...
    return () => {
      unsubscribeJoined();
    };
  }, [user]);

  function ekadashaElapsedTime() {
    const diff = Date.now() - ekadashaStart;
    const secs = Math.floor(diff / 1000);
    const hours = Math.floor((secs % (24 * 3600)) / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return { hours, minutes, seconds };
  }
  const et = ekadashaElapsedTime();

  function rudraElapsedTime() {
    const diff = Date.now() - rudraStart;
    const secs = Math.floor(diff / 1000);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return { minutes, seconds };
  }
  const rt = rudraElapsedTime();

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

  const startChanting = async () => {
    /* TODO: fix race conditions */
    if (!MASTER_UIDS.includes(user.uid) || chantingInProgress) return;
  
    const chantingRef = ref(db, "chanting");
    const ekadashaStartRef = ref(db, "timestamps/ekadashaStart");
    const rudraStartRef = ref(db, "timestamps/rudraStart");
    try {
      const currTime = Date.now();
      await runTransaction(chantingRef, (currentValue) => {  
        if (!currentValue) {
          currentValue = true;
        }
        return currentValue;
      });
      if (!ekadashaStart) await set(ekadashaStartRef, currTime);
      await set(rudraStartRef, currTime);
    } catch (err) {
      console.error("Failed to start chanting", err);
    }
  };

  const stopChanting = async () => {
    if (!MASTER_UIDS.includes(user.uid) || !chantingInProgress) {
      return;
    }
    const chantingRef = ref(db, "chanting");
    const rudraRef = ref(db, "counters/rudraCount");
    try {
      await runTransaction(chantingRef, (currentValue) => {
        // Only stop if currently true
        if (currentValue === true) {
          // safely increment rudra inside the same transaction
          runTransaction(rudraRef, (rudraCount) => {
            return (rudraCount || 0) + chanterCount;
          });
          return false; // set chanting -> false
        }
        return currentValue; // no-op if already stopped
      });
    } catch (err) {
      console.error("Failed to stop chanting", err);
    }
  }

  const resetEkadasha = async () => {
    /* TODO: fix race conditions */
    if (!MASTER_UIDS.includes(user.uid) || chantingInProgress) return;
  
    const ekadashaStartRef = ref(db, "timestamps/ekadashaStart");
    const rudraStartRef = ref(db, "timestamps/rudraStart");
    try {
      await set(ekadashaStartRef, 0);
      await set(rudraStartRef, 0);
    } catch (err) {
      console.error("Failed to start chanting", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return null; // temporarily render nothing while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-slate-900 p-6">
      <main className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold">Namaskara, {users[user.uid]}</h1>
          <p className="mt-2 text-slate-600">For the best chanting experience, we recommend putting your phone on Do Not Disturb and turning off all notifications. Putting your device in airplane mode while keeping WiFi enabled will prolong battery life of your device.
          </p>
          <p className="mt-2 text-slate-600">Closing this tab or even turning off your phone while "joined" in the live rudra will not disconnect you from the session.</p>
        </header>

        <section className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-sm text-slate-500">{!ekadashaStart ? "Ekadasha parayana not started" : chantingInProgress ? "Chanting Namaka" : "Chanting Chamaka"}</div>

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
          </div>
        </section>
        <br style={{ marginBottom: 8 }} />
        <section className="bg-white bg-center rounded-lg shadow p-6">
          <div className="mt-6 flex justify-center gap-2">
            <div className="p-3 bg-amber-50 rounded text-center">
              <div className="text-2xl font-semibold">{rudraCountLoading ? "-" : rudraCount ?? 0}</div>
              <div className="text-xs text-slate-500">Rudras Chanted</div>
            </div>
            <div className="p-3 bg-amber-50 rounded text-center">
              <div className="text-2xl font-semibold">{ekadashaStart ?  `${String(et.hours).padStart(2, "0")}:${String(et.minutes).padStart(2, "0")}:${String(et.seconds).padStart(2, "0")}` : "-"}</div>
              <div className="text-xs text-slate-500">Ekadasha Parayana Elapsed Time</div>
            </div>
            <div className="p-3 bg-amber-50 rounded text-center">
              <div className="text-2xl font-semibold">{1331 - rudraCount}</div>
              <div className="text-xs text-slate-500">Rudras remaining</div>
            </div>
            <div className="p-3 bg-amber-50 rounded text-center">
              <div className="text-2xl font-semibold">{rudraStart ? `${String(rt.minutes).padStart(2, "0")}:${String(rt.seconds).padStart(2, "0")}` : "-"}</div>
              <div className="text-xs text-slate-500">Current Rudra Elapsed Time</div>
            </div>
          </div>
        </section>
        <br style={{ marginBottom: 8 }} />
        {MASTER_UIDS.includes(user.uid) ? (
          <section className="bg-white bg-center rounded-lg shadow p-6 text-center">
            <h3>Chanting Controls</h3>
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={startChanting}
                className="px-6 py-2 rounded-lg font-medium bg-amber-600 text-white hover:bg-amber-700"
              >
                Start Chanting
              </button>
              <button
                onClick={stopChanting}
                className="px-6 py-2 rounded-lg font-medium bg-amber-600 text-white hover:bg-amber-700"
              >
                Stop Chanting
              </button>
              <button
                onClick={resetEkadasha}
                className="px-6 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700"
              >
                Reset Ekadasha
              </button>
            </div>
          </section>) : <></>}
        {MASTER_UIDS.includes(user.uid) ? (<br style={{ marginBottom: 8 }} />) : <></>}
        {/* {MASTER_UIDS.includes(user.uid) ? (
          <section className="bg-white bg-center rounded-lg shadow p-6 text-center">
            <h3>Messaging Controls</h3>
            <textarea
              value={adminMessage}
              onChange={(e) => setAdminMessage(e.target.value)}
              placeholder="Type a message to broadcast..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows={3}
            />

            <button
              onClick={sendBroadcastMessage}
              className="mt-3 px-6 py-2 bg-amber-600 text-white rounded-lg shadow hover:bg-amber-700 transition"
            >
              Send Message
            </button>
          </section>) : <></>}
        {MASTER_UIDS.includes(user.uid) ? (<br style={{ marginBottom: 8 }} />) : <></>} */}
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