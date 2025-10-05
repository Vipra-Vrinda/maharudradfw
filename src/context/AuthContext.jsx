// src/context/AuthContext.jsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { get, ref } from "firebase/database";
import { auth } from "../lib/firebase"; // your firebase config


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const userChantingInProgress = (await get(ref(db, `sessions/${currentUser.uid}/joined`))).val();
      if (!currentUser && userChantingInProgress) {
        alert("You cannot sign out while joined in an active session. Please get leave by a moderator and leave the live rudra before signing out.")
        return;
      }
      if (!currentUser && !userChantingInProgress) {
        setUser(null);
        setUid(null);
        setLoading(false);
        return;
      }

      const sessionId = localStorage.getItem("sessionId");
      const dbSession = (await get(ref(db, `sessions/${currentUser.uid}`))).val();

      if (dbSession !== sessionId) {
        // Another device logged in
        await auth.signOut();
        alert("Your session has been invalidated because your account logged in elsewhere.");
        return;
      }

      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, uid, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for easy access
export const useAuth = () => useContext(AuthContext);
export const logout = () => signOut(auth);