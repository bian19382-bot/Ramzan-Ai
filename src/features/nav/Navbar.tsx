import React, { useEffect, useState } from 'react';
import { Menu, Sun, Moon, Search, Sparkles, Shield, Globe, FileText } from 'lucide-react';
import { NavItem, SocialLink } from '../../types/portfolio';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage, LanguageCode } from '../i18n/LanguageContext';
import { MobileMenu } from './MobileMenu';
import { MagneticWrapper } from '../../components/ui/MagneticWrapper';
import { BRAND_LOGO_URL, BRAND_LOGO_FALLBACK } from '../../assets/brandLogo';

interface NavbarProps {
  siteName: string;
  items: NavItem[];
  socials: SocialLink[];
  onOpenPalette?: () => void;
  onOpenAiConsultant?: () => void;
  onOpenWelcome?: () => void;
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  siteName,
  items,
  socials,
  onOpenPalette,
  onOpenAiConsultant,
  onOpenWelcome,
  onReplayIntro,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);

      // Simple scroll spy
      const sections = ['home', 'about', 'projects', 'services', 'experience', 'testimonials', 'faq', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(s);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const monogram = siteName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[1100px] z-40 transition-all duration-300 ${
          isScrolled ? 'py-1.5' : 'py-2.5'
        }`}
      >
        <div
          className={`glass-panel rounded-full px-5 py-2 flex items-center justify-between border border-[var(--border)] shadow-xl transition-all duration-300 ${
            isScrolled ? 'bg-[var(--surface)]/90 backdrop-blur-xl' : 'bg-[var(--surface)]/75 backdrop-blur-md'
          }`}
        >
          {/* Brand Monogram & Name */}
          <MagneticWrapper strength={0.2} cursorType="nav">
            <a
              href="#home"
              className="flex items-center gap-3 group focus:outline-none"
              aria-label={`${siteName} home`}
            >
              <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.35)] bg-black group-hover:border-cyan-400 group-hover:shadow-[0_0_18px_rgba(6,182,212,0.6)] group-hover:scale-105 transition-all flex items-center justify-center shrink-0">
                <img
                  src={BRAND_LOGO_URL}
                  onError={(e) => {
                    e.currentTarget.src = BRAND_LOGO_FALLBACK;
                  }}
                  alt="Ramzan Logo"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <span className="font-display font-semibold text-sm tracking-tight text-[var(--text)] hidden sm:inline">
                {siteName}
              </span>
            </a>
          </MagneticWrapper>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 text-xs lg:text-sm font-medium">
            {items
              .filter((item) => item.visible && !item.is_cta)
              .map((item) => {
                const targetKey = item.target.replace('#', '');
                const isActive = activeSection === targetKey;
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
                  <MagneticWrapper key={item.id} strength={0.28} cursorType="nav">
                    <a
                      href={item.target}
                      className={`px-3 py-1.5 rounded-full transition-all duration-200 relative block border border-transparent ${
                        isActive
                          ? 'text-[var(--accent-text)] font-bold bg-cyan-500/10 dark:bg-cyan-500/15 border-cyan-500/30'
                          : 'text-[var(--text-muted)] hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-cyan-500/10 dark:hover:bg-cyan-500/15 hover:border-cyan-500/30'
                      }`}
                    >
                      {label}
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-cyan-500 rounded-full shadow-[0_0_8px_#06b6d4]" />
                      )}
                    </a>
                  </MagneticWrapper>
                );
              })}
          </nav>

          {/* Right Controls & CTAs */}
          <div className="flex items-center gap-2">
            {/* AI Assistant button */}
            {onOpenAiConsultant && (
              <button
                onClick={onOpenAiConsultant}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 text-[var(--accent-text)] border border-[var(--accent)]/25 transition cursor-pointer"
                title="AI Scoping & Thinking Assistant"
                aria-label="Ask AI Assistant"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Scoping</span>
              </button>
            )}

            {/* Command Palette Trigger */}
            {onOpenPalette && (
              <button
                onClick={onOpenPalette}
                className="p-2 rounded-full hover:bg-cyan-500/10 dark:hover:bg-cyan-500/15 text-[var(--text-muted)] hover:text-cyan-600 dark:hover:text-cyan-300 border border-transparent hover:border-cyan-500/30 transition cursor-pointer"
                title="Search & Quick Actions (⌘K)"
                aria-label="Open Command Palette"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Admin Portal Direct Link */}
            <a
              href="/admin"
              className="px-2.5 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 transition flex items-center gap-1.5 text-xs font-mono font-medium shadow-sm hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer"
              title="Admin Studio Portal (Projects & Settings)"
              aria-label="Open Admin Studio Portal"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline font-semibold">Admin</span>
            </a>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-cyan-500/10 dark:hover:bg-cyan-500/15 text-[var(--text-muted)] hover:text-cyan-600 dark:hover:text-cyan-300 border border-transparent hover:border-cyan-500/30 transition cursor-pointer"
              aria-label={`Toggle theme (currently ${theme})`}
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="px-2.5 py-1.5 rounded-full hover:bg-cyan-500/10 dark:hover:bg-cyan-500/15 text-[var(--text-muted)] hover:text-cyan-600 dark:hover:text-cyan-300 border border-transparent hover:border-cyan-500/30 text-xs font-mono font-semibold flex items-center gap-1 transition cursor-pointer"
                title="Change language / زبان تبدیل کریں"
                aria-label="Change language"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-500" />
                <span className="uppercase">{language === 'ur' ? 'اردو' : language === 'ur-roman' ? 'ROM' : 'EN'}</span>
              </button>

              {langMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-32 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xl z-50 text-xs font-medium">
                    <button
                      onClick={() => {
                        setLanguage('en');
                        setLangMenuOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left hover:bg-cyan-500/10 dark:hover:bg-cyan-500/15 hover:text-cyan-600 dark:hover:text-cyan-300 transition flex items-center justify-between ${
                        language === 'en' ? 'text-[var(--accent-text)] font-bold' : 'text-[var(--text)]'
                      }`}
                    >
                      <span>English</span>
                      {language === 'en' && <span className="text-[10px]">✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('ur-roman');
                        setLangMenuOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left hover:bg-cyan-500/10 dark:hover:bg-cyan-500/15 hover:text-cyan-600 dark:hover:text-cyan-300 transition flex items-center justify-between ${
                        language === 'ur-roman' ? 'text-[var(--accent-text)] font-bold' : 'text-[var(--text)]'
                      }`}
                    >
                      <span>Roman Urdu</span>
                      {language === 'ur-roman' && <span className="text-[10px]">✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('ur');
                        setLangMenuOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left hover:bg-cyan-500/10 dark:hover:bg-cyan-500/15 hover:text-cyan-600 dark:hover:text-cyan-300 transition flex items-center justify-between font-urdu ${
                        language === 'ur' ? 'text-[var(--accent-text)] font-bold' : 'text-[var(--text)]'
                      }`}
                    >
                      <span>اردو</span>
                      {language === 'ur' && <span className="text-[10px]">✓</span>}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Resume Link */}
            <MagneticWrapper strength={0.25} cursorType="nav" className="hidden lg:inline-block">
              <a
                href="/resume"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[var(--text-muted)] hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-cyan-500/10 dark:hover:bg-cyan-500/15 border border-transparent hover:border-cyan-500/30 transition"
                title="View & Print Resume"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Resume</span>
              </a>
            </MagneticWrapper>

            {/* Primary Action Button */}
            <MagneticWrapper strength={0.32} cursorType="button" className="hidden sm:inline-block">
              <a
                href="#contact"
                className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--accent)] hover:brightness-110 active:scale-95 text-white font-medium text-xs lg:text-sm shadow-md transition"
              >
                {t('navCta')}
              </a>
            </MagneticWrapper>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-full hover:bg-cyan-500/10 dark:hover:bg-cyan-500/15 text-[var(--text)] transition cursor-pointer border border-transparent hover:border-cyan-500/30"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        items={items}
        socials={socials}
        onOpenWelcome={onOpenWelcome || onReplayIntro}
        onOpenPalette={onOpenPalette}
        onOpenAiConsultant={onOpenAiConsultant}
      />
    </>
  );
};
