// src/context/AuthContext.jsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { get, ref, remove } from "firebase/database";
import { auth, db } from "../lib/firebase"; // your firebase config


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for easy access
export const useAuth = () => useContext(AuthContext);
export const logout = async (user) => {
  if (!user) return;

  try {
    const snap = await get(ref(db, `sessions/${user.uid}/joined`));
    const userChantingInProgress = snap.exists() ? snap.val() : false;
    if (userChantingInProgress) {
      alert("You cannot sign out while joined in an active session. Please get leave by a moderator and leave the live rudra before signing out.")
      return;
    }
    await signOut(auth);
  } catch (err) {
    console.error("Failed to log out:", err);
  }
};