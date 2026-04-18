"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import schedule1 from "@/data/day1_schedule.json"
import schedule2 from "@/data/day2_schedule.json"
import pv from "@/data/priests_volunteers.json"
import tls from "@/data/testimonials.json"

// MahaRudraEvent.jsx
// Single-file React component (Tailwind CSS required in the host project)
// Usage: drop into a React app, ensure Tailwind is configured.

export default function MahaRudraEvent({
  title = "Mahārudra Yajña",
  date = "October 10, 2025",
  endDate = "October 11, 2025",
  startTime = "11:30 AM",
  venue = "DFW Hindu Temple, Cultural Hall",
  heroImage = "https://yogaeastwest.com/wp-content/uploads/2024/10/pexels-rajjatbayas-5935662-scaled.jpg.webp",
  youtubeChannelId = "UCNhX3E23NrZ2pOfFYdWP_Vg",
}) {
  const { day1_schedule } = schedule1;
  const { day2_schedule } = schedule2;
  const { priests } = pv;
  const { testimonials } = tls;
  const eventDate = new Date(date + " " + startTime);

  const [isFirefox, setIsFirefox] = useState(false);
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsFirefox(navigator.userAgent.toLowerCase().includes('firefox'));
    }
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);

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
          <nav className="hidden sm:flex items-center gap-3">
            <a href="#about" className="text-sm hover:underline">About</a>
            <a href="#highlights" className="text-sm hover:underline">Highlights</a>
            <a href="#schedule" className="text-sm hover:underline">Schedule</a>
            <a href="/maharudradfw/digitalad" className="text-sm hover:underline">Sponsors</a>
            {/* <a href="#testimonials" className="text-sm hover:underline">Testimonials</a> */}
            <a
              href="/maharudradfw/dashboard"
              className="ml-2 inline-block rounded-lg bg-amber-600 text-white px-4 py-2 text-sm font-medium"
            >
              View Chanter's Dashboard
            </a>
          </nav>

          <button
            className="sm:hidden inline-flex items-center p-2 rounded-md text-slate-700 hover:bg-slate-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="sm:hidden bg-white/95 backdrop-blur-sm shadow-md">
            <nav className="flex flex-col gap-3 px-4 py-3">
              <a href="#about" className="text-sm hover:underline">About</a>
              <a href="#highlights" className="text-sm hover:underline">Highlights</a>
              <a href="#schedule" className="text-sm hover:underline">Schedule</a>
              {/* <a href="#testimonials" className="text-sm hover:underline">Testimonials</a> */}
              <a
                href="/maharudradfw/dashboard"
                className="inline-block self-start rounded-lg bg-amber-600 text-white px-4 py-2 text-sm font-medium"
              >
                View Chanter's Dashboard
              </a>
            </nav>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center" id="about">
          <div className="md:col-span-2">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <img src={heroImage} alt="maharudra" className="w-full h-128 object-cover rounded-lg shadow-md" />
            </motion.div>

            <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="mt-2 text-slate-700">Join us for a sacred Mahārudra Yajña with registered Vipra Vrinda family members.</p>

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
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-amber-50 p-4 rounded-lg text-center shadow-sm">
                <div className="col-span-full">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="inline-flex rounded-full h-3 w-3 bg-green-500 opacity-80 animate-pulse"></span>
                    <span className="text-sm font-semibold text-green-700 uppercase tracking-wide">
                      MahaRudra 2025 Completed Successfully
                    </span>
                  </div>
                  <div className="text-slate-700 text-sm">
                    🙏 Heartfelt gratitude to all the priests, volunteers, chanters, and vipras who made this divine event a grand success.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column cards */}
          <aside className="space-y-4">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h3 className="font-semibold">Program Start Time</h3>
              <ul className="mt-2 text-sm text-slate-600 space-y-1">
                <li>Friday October 10 @ 11:30 AM</li>
                <li>Saturday October 11 @ 7:00 AM</li>
              </ul>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h3 className="font-semibold">Priests & Volunteers</h3>
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
        <br style={{ marginBottom: 8 }} />
        <h2 className="text-xl font-semibold">Highlights</h2>
        <br style={{ marginBottom: 8 }} />
        <section
          id="highlights"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center"
        >
          <div className="md:col-span-2">

            <div className="w-full flex justify-center">
              <div className="relative w-full md:w-191/192 pb-[56.25%] rounded-xl shadow-lg overflow-hidden">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/I3mS61zMysU?si=rll4wMVk-0kQKv1n"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>
        <br style={{ marginBottom: 8 }} />

        {/* Schedule */}
        <section id="schedule" className="mt-12">
          <h2 className="text-xl font-semibold">Schedule</h2>
          <br style={{ marginBottom: 8 }} />
          <h3 className="text-l">Day 1</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {day1_schedule.map((s) => (
              <div key={s.time} className="rounded-lg bg-white p-4 shadow-sm">
                <div className="text-xs text-slate-500">{s.time}</div>
                <div className="font-medium mt-1">{s.title}</div>
              </div>
            ))}
          </div>
          <br style={{ marginBottom: 8 }} />
          <h3 className="text-l">Day 2</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {day2_schedule.map((s) => (
              <div key={s.time} className="rounded-lg bg-white p-4 shadow-sm">
                <div className="text-xs text-slate-500">{s.time}</div>
                <div className="font-medium mt-1">{s.title}</div>
              </div>
            ))}
          </div>
        </section>
        <br style={{ marginBottom: 8 }} />
        {/* <section id="testimonials" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <h2 className="text-xl font-semibold">Testimonials</h2>
          <br style={{ marginBottom: 8 }} />
          {testimonials.map((t, index) => (<div key={index} className={`rounded-lg bg-white p-6 shadow-md text-center
          ${testimonials.length % 2 === 1 && index === testimonials.length - 1
              ? "md:col-span-2 md:justify-self-center"
              : ""
            }
          `}>
            <p className="italic text-gray-700">"{t.text}"</p>
            <p className="mt-2 text-sm text-slate-500 font-medium">— {t.name}, {t.role}</p>
          </div>))}
        </section> */}

        {/* Footer */}
        <footer className="mt-12 py-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} {title} • Built with 𓉸𓆘 and devotion by the Mahārudra Yajña Religious Committee
        </footer>
      </main>
    </div>
  );
}