import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { adminAuth } from '../../admin/auth/adminAuth';

const AUTHORIZED_ADMIN_EMAIL = 'babajani543210@gmail.com';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono text-[var(--text-muted)]">Verifying authorized admin session…</p>
      </main>
    );
  }

  // Check Supabase authentication AND local session fallback
  const isSupabaseAdmin = Boolean(
    user && user.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()
  );
  const isLocalAdmin = adminAuth.checkAuth();

  if (!isSupabaseAdmin && !isLocalAdmin) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
