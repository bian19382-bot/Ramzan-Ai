import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const initialize = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (data.session) {
          const { data: userData, error: userError } = await supabase.auth.getUser();
          if (userError) throw userError;
          if (active) {
            setSession(data.session);
            setUser(userData.user);
          }
        } else if (active) {
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.warn('Unable to restore Supabase session:', error);
        if (active) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error(
        'Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.'
      );
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) throw error;

    // Verify the authenticated identity with Supabase before allowing protected UI.
    const { data: verified, error: verifyError } = await supabase.auth.getUser(data.session?.access_token);
    if (verifyError) {
      await supabase.auth.signOut();
      throw verifyError;
    }
    setSession(data.session);
    setUser(verified.user);
  }, []);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    setSession(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, session, loading, isConfigured: isSupabaseConfigured, signIn, signOut }),
    [user, session, loading, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
