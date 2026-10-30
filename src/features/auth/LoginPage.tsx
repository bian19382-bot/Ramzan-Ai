import React, { useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from './AuthProvider';

type RedirectState = { from?: { pathname?: string; search?: string; hash?: string } };

export function LoginPage() {
  const { user, loading, isConfigured, signIn } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const from = (location.state as RedirectState | null)?.from;
  const destination = from?.pathname && from.pathname !== '/'
    ? `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`
    : '/admin';

  if (!loading && user) return <Navigate to={destination} replace />;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in.';
      setError(
        /invalid login credentials/i.test(message)
          ? 'Email ya password durust nahi. Dobara koshish karein.'
          : message
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-login-page">
      <section className="auth-login-card" aria-labelledby="auth-login-title">
        <div className="auth-brand-mark" aria-hidden="true">A</div>
        <p className="auth-eyebrow">ADMIN PORTAL ACCESS</p>
        <h1 id="auth-login-title">Admin Login</h1>
        <p className="auth-subtitle">Sign in to manage your portfolio, projects, and settings.</p>

        {!isConfigured && (
          <div className="p-3 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed">
            <p className="font-semibold mb-1">Notice: Supabase Credentials Pending</p>
            <p className="text-amber-200/80 mb-2">
              Set <code className="font-mono text-[11px]">VITE_SUPABASE_URL</code> and{' '}
              <code className="font-mono text-[11px]">VITE_SUPABASE_PUBLISHABLE_KEY</code> in environment variables to enable cloud authentication.
            </p>
            <Link
              to="/admin"
              className="inline-block px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold transition"
            >
              Continue to Admin Portal (Local Passcode Mode) →
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="auth-email">Admin Email</label>
          <input
            id="auth-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@example.com"
            required
          />
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your admin password"
            required
          />
          {error && <p className="auth-inline-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit" disabled={submitting || loading}>
            {submitting ? 'Signing in…' : 'Sign in to Admin'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[var(--border)] text-center">
          <Link
            to="/"
            className="text-xs text-[var(--accent-text)] hover:underline inline-flex items-center gap-1 font-medium"
          >
            ← Back to Public Website
          </Link>
        </div>
      </section>
    </main>
  );
}
