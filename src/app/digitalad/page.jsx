"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase"; // your initialized Firebase app

const images = [
  "/images/Slide1.png",
  "/images/Slide2.png",
];

const sponsors = [
  "Smt and Sri. Lavanya, Chetan and the Waterfront family Dentistry family",
  "Smt and Sri. Roopa, Satyaprakash and family",
  "Smt and Sri. Savitha, Dhruv and family",
  "Smt and Sri. Nagashree, Srinivas and family",
  "Smt and Sri. Poornima, Subanna and family",
]

export default function SlideshowBackground() {
  const [current, setCurrent] = useState(0);
  const [rudraCount, setRudraCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 7000); // change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const rudraRef = ref(db, "counters/rudraCount");

    // Listen for changes
    const unsubscribeRudra = onValue(rudraRef, (snapshot) => {
      setRudraCount(snapshot.val() || 0);
    });

    return () => unsubscribeRudra();
  }, []);


  return (
    <div className="relative w-full h-screen overflow-hidden">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt=""
          className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${index === current ? "opacity-100" : "opacity-0"
            }`}
        />
      ))}

      {/* Optional overlay content */}
      <div
        className={"absolute inset-20 flex items-end justify-center text-purple-900 text-4xl font-bold drop-shadow-lg"}
      >
        {rudraCount} Rudras Chanted
      </div>
    </div>
  );
}