import type { User as SupabaseAuthUser } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import type { User } from "./types";

export type AuthUser = User;

async function fetchProfile(userId: string, email?: string, name?: string): Promise<AuthUser> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw error;
    if (data) {
      return {
        id: data.id,
        name: data.name ?? name,
        email: data.email,
        role: data.role,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)));
  }

  return {
    id: userId,
    name,
    email: email ?? "",
    role: "CUSTOMER",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function authMessage(error: { message?: string } | null): Error {
  return new Error(error?.message || "Authentication failed");
}

export const authAPI = {
  async register(email: string, password: string, name: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) throw authMessage(error);
    if (!data.user) throw new Error("Registration failed");

    return fetchProfile(data.user.id, data.user.email ?? email, name);
  },

  async login(email: string, password: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw authMessage(error);
    if (!data.user) throw new Error("Login failed");

    return fetchProfile(
      data.user.id,
      data.user.email ?? email,
      data.user.user_metadata?.name
    );
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw authMessage(error);
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw authMessage(error);
    if (!session?.user) return null;

    return fetchProfile(
      session.user.id,
      session.user.email ?? undefined,
      session.user.user_metadata?.name
    );
  },

  onAuthStateChanged(callback: (user: AuthUser | null) => void) {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        callback(null);
        return;
      }

      try {
        const profile = await fetchProfile(
          session.user.id,
          session.user.email ?? undefined,
          session.user.user_metadata?.name
        );
        callback(profile);
      } catch (error) {
        console.error("Auth state change error:", error);
        callback(null);
      }
    });

    return () => subscription.unsubscribe();
  },
};

export type { SupabaseAuthUser };
