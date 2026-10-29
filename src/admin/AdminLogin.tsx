import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { adminAuth } from './auth/adminAuth';

interface AdminLoginProps {
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  useEffect(() => {
    // Check initial lockout
    const sec = adminAuth.getLockoutSeconds();
    setLockoutSeconds(sec);

    if (sec > 0) {
      const timer = setInterval(() => {
        const remaining = adminAuth.getLockoutSeconds();
        setLockoutSeconds(remaining);
        if (remaining <= 0) {
          clearInterval(timer);
          setError(null);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    setIsSubmitting(true);
    setError(null);

    // Short synthetic delay for security (prevents timing attacks)
    setTimeout(() => {
      const res = adminAuth.login(email, password, remember);
      setIsSubmitting(false);

      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || 'Access denied.');
        const sec = adminAuth.getLockoutSeconds();
        if (sec > 0) {
          setLockoutSeconds(sec);
        }
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f0f4f8] flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-600/15 via-purple-600/15 to-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md bg-[#0e121a]/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] z-10"
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-black flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-base font-bold font-display text-white tracking-tight">
                Studio Admin
              </h1>
              <p className="text-[11px] font-mono text-cyan-400">
                Protected Control Engine
              </p>
            </div>
          </div>

          <a
            href="/"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition px-2.5 py-1.5 rounded-lg hover:bg-white/5"
            title="Wapis Portfolio Par Jayein"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Site</span>
          </a>
        </div>

        {/* Security Notice */}
        <div className="mb-6 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-200/90 leading-relaxed flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            Ye private panel sirf authorized admin k liye mehfooz ha. Sahi credentials darj karein.
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 flex items-start gap-2.5 leading-relaxed"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Lockout countdown warning */}
        {lockoutSeconds > 0 && (
          <div className="mb-5 p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-xs text-amber-200 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Security Lockout: <strong>{lockoutSeconds}s</strong> intezar karein.</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-medium text-gray-300 mb-1.5">
              Admin Gmail / Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                autoComplete="email"
                disabled={lockoutSeconds > 0 || isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin email darj karein"
                className="w-full bg-[#141a24] border border-gray-700/80 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 pl-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-gray-300 mb-1.5">
              Secret Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                disabled={lockoutSeconds > 0 || isSubmitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Secret password darj karein"
                className="w-full bg-[#141a24] border border-gray-700/80 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 pl-10 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition font-mono"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-1 text-gray-400 hover:text-white transition cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-[#141a24] border-gray-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
              />
              <span>Remember session</span>
            </label>
            <span className="text-[11px] font-mono text-cyan-400/80">Authorized Access Only</span>
          </div>

          <button
            type="submit"
            disabled={lockoutSeconds > 0 || isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 hover:from-cyan-400 to-blue-600 hover:to-blue-500 text-black font-bold text-sm tracking-wide transition shadow-lg shadow-cyan-500/25 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Admin Panel Unlock Karein</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-800 text-center">
          <p className="text-[11px] font-mono text-gray-500">
            Encrypted Security Guard • Ramzan Portfolio Studio
          </p>
        </div>
      </motion.div>
    </div>
  );
};
