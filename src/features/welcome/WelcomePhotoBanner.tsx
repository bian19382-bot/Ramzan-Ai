import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowDown, Sparkles } from 'lucide-react';
import { Profile } from '../../types/portfolio';
import { safeStorage } from '../../lib/storage';

const STORAGE_WELCOME_DISMISSED = 'portfolio_welcome_banner_dismissed';

interface WelcomePhotoBannerProps {
  profile: Profile;
  onDismiss: () => void;
  isOpen: boolean;
}

export const WelcomePhotoBanner: React.FC<WelcomePhotoBannerProps> = ({
  profile,
  onDismiss,
  isOpen,
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const bannerUrl =
    profile.welcome_banner_url ||
    '/assets/aistudio/Neon_Portfolio_Hero__Welcome__I_m_Ramzan_85351036.png';

  const handleClose = () => {
    if (dontShowAgain) {
      safeStorage.set(STORAGE_WELCOME_DISMISSED, 'true');
    }
    onDismiss();
  };

  const handleExplore = () => {
    handleClose();
    const target = document.getElementById('projects') || document.getElementById('home');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-50 w-full bg-[#080911]/95 backdrop-blur-2xl border-b border-cyan-500/20 shadow-2xl"
        role="region"
        aria-label="Welcome announcement banner"
      >
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          {/* Card Container with Neon Glow */}
          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-[#0A0B14] shadow-[0_0_40px_rgba(37,99,235,0.2)]">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-black/50 border-b border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[11px] uppercase tracking-widest font-mono font-semibold text-cyan-300">
                  Featured Welcome Banner
                </span>
                <span className="text-white/30 hidden sm:inline">•</span>
                <span className="text-xs text-white/70 hidden sm:inline">
                  {profile.full_name} — AI Creator & Web Developer
                </span>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-white/70 hover:text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="rounded border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[11px]">Don't show again</span>
                </label>

                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
                  aria-label="Dismiss banner"
                  title="Dismiss banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Banner Media Showcase */}
            <div className="relative group cursor-pointer overflow-hidden" onClick={handleExplore}>
              <img
                src={bannerUrl}
                alt="Welcome - I'm Ramzan, AI Creator & Digital Professional"
                className="w-full max-h-[460px] object-cover sm:object-contain bg-black/80 transition-transform duration-500 group-hover:scale-[1.01]"
              />

              {/* Bottom Quick-Action Bar */}
              <div className="p-4 sm:p-5 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left w-full sm:w-auto">
                  <p className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
                    Portfolio • AI Creator & Web Developer
                  </p>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                    Welcome — I'm Ramzan Ghafoor
                  </h3>
                  <p className="text-xs text-zinc-300 mt-0.5">
                    Building next-generation digital experiences, modern web applications, and AI integrations.
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExplore();
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm shadow-[0_0_20px_rgba(6,182,212,0.5)] transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Explore My Work</span>
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClose();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/15 transition cursor-pointer shrink-0"
                  >
                    Enter Site Directly
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
