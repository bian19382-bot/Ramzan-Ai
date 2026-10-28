import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sun, Moon, Sparkles, Shield, ArrowRight, Globe, FileText } from 'lucide-react';
import { NavItem, SocialLink } from '../../types/portfolio';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  socials: SocialLink[];
  onOpenWelcome?: () => void;
  onReplayIntro?: () => void;
  onOpenPalette?: () => void;
  onOpenAiConsultant?: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  items,
  socials,
  onOpenWelcome,
  onReplayIntro,
  onOpenPalette,
  onOpenAiConsultant,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 w-[88%] max-w-sm z-50 glass-panel border-l border-[var(--border)] shadow-2xl flex flex-col justify-between p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Drawer"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[var(--border)]">
                <span className="font-display font-bold text-lg tracking-tight text-[var(--text)]">
                  Menu
                </span>
                <button
                  onClick={onClose}
                  className="p-2.5 rounded-full hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] transition cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="mt-6 flex flex-col gap-1">
                {items
                  .filter((item) => item.visible && !item.is_cta)
                  .map((item) => {
                    const label =
                      item.target === '#home'
                        ? t('navHome')
                        : item.target === '#about'
                        ? t('navAbout')
                        : item.target === '#projects'
                        ? t('navProjects')
                        : item.target === '#skills'
                        ? 'Tools'
                        : item.target === '#services'
                        ? t('navServices')
                        : item.target === '#approach'
                        ? language === 'ur-roman' ? 'Tareeqa' : 'Approach'
                        : item.target === '#contact'
                        ? t('navContact')
                        : item.label;

                    return (
                      <a
                        key={item.id}
                        href={item.target}
                        onClick={onClose}
                        className="px-4 py-3 rounded-xl text-base font-medium text-[var(--text)] hover:bg-[var(--surface-2)] hover:text-[var(--accent-text)] transition flex items-center justify-between group"
                      >
                        <span>{label}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition text-[var(--accent)]" />
                      </a>
                    );
                  })}

                {/* Resume Link */}
                <a
                  href="/resume"
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl text-base font-medium text-[var(--text)] hover:bg-[var(--surface-2)] hover:text-[var(--accent-text)] transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[var(--accent)]" />
                    <span>Resume (CV)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition text-[var(--accent)]" />
                </a>

                {/* Quick Edit / Admin Portal */}
                <a
                  href="/admin"
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl text-base font-medium text-[var(--text)] hover:bg-[var(--surface-2)] hover:text-[var(--accent-text)] transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Quick Edit / Admin</span>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition text-[var(--accent)]" />
                </a>

                {onOpenAiConsultant && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAiConsultant();
                    }}
                    className="mt-2 px-4 py-3 rounded-xl text-sm font-medium text-[var(--accent-text)] bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 transition flex items-center gap-2.5 cursor-pointer text-left"
                  >
                    <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                    <span>AI Project Consultant</span>
                  </button>
                )}

                {onOpenPalette && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPalette();
                    }}
                    className="mt-1 px-4 py-3 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] transition flex items-center gap-2.5 cursor-pointer text-left"
                  >
                    <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)]">⌘K</span>
                    <span>Command Palette</span>
                  </button>
                )}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[var(--border)] flex flex-col gap-4">
              {/* Language Selection Bar */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <span className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-1.5 pl-1">
                  <Globe className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Lang:</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition ${
                      language === 'en' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('ur-roman')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition ${
                      language === 'ur-roman' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    ROM
                  </button>
                  <button
                    onClick={() => setLanguage('ur')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-urdu transition ${
                      language === 'ur' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    اردو
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition cursor-pointer"
                >
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-[var(--accent)]" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  <span className="capitalize">{theme} Theme</span>
                </button>

                {(onOpenWelcome || onReplayIntro) && (
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenWelcome) onOpenWelcome();
                      else if (onReplayIntro) onReplayIntro();
                    }}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-text)] transition underline cursor-pointer"
                  >
                    Welcome Card
                  </button>
                )}
              </div>

              {socials.filter((s) => s.url && s.url.trim() !== '' && s.url !== '#').length > 0 && (
                <div className="flex items-center gap-3 pt-2">
                  {socials
                    .filter((s) => s.url && s.url.trim() !== '' && s.url !== '#')
                    .map((soc) => (
                      <a
                        key={soc.id}
                        href={soc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] transition"
                        aria-label={soc.label}
                      >
                        <span className="text-xs font-semibold">{soc.label.slice(0, 2)}</span>
                      </a>
                    ))}
                </div>
              )}

              <a
                href="#contact"
                onClick={onClose}
                className="w-full text-center py-3.5 rounded-full bg-[var(--accent)] hover:brightness-110 text-white font-medium text-sm shadow-lg transition active:scale-98"
              >
                {t('navCta')}
              </a>

              <a
                href="/admin"
                className="text-center text-xs text-[var(--text-muted)] hover:text-[var(--text)] flex items-center justify-center gap-1.5 opacity-60 hover:opacity-100 transition pt-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
