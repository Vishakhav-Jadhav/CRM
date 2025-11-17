'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Development mode - mock auth if Supabase URL is placeholder or not configured
  const isDevelopment = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-project') ||
                       process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('example') ||
                       !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                       !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('your-');

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      if (isDevelopment) {
        // In development, no initial session
        setLoading(false);
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (err) {
        console.error('Failed to get session:', err);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    let subscription: any = null;
    if (!isDevelopment) {
      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );
      subscription = sub;
    }

    return () => subscription?.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (isDevelopment) {
      // Mock successful sign in for development
      const mockUser = {
        id: 'dev-user-id',
        email: email,
        user_metadata: { name: 'Development User' },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
      } as User;
      setUser(mockUser);
      setSession({ user: mockUser } as Session);
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Don't set loading to false immediately - let the auth state change handler handle it
    // This prevents the loading spinner from showing during the brief moment after login
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    if (isDevelopment) {
      // Mock successful sign up for development
      const mockUser = {
        id: 'dev-user-id',
        email: email,
        user_metadata: { name: 'Development User' },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
      } as User;
      setUser(mockUser);
      setSession({ user: mockUser } as Session);
      return { error: null };
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    return { error };
  };

  const signOut = async () => {
    if (isDevelopment) {
      // Mock sign out for development
      setUser(null);
      setSession(null);
      return { error: null };
    }

    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}