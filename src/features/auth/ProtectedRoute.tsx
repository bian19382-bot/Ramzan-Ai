import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export function ProtectedRoute() {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const [signOutError, setSignOutError] = React.useState('');

  if (loading) {
    return (
      <main className="auth-loading" aria-live="polite">
        <div className="auth-spinner" aria-hidden="true" />
        <p>Verifying your session…</p>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const handleSignOut = async () => {
    setSignOutError('');
    try {
      await signOut();
    } catch {
      setSignOutError('Sign out failed. Please try again.');
    }
  };

  return (
    <>
      <div className="auth-session-bar">
        <span title={user.email ?? 'Signed in'}>{user.email ?? 'Signed in'}</span>
        <button type="button" onClick={handleSignOut}>Sign out</button>
      </div>
      {signOutError && <p className="auth-inline-error" role="alert">{signOutError}</p>}
      <Outlet />
    </>
  );
}
