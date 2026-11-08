import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, RotateCcw, Shield, Sun, Moon, Mail, MessageCircle, Terminal } from 'lucide-react';
import { SiteSettings, SocialLink, NavItem } from '../../types/portfolio';
import { useTheme } from '../theme/ThemeContext';
import { BRAND_LOGO_URL, BRAND_LOGO_FALLBACK } from '../../assets/brandLogo';

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
    <footer className="pt-20 pb-12 px-5 sm:px-8 lg:px-12 border-t border-white/5 bg-[#050608] text-[#A1A1AA] text-xs select-none">
      <div className="max-w-[1320px] w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(56,189,248,0.2)] bg-black shrink-0">
                <img
                  src={BRAND_LOGO_URL}
                  onError={(e) => {
                    e.currentTarget.src = BRAND_LOGO_FALLBACK;
                  }}
                  alt="Ramzan Logo"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div>
                <h3 className="font-cinematic text-2xl font-black text-white tracking-wider uppercase glitch-hover transition-all">
                  {settings.site_name}
                </h3>
                <p className="text-[11px] font-mono text-cyan-400 font-semibold tracking-wider">
                  ALTER EGO // DIGITAL STUDIO
                </p>
              </div>
            </div>

            <p className="max-w-sm leading-relaxed text-xs sm:text-sm text-[#71717A] font-sans">
              Crafting modern digital experiences through AI-assisted workflows and web engineering.
            </p>

            {/* Developed with GTS Credit */}
            <div className="pt-2 text-[11px] font-mono text-[#A1A1AA] flex items-center gap-2 flex-wrap">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>
                Developed with <strong className="font-semibold text-white">GTS — GenTech Studio</strong> | Founder: <strong className="font-semibold text-white">Hamza Rizwan</strong>
              </span>
            </div>

            <div className="pt-2 flex flex-col gap-2 text-xs font-mono">
              <a href={`mailto:${settings.contact_email}`} className="hover:text-cyan-400 transition-colors flex items-center gap-2 text-[#CBD5E1]">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>{settings.contact_email}</span>
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-2 text-[#CBD5E1]">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp: {settings.whatsapp_number}</span>
              </a>
            </div>
          </div>

          {/* Links Col */}
          <div className="md:col-span-4 space-y-3 font-mono">
            <span className="text-[11px] uppercase tracking-widest text-white font-semibold">
              // NAVIGATION CHANNELS
            </span>
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
              {navItems
                .filter((item) => item.visible && !item.is_cta)
                .map((item) => (
                  <a
                    key={item.id}
                    href={item.target}
                    className="hover:text-cyan-400 transition-colors py-0.5"
                  >
                    {item.label}
                  </a>
                ))}
            </div>
          </div>

          {/* Connect & Controls Col */}
          <div className="md:col-span-3 space-y-3 font-mono">
            <span className="text-[11px] uppercase tracking-widest text-white font-semibold">
              // TELEMETRY & SYSTEM
            </span>
            <div className="flex flex-col gap-2.5 pt-1 text-xs">
              {onOpenWelcome && (
                <button
                  onClick={onOpenWelcome}
                  className="flex items-center gap-2 hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View Welcome Banner</span>
                </button>
              )}

              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 hover:text-cyan-400 transition-colors cursor-pointer text-left"
              >
                {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-cyan-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                <span className="capitalize">Theme: {theme}</span>
              </button>

              <Link
                to="/admin"
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer text-left font-semibold"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Studio Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#71717A]">
          <div className="flex items-center gap-4">
            <p>© {currentYear} {settings.site_name}. All rights reserved.</p>
            {onOpenPrivacyModal && (
              <button
                onClick={onOpenPrivacyModal}
                className="underline hover:text-cyan-400 transition-colors cursor-pointer"
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
                    className="hover:text-cyan-400 transition-colors"
                  >
                    {soc.label}
                  </a>
                ))}
              </div>
            )}

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-white hover:text-cyan-400 transition cursor-pointer"
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
