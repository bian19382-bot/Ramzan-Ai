import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl p-6 sm:p-8 z-10 space-y-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-title"
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 id="privacy-title" className="text-lg font-bold font-display text-[var(--text)]">
                Privacy & Data Principles
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed space-y-3">
            <p>
              This website is designed with a strict privacy-first architecture. We do not use third-party tracking cookies, invasive fingerprinting, or resell personal telemetry.
            </p>
            <p>
              <strong>1. Inquiry Submissions:</strong> Information provided through the contact form (name, email, project details) is used solely to respond to your specific request.
            </p>
            <p>
              <strong>2. Local Storage:</strong> Non-sensitive user preferences (dark/light theme, intro video skip toggle) are stored locally in your browser and never synchronized externally.
            </p>
            <p>
              <strong>3. First-Party Analytics:</strong> Anonymous, aggregated interaction counts (page views, project clicks) are collected without IP logging to measure site performance.
            </p>
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-[var(--surface-2)] hover:bg-[var(--border)] text-xs font-semibold text-[var(--text)] transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
