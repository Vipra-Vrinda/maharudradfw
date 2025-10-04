"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// MahaRudraEvent.jsx
// Single-file React component (Tailwind CSS required in the host project)
// Usage: drop into a React app, ensure Tailwind is configured.

export default function MahaRudraEvent({
  title = "Mahā Rudra DFW",
  date = "October 10, 2025",
  endDate = "October 11, 2025",
  startTime = "11:30 AM",
  venue = "DFW Hindu Temple, Cultural Hall",
  heroImage = "https://yogaeastwest.com/wp-content/uploads/2024/10/pexels-rajjatbayas-5935662-scaled.jpg.webp",
  youtubeChannelId = "YOUR_CHANNEL_ID",
}) {
  const eventDate = new Date(date + " " + startTime);

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  function countdownParts() {
    const diff = Math.max(0, eventDate - now);
    const secs = Math.floor(diff / 1000);
    const days = Math.floor(secs / (24 * 3600));
    const hours = Math.floor((secs % (24 * 3600)) / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return { days, hours, minutes, seconds };
  }

  const cd = countdownParts();

  const priests = [
    { name: "Subramanya Kashyap", role: "Religious Committee Member" },
    { name: "Nikhil Kashyap", role: "Religious Committee Member" },
    { name: "Ravi Balasubramanya", role: "Religious Committee Member" },
    { name: "Shailendra Upadhye", role: "Religious Committee Member" },
    { name: "Sreenivas Ram", role: "Religious Committee Member" },
    { name: "Aaditya Murthy", role: "Vipra Vrinda Youth Leader" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-slate-900">
      <header className="bg-white/60 backdrop-blur-sm sticky top-0 z-40 shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="https://www.vipravrinda.org">
            <img src="/maharudradfw/favicon.ico" alt="logo" className="w-10 h-10 rounded" />
            </a>
            <div>
              <h1 className="text-lg font-semibold">{title}</h1>
              <p className="text-sm text-slate-600">{date} - {endDate} • {venue}</p>
            </div>
          </div>
          <nav className="flex items-center gap-3">
            <a href="/maharudradfw/livecount" className="ml-2 inline-block rounded-lg bg-amber-600 text-white px-4 py-2 text-sm font-medium">View Live Gayatri Japa Abhiyaana</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <img src={heroImage} alt="maharudra" className="w-full h-128 object-cover rounded-lg shadow-md" />
            </motion.div>

            <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="mt-2 text-slate-700">Join us for a sacred Mahā Rudra ceremony with registered Vipra Vrinda family members.</p>

              <div className="mt-4 flex flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <strong className="text-sm">When:</strong>
                  <span className="text-sm text-slate-600">{date} - {endDate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <strong className="text-sm">Where:</strong>
                  <span className="text-sm text-slate-600">{venue}</span>
                </div>
              </div>

              {/* Countdown */}
              <div className="mt-6 grid grid-cols-4 sm:grid-cols-8 gap-2">
                <div className="p-3 bg-amber-50 rounded text-center">
                  <div className="text-2xl font-semibold">{cd.days}</div>
                  <div className="text-xs text-slate-500">Days</div>
                </div>
                <div className="p-3 bg-amber-50 rounded text-center">
                  <div className="text-2xl font-semibold">{cd.hours}</div>
                  <div className="text-xs text-slate-500">Hours</div>
                </div>
                <div className="p-3 bg-amber-50 rounded text-center">
                  <div className="text-2xl font-semibold">{cd.minutes}</div>
                  <div className="text-xs text-slate-500">Minutes</div>
                </div>
                <div className="p-3 bg-amber-50 rounded text-center">
                  <div className="text-2xl font-semibold">{cd.seconds}</div>
                  <div className="text-xs text-slate-500">Seconds</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column cards */}
          <aside className="space-y-4">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h3 className="font-semibold">Quick Info</h3>
              <ul className="mt-2 text-sm text-slate-600 space-y-1">
                <li><strong>Ganesh Puja:</strong> 11:30 AM</li>
                <li><strong>Contact:</strong> vipravrindadallas@gmail.com </li>
              </ul>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h3 className="font-semibold">Volunteers</h3>
              <ul className="mt-2 text-sm text-slate-600 space-y-2">
                {priests.map((s) => (
                  <li key={s.name} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold">{s.name.split(" ")[0][0]}</div>
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-slate-500">{s.role}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </section>

        {/* Footer */}
        <footer className="mt-12 py-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} {title} • Built with 𓉸𓆘 and devotion by the MahaRudra Religious Committee
        </footer>
      </main>
    </div>
  );
}
