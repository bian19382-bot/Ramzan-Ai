import React from 'react';
import { ArrowUp, RotateCcw, Shield, Sun, Moon, Mail, MessageCircle } from 'lucide-react';
import { SiteSettings, SocialLink, NavItem } from '../../types/portfolio';
import { useTheme } from '../theme/ThemeContext';

interface FooterProps {
  settings: SiteSettings;
  socials: SocialLink[];
  navItems: NavItem[];
  onOpenWelcome?: () => void;
  onReplayIntro?: () => void;
  onOpenPrivacyModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  socials,
  navItems,
  onOpenWelcome,
  onReplayIntro,
  onOpenPrivacyModal,
}) => {
  const { theme, toggleTheme } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();
  const validSocials = socials.filter((s) => s.url && s.url.trim() !== '' && s.url !== '#');

  const whatsappCleanNumber = settings.whatsapp_number.replace(/\D/g, '').replace(/^0/, '');
  const whatsappUrl = `https://wa.me/92${whatsappCleanNumber}`;

  return (
    <footer className="pt-16 pb-12 px-5 sm:px-8 lg:px-12 border-t border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] text-xs">
      <div className="max-w-[1200px] w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[var(--border)]">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.35)] bg-black shrink-0">
                <img
                  src="/assets/aistudio/Neon_R_Monogram_with_Ramzan_Branding_4d04e86b.png"
                  alt="Ramzan Logo"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[var(--text)] tracking-tight">
                  {settings.site_name}
                </h3>
                <p className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                  {settings.tagline}
                </p>
              </div>
            </div>
            <p className="max-w-sm leading-relaxed text-xs sm:text-sm text-[var(--text-muted)] font-medium">
              Building digital experiences with AI-assisted creativity.
            </p>
            <div className="pt-2 flex flex-col gap-1.5 text-xs font-mono">
              <a href={`mailto:${settings.contact_email}`} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>{settings.contact_email}</span>
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>WhatsApp: {settings.whatsapp_number}</span>
              </a>
            </div>
          </div>

          {/* Links Col */}
          <div className="md:col-span-4 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text)] font-semibold">
              Navigation
            </span>
            <div className="grid grid-cols-2 gap-2 pt-1 font-medium">
              {navItems
                .filter((item) => item.visible && !item.is_cta)
                .map((item) => (
                  <a
                    key={item.id}
                    href={item.target}
                    className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors py-0.5"
                  >
                    {item.label}
                  </a>
                ))}
            </div>
          </div>

          {/* Connect & Controls Col */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text)] font-semibold">
              Preferences & System
            </span>
            <div className="flex flex-col gap-2 pt-1 font-medium">
              {(onOpenWelcome || onReplayIntro) && (
                <button
                  onClick={() => {
                    if (onOpenWelcome) onOpenWelcome();
                    else if (onReplayIntro) onReplayIntro();
                  }}
                  className="flex items-center gap-2 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>View Welcome Banner</span>
                </button>
              )}

              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer text-left"
              >
                {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-[var(--accent)]" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                <span className="capitalize">Theme: {theme}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-medium">
          <div className="flex items-center gap-4">
            <p>© {currentYear} {settings.site_name}. All rights reserved.</p>
            {onOpenPrivacyModal && (
              <button
                onClick={onOpenPrivacyModal}
                className="underline hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
              >
                Privacy Notice
              </button>
            )}
          </div>

          <div className="flex items-center gap-6">
            {validSocials.length > 0 && (
              <div className="flex items-center gap-3">
                {validSocials.map((soc) => (
                  <a
                    key={soc.id}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    {soc.label}
                  </a>
                ))}
              </div>
            )}

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] hover:border-cyan-400 hover:bg-cyan-500/15 text-[var(--text)] hover:text-cyan-600 dark:hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
              title="Back to top"
              aria-label="Back to top of page"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
