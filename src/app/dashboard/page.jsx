// app/livecount/page.jsx
"use client";

import React from "react";
import { useRouter } from 'next/navigation';

export default function LiveCountPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-slate-900 p-6">
      <main className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold">Namaskara, Vedic Chanter</h1>
          <p className="mt-2 text-slate-600">For the best chanting experience, we recommend putting your phone on Do Not Disturb and turning off all notifications.
          </p>
          <p className="mt-2 text-slate-600">Closing this tab or even turning off your phone while "joined" in the live rudra will not disconnect you from the session.</p>
          <br style={{ marginBottom: 8 }} />
          <a
            href="https://drive.google.com/drive/folders/1OpwrspwyLQgnqxZz1ZxXUutQ8Dyy7GT4?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 rounded-lg font-medium bg-amber-600 text-white hover:bg-amber-700 inline-block"
          >
            View Chanting Documents
          </a>
        </header>

        <section className="bg-white bg-center rounded-lg shadow p-6">
          <div className="mt-6 flex justify-center gap-2">
            <div className="p-3 bg-amber-50 rounded text-center">
              <div className="text-2xl font-semibold">5:53:40</div>
              <div className="text-xs text-slate-500">Total Chanting Time</div>
            </div>
            <div className="p-3 bg-amber-50 rounded text-center">
              <div className="text-2xl font-semibold">-</div>
              <div className="text-xs text-slate-500">Current Rudra Elapsed Time</div>
            </div>
          </div>
        </section>
        <br style={{ marginBottom: 8 }} />

        <section className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-sm text-slate-500">Ekadasha parayana completed</div>

          <div className="mt-6">
            <div className="inline-flex items-baseline gap-3">
              <div className="text-6xl font-extrabold text-amber-600">
                40
              </div>
              <div className="text-sm text-slate-500">chanters</div>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              className={"px-6 py-2 rounded-lg font-medium bg-amber-300 text-white cursor-default"}
              disabled={true}
            >
              You are connected
            </button>
          </div>
        </section>
        <br style={{ marginBottom: 8 }} />
        <section className="bg-white bg-center rounded-lg shadow p-6">
          <div className="mt-6 flex justify-center gap-2">
            <div className="p-3 bg-amber-50 rounded text-center">
              <div className="text-2xl font-semibold">1496</div>
              <div className="text-xs text-slate-500">Rudras Chanted</div>
            </div>
            <div className="p-3 bg-amber-50 rounded text-center">
              <div className="text-2xl font-semibold">0</div>
              <div className="text-xs text-slate-500">Rudras remaining</div>
            </div>
            <div className="p-3 bg-amber-50 rounded text-center">
              <div className="text-2xl font-semibold">13:04</div>
              <div className="text-xs text-slate-500">Previous Rudra Duration</div>
            </div>
          </div>
        </section>
        <br style={{ marginBottom: 8 }} />
        <div className="flex justify-center">
          <button
            onClick={() => { router.push("/") }}
            className="px-6 py-2 rounded-lg font-medium bg-amber-600 text-white hover:bg-amber-700 "
          >Back to MahaRudra Dashboard</button>
        </div>
      </main>
    </div >
  );
}