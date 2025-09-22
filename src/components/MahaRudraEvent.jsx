"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// MahaRudraEvent.jsx
// Single-file React component (Tailwind CSS required in the host project)
// Usage: drop into a React app, ensure Tailwind is configured.

export default function MahaRudraEvent({
  title = "Mahā Rudra Kṣetra — MahaRudra",
  date = "December 12, 2025",
  startTime = "6:00 PM",
  endTime = "9:30 PM",
  venue = "Sri Sai Temple, Main Hall",
  heroImage = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=80",
  youtubeChannelId = "YOUR_CHANNEL_ID",
  donationUrl = "https://www.payments.example/donate",
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

  // Sample schedule and performers — edit as needed
  const schedule = [
    { time: "6:00 PM", title: "Prārthanā & Śodhana" },
    { time: "6:30 PM", title: "Rudra Abhishekam — Part I" },
    { time: "7:15 PM", title: "Mahā Rudra Chanting" },
    { time: "8:00 PM", title: "Rudra Abhishekam — Part II" },
    { time: "8:45 PM", title: "Bhajans & Aarti" },
  ];

  const speakers = [
    { name: "Pujya Shri Ananda", role: "Lead Priest" },
    { name: "Dr. Lalita Sharma", role: "Veda Scholar" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-slate-900">
      <header className="bg-white/60 backdrop-blur-sm sticky top-0 z-40 shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/favicon.ico" alt="logo" className="w-10 h-10 rounded" />
            <div>
              <h1 className="text-lg font-semibold">{title}</h1>
              <p className="text-sm text-slate-600">{date} • {venue}</p>
            </div>
          </div>
          <nav className="flex items-center gap-3">
            <a href="#about" className="text-sm hover:underline">About</a>
            <a href="#schedule" className="text-sm hover:underline">Schedule</a>
            <a href="#stream" className="text-sm hover:underline">Stream</a>
            <a href="#register" className="text-sm hover:underline">RSVP</a>
            <a href={donationUrl} className="ml-2 inline-block rounded-lg bg-amber-600 text-white px-4 py-2 text-sm font-medium">Donate</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <img src={heroImage} alt="maharudra" className="w-full h-64 object-cover rounded-lg shadow-md" />
            </motion.div>

            <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="mt-2 text-slate-700">Join us for a sacred Mahā Rudra ceremony. All are welcome — bring family and friends. We will have guided chanting, abhishekam, and devotional music.</p>

              <div className="mt-4 flex flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <strong className="text-sm">When:</strong>
                  <span className="text-sm text-slate-600">{date} • {startTime} — {endTime}</span>
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

              <div className="mt-6 flex gap-3">
                <a href="#register" className="rounded-lg bg-amber-600 text-white px-5 py-2 font-medium">RSVP</a>
                <a href={donationUrl} className="rounded-lg border border-amber-600 text-amber-600 px-5 py-2 font-medium">Donate</a>
              </div>
            </div>
          </div>

          {/* Right column cards */}
          <aside className="space-y-4">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h3 className="font-semibold">Quick Info</h3>
              <ul className="mt-2 text-sm text-slate-600 space-y-1">
                <li><strong>Doors:</strong> 5:30 PM</li>
                <li><strong>Registration:</strong> Walk-ins welcome</li>
                <li><strong>Contact:</strong> events@temple.org</li>
              </ul>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h3 className="font-semibold">Speakers & Priests</h3>
              <ul className="mt-2 text-sm text-slate-600 space-y-2">
                {speakers.map((s) => (
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

            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h3 className="font-semibold">Livestream</h3>
              <p className="text-sm text-slate-600 mt-2">Tune in on our YouTube channel during the event.</p>
              <a href={`https://www.youtube.com/channel/${youtubeChannelId}`} className="mt-3 inline-block text-sm text-amber-600 hover:underline">Open channel</a>
            </div>
          </aside>
        </section>

        {/* Schedule */}
        <section id="schedule" className="mt-12">
          <h2 className="text-xl font-semibold">Schedule</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {schedule.map((s) => (
              <div key={s.time} className="rounded-lg bg-white p-4 shadow-sm">
                <div className="text-xs text-slate-500">{s.time}</div>
                <div className="font-medium mt-1">{s.title}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Stream Embed */}
        <section id="stream" className="mt-12">
          <h2 className="text-xl font-semibold">Live Stream</h2>
          <div className="mt-4 rounded-lg bg-white p-4 shadow-sm">
            <div className="aspect-w-16 aspect-h-9">
              {/* YouTube live embed for channel (replace YOUR_CHANNEL_ID) */}
              <iframe
                title="livestream"
                src={`https://www.youtube.com/embed/live_stream?channel=${youtubeChannelId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-96 rounded"
              ></iframe>
            </div>
          </div>
        </section>

        {/* Register / RSVP */}
        <section id="register" className="mt-12">
          <h2 className="text-xl font-semibold">RSVP / Volunteer</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <form className="rounded-lg bg-white p-6 shadow-sm">
              <label className="block text-sm font-medium">Full name</label>
              <input className="mt-1 w-full border rounded px-3 py-2" placeholder="Your name" />

              <label className="block text-sm font-medium mt-4">Email</label>
              <input className="mt-1 w-full border rounded px-3 py-2" placeholder="name@example.com" />

              <label className="block text-sm font-medium mt-4">I want to</label>
              <select className="mt-1 w-full border rounded px-3 py-2">
                <option>Attend</option>
                <option>Volunteer</option>
                <option>Help with logistics</option>
              </select>

              <div className="mt-6 flex gap-3">
                <button type="button" className="rounded bg-amber-600 text-white px-4 py-2">Submit</button>
                <button type="button" className="rounded border px-4 py-2">Reset</button>
              </div>
            </form>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="font-semibold">How to help</h3>
              <p className="text-sm text-slate-600 mt-2">We need volunteers for seating, prasadam distribution, and parking. Bring your friends!</p>
              <a href="mailto:events@temple.org?subject=Volunteer%20for%20MahaRudra" className="mt-4 inline-block text-amber-600 hover:underline">Email the events team</a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 py-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} {title} • Built with 𓉸𓆘 and devotion by the MahaRudra Religious Committee
        </footer>
      </main>
    </div>
  );
}
