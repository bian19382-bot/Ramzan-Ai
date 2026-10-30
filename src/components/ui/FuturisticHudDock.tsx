import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, MessageCircle } from 'lucide-react';

interface FuturisticHudDockProps {
  whatsappNumber: string;
}

export const FuturisticHudDock: React.FC<FuturisticHudDockProps> = ({ whatsappNumber }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappClean = whatsappNumber.replace(/\D/g, '').replace(/^0/, '');
  const whatsappUrl = `https://wa.me/92${whatsappClean}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Scroll to Top Cyber Thruster */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="w-10 h-10 rounded-xl bg-white/95 dark:bg-[#0e121a]/90 backdrop-blur-md border border-cyan-600/30 dark:border-cyan-500/40 text-cyan-700 dark:text-cyan-300 hover:text-cyan-900 dark:hover:text-white hover:bg-cyan-50 dark:hover:bg-cyan-500/20 hover:border-cyan-500 dark:hover:border-cyan-300 transition-all flex items-center justify-center shadow-md dark:shadow-[0_0_20px_rgba(6,182,212,0.25)] group cursor-pointer"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Direct WhatsApp Floating Transmission Node */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 dark:bg-[#0a0d14]/95 backdrop-blur-md border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-white hover:border-emerald-500 hover:shadow-lg dark:hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all group radar-wave shadow-sm"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
        <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
        <span className="text-xs font-mono font-semibold hidden sm:inline-block">
          WhatsApp Direct
        </span>
      </a>
    </div>
  );
};
