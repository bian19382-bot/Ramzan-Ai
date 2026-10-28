import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

type RedirectState = { from?: { pathname?: string; search?: string; hash?: string } };

export function LoginPage() {
  const { user, loading, signIn } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const from = (location.state as RedirectState | null)?.from;
  const destination = from?.pathname
    ? `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`
    : '/';

  if (!loading && user) return <Navigate to={destination} replace />;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in.';
      setError(/invalid login credentials/i.test(message)
        ? 'Email ya password durust nahi. Dobara koshish karein.'
        : message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-login-page">
      <section className="auth-login-card" aria-labelledby="auth-login-title">
        <div className="auth-brand-mark" aria-hidden="true">A</div>
        <p className="auth-eyebrow">SECURE ACCESS</p>
        <h1 id="auth-login-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue to your portfolio.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="auth-email">Email address</label>
          <input
            id="auth-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />
          {error && <p className="auth-inline-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit" disabled={submitting || loading}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="auth-footnote">Access is available to accounts created in Supabase.</p>
      </section>
    </main>
  );
}
