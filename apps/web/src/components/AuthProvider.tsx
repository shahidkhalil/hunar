"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authAPI, type AuthUser } from "@/lib/supabase-auth";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    authAPI.getCurrentUser()
      .then((currentUser) => {
        if (mounted) {
          setUser(currentUser);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Get current user error:", error);
        if (mounted) setLoading(false);
      });

    const unsubscribe = authAPI.onAuthStateChanged((nextUser) => {
      if (mounted) {
        setUser(nextUser);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const nextUser = await authAPI.login(email, password);
    setUser(nextUser);
    return nextUser;
  };

  const register = async (name: string, email: string, password: string) => {
    const nextUser = await authAPI.register(email, password, name);
    setUser(nextUser);
    return nextUser;
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
