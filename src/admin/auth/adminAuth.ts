/**
 * Admin Security & Authentication Service
 * Credentials configured strictly for Ramzan:
 * Email: babajani543210@gmail.com
 * Password: office@12
 */

const AUTH_KEY = 'ramzan_admin_session_auth';
const ATTEMPTS_KEY = 'ramzan_admin_failed_attempts';
const LOCKOUT_KEY = 'ramzan_admin_lockout_until';

const AUTHORIZED_EMAIL = 'babajani543210@gmail.com';
const AUTHORIZED_PASSWORD = 'office@12';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds lockout

export interface AdminSession {
  authenticated: boolean;
  email: string;
  loginAt: string;
}

export const adminAuth = {
  checkAuth(): boolean {
    try {
      const sessionStr =
        sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY);
      if (!sessionStr) return false;
      const session = JSON.parse(sessionStr) as AdminSession;
      return (
        session.authenticated === true &&
        session.email.toLowerCase() === AUTHORIZED_EMAIL.toLowerCase()
      );
    } catch {
      return false;
    }
  },

  getCurrentSession(): AdminSession | null {
    try {
      const sessionStr =
        sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY);
      if (!sessionStr) return null;
      return JSON.parse(sessionStr) as AdminSession;
    } catch {
      return null;
    }
  },

  getLockoutSeconds(): number {
    try {
      const lockoutUntil = parseInt(localStorage.getItem(LOCKOUT_KEY) || '0', 10);
      const diff = lockoutUntil - Date.now();
      return diff > 0 ? Math.ceil(diff / 1000) : 0;
    } catch {
      return 0;
    }
  },

  login(
    email: string,
    password: string,
    remember: boolean = false
  ): { success: boolean; error?: string } {
    // Check lockout first
    const lockoutSec = this.getLockoutSeconds();
    if (lockoutSec > 0) {
      return {
        success: false,
        error: `Security Lockout: Bohat ziada ghalat attempts. Meharbani farma kar ${lockoutSec} seconds baad dobara koshish karein.`,
      };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password;

    if (!cleanEmail || !cleanPass) {
      return {
        success: false,
        error: 'Meharbani farma kar email aur password dono darj karein.',
      };
    }

    if (
      cleanEmail === AUTHORIZED_EMAIL.toLowerCase() &&
      cleanPass === AUTHORIZED_PASSWORD
    ) {
      // Clear failed attempts & lockout
      localStorage.removeItem(ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_KEY);

      const session: AdminSession = {
        authenticated: true,
        email: AUTHORIZED_EMAIL,
        loginAt: new Date().toISOString(),
      };

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(AUTH_KEY, JSON.stringify(session));

      return { success: true };
    }

    // Handle failed attempt
    const currentAttempts =
      parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0', 10) + 1;
    localStorage.setItem(ATTEMPTS_KEY, currentAttempts.toString());

    if (currentAttempts >= MAX_FAILED_ATTEMPTS) {
      localStorage.setItem(
        LOCKOUT_KEY,
        (Date.now() + LOCKOUT_DURATION_MS).toString()
      );
      localStorage.removeItem(ATTEMPTS_KEY);
      return {
        success: false,
        error: `5 ghalat attempts k baad security lock activate ho gaya ha. 60 seconds intezar karein.`,
      };
    }

    const remaining = MAX_FAILED_ATTEMPTS - currentAttempts;
    return {
      success: false,
      error: `Ghalat Email ya Password! Sirf authorized admin hi open kar sakta ha. (${remaining} koshish baqi)`,
    };
  },

  logout(): void {
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_KEY);
  },
};
