"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // global user state
  const [loading, setLoading] = useState(true);

  // Auto-fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();
        if (data.user) setUser(data.user);
      } catch (err) {
        console.error("Fetch user failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
