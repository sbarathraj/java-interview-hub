import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  /** Tries to sign in; if user doesn't exist, creates the account, then signs in. */
  signInOrSignUp: (email: string, password: string) => Promise<{ error?: string; created?: boolean }>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up listener FIRST, then fetch existing session
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signInOrSignUp = async (email: string, password: string) => {
    // Try sign in first
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (!signInErr) return {};

    const msg = signInErr.message.toLowerCase();
    const looksLikeMissingUser =
      msg.includes("invalid login credentials") ||
      msg.includes("user not found") ||
      msg.includes("invalid email or password");

    if (!looksLikeMissingUser) return { error: signInErr.message };

    // Try to create the account
    const { error: signUpErr } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (signUpErr) return { error: signUpErr.message };

    // Then sign in (auto-confirm is enabled, so this should work immediately)
    const { error: secondTry } = await supabase.auth.signInWithPassword({ email, password });
    if (secondTry) return { error: secondTry.message };

    return { created: true };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Ctx.Provider value={{ user, session, loading, signInOrSignUp, signOut }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
};
