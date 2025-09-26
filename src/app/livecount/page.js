// app/livecount/page.jsx
"use client";

import React, { useEffect, useState, useRef } from "react";

export default function LiveCountPage() {

  const [count, setCount] = useState(0);
  useEffect(() => {
    const fetchCount = () => {
      fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vT-GCf93D3maBXXSCzDzaXuGcBKupw0Scr2tbRQfnNAgbY-tFk2dN1m7sh-d_7o07NtCDo0o9NakYhL/pub?gid=0&single=true&output=csv")
        .then((res) => res.text())
        .then((csv) => {
          const rows = csv.split("\n").map(r => r.split(","));
          const d1 = rows[0][2]; // row 1 (0-based), col D (index 3)
          if (d1) {
            setCount(Number(d1));
          }
        })
        .catch((err) => console.error("Error fetching sheet:", err));
    };

    // initial fetch
    fetchCount();

    // auto-refresh every 30 seconds
    const interval = setInterval(fetchCount, 30000);

    // cleanup when component unmounts
    return () => clearInterval(interval);
  }, []);

  const chanters = 36;
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const eventDate = new Date("October 10, 2025" + " " + "11:30 AM")
  function daysRemaining() {
    const diff = Math.max(0, eventDate - now);
    const secs = Math.floor(diff / 1000);
    const days = Math.floor(secs / (24 * 3600));
    return days
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-slate-900 p-6">
      <main className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-2xl">ವಿಪ್ರವೃಂದ ಮಹಾರುದ್ರಯಜ್ಞ ಲಕ್ಷಗಾಯತ್ರೀಜಪ</h1>
          <p className="mt-2 text-slate-600"></p>
        </header>

        <section className="bg-[url('../../public/images/gayatri.jpg')] bg-cover bg-center rounded-lg shadow p-8 w-full h-[750px] md:h-[1104px] text-center flex flex-col justify-end">
          <div className="mt-6 rounded-lg bg-amber-100 p-6 shadow-sm text-center">
            {/* Japa Count */}
            <div className="mt-6 flex justify-center gap-2">
              <div className="p-3 bg-amber-50 rounded text-center">
                <div className="text-2xl font-semibold text-amber-600">{count}</div>
                <div className="text-xs text-slate-500">Japa Completed</div>
              </div>
              <div className="p-3 bg-amber-50 rounded">
                <div className="text-2xl font-semibold text-red-500">{daysRemaining()}</div>
                <div className="text-xs text-slate-500">Days Remaining</div>
              </div>
              <div className="p-3 bg-amber-50 rounded">
                <div className="text-2xl font-semibold text-red-500">{100000 - count}</div>
                <div className="text-xs text-slate-500">Japa Remaining</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}