// src/context/AuthContext.jsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { get, ref, remove } from "firebase/database";
import { auth, db } from "../lib/firebase"; // your firebase config


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        if (user != null) {
          const snap = (await get(ref(db, `sessions/${user.uid}/joined`)));
          const userChantingInProgress = snap.exists() ? snap.val() : false;
          if (userChantingInProgress) {
            alert("You cannot sign out while joined in an active session. Please get leave by a moderator and leave the live rudra before signing out.")
            return;
          }
        }
        setUser(null);
        setUid(null);
        setLoading(false);
        return;
      }

      const sessionId = localStorage.getItem("sessionId");
      const dbSession = await get(ref(db, `sessions/${currentUser.uid}`));

      if (dbSession.exists() && sessionId && (dbSession.val() !== sessionId)) {
        signOut(auth);
        // Another device logged in
        alert("Please sign out of the previous session to join on this device.");
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
export const logout = (user) => {
  remove(db, `sessions/${user.uid}/sessionId`);
  localStorage.removeItem("sessionId");
  signOut(auth);
}