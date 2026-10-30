import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, ArrowUpRight, Sparkles, ShieldCheck, Mail, MessageCircle } from 'lucide-react';
import { Profile, SocialLink, SiteSettings } from '../../types/portfolio';
import { AmbientCanvas } from './AmbientCanvas';
import { useLanguage } from '../i18n/LanguageContext';
import { MagneticWrapper } from '../../components/ui/MagneticWrapper';

interface HeroSectionProps {
  profile: Profile;
  settings: SiteSettings;
  socials: SocialLink[];
  onOpenAiConsultant?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  profile,
  settings,
  socials,
  onOpenAiConsultant,
}) => {
  const { language, t } = useLanguage();
  const isRoman = language === 'ur-roman';

  const bannerUrl =
    profile.welcome_banner_url ||
    '/assets/aistudio/Neon_Portfolio_Hero__Welcome__I_m_Ramzan_85351036.png';

  const handleScrollToProjects = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const target = document.getElementById('projects');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToContact = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const target = document.getElementById('contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Interactive 60FPS Ambient Particle / Constellation Canvas */}
      <AmbientCanvas />

      {/* Cyber ambient glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-600/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/3 translate-y-1/3 w-80 h-80 bg-purple-600/15 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-[1180px] w-full mx-auto relative z-10 flex flex-col items-center text-center">
        {/* Availability Pill */}
        {settings.availability_enabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--surface)]/80 border border-cyan-500/30 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-medium text-cyan-300 tracking-wide">
              {t('heroAvailable')}
            </span>
          </motion.div>
        )}

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-xs sm:text-sm font-mono uppercase tracking-widest text-cyan-400 font-semibold mb-3"
        >
          {t('heroEyebrow')}
        </motion.p>

        {/* Centerpiece: Official Neon Welcome Banner with Cyber Scanline & HUD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden p-1 sm:p-1.5 bg-gradient-to-r from-cyan-500/50 via-purple-500/40 to-blue-600/50 border border-cyan-400/50 shadow-[0_0_70px_rgba(6,182,212,0.3)] group cursor-pointer"
          onClick={handleScrollToProjects}
        >
          {/* Subtle outer animated glow aura */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-blue-500/30 blur-2xl opacity-75 group-hover:opacity-100 transition duration-500 pointer-events-none" />

          <div className="relative rounded-[18px] sm:rounded-[22px] overflow-hidden bg-black aspect-[16/9] w-full flex items-center justify-center cyber-scanline">
            {/* Cyber HUD Corner Brackets */}
            <span className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400 z-30 pointer-events-none" />
            <span className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400 z-30 pointer-events-none" />
            <span className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400 z-30 pointer-events-none" />
            <span className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400 z-30 pointer-events-none" />

            {/* Top Verified Badge */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-cyan-400/40 text-[10px] sm:text-xs font-mono text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isRoman ? 'Asal Portfolio Showcase' : 'Official Portfolio Showcase'}</span>
            </div>

            {/* Neon Banner Image */}
            <img
              src={bannerUrl}
              alt="Welcome - I'm Ramzan, AI Creator & Digital Professional"
              fetchPriority="high"
              className="w-full h-full object-contain sm:object-cover transition-transform duration-700 group-hover:scale-[1.01]"
            />

            {/* Interactive click hotspot for "Explore My Work" inside graphic */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleScrollToProjects();
              }}
              className="absolute left-[5%] bottom-[12%] sm:bottom-[16%] opacity-0 sm:opacity-100 px-6 py-2.5 rounded-xl bg-transparent hover:bg-cyan-500/20 border border-transparent hover:border-cyan-400/50 transition cursor-pointer"
              title={t('heroExploreCta')}
              aria-label={t('heroExploreCta')}
            />
          </div>
        </motion.div>

        {/* Futuristic Telemetry HUD Strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4"
        >
          <div className="px-3 py-2 rounded-xl bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] dark:border-cyan-500/25 flex items-center justify-center gap-2 text-[11px] font-mono text-[var(--text-muted)] font-medium shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
            <span>CORE // WEB DEV</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] dark:border-cyan-500/25 flex items-center justify-center gap-2 text-[11px] font-mono text-[var(--text-muted)] font-medium shadow-sm">
            <Sparkles className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
            <span>AI ASSISTED</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] dark:border-cyan-500/25 flex items-center justify-center gap-2 text-[11px] font-mono text-[var(--text-muted)] font-medium shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400" />
            <span>DIRECT CHANNELS</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] dark:border-cyan-500/25 flex items-center justify-center gap-2 text-[11px] font-mono text-[var(--text-muted)] font-medium shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400" />
            <span>PORTFOLIO ACTIVE</span>
          </div>
        </motion.div>

        {/* Value Proposition & Supporting Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 max-w-2xl space-y-3"
        >
          <p className="text-base sm:text-lg text-[var(--text)] leading-relaxed font-normal">
            {isRoman
              ? 'Main AI tools ki madad se modern websites banana seekh raha hoon aur practical projects par kaam karta hoon. Mujhe ideas ko website projects mein badalna, naye workflows explore karna aur hands-on practice se apni skills behtar banana pasand hai.'
              : "I'm learning and building modern web experiences with the help of AI tools. I enjoy turning ideas into practical website projects, exploring new workflows, and improving my skills through hands-on work."}
          </p>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-mono">
            {isRoman
              ? 'Filhal seekh raha hoon, bana raha hoon, aur har project ke saath apni skills behtar kar raha hoon.'
              : 'Currently learning, creating, and building practical projects—one step at a time.'}
          </p>
        </motion.div>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-7"
        >
          <MagneticWrapper strength={0.3} cursorType="button">
            <button
              type="button"
              onClick={handleScrollToProjects}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] transition flex items-center gap-2 cursor-pointer"
            >
              <span>{t('heroExploreCta')}</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>
          </MagneticWrapper>

          <MagneticWrapper strength={0.3} cursorType="button">
            <button
              type="button"
              onClick={handleScrollToContact}
              className="px-7 py-3 rounded-full bg-[var(--surface-2)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--text)] font-semibold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer"
            >
              <span>{t('heroContactCta')}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </MagneticWrapper>

          {onOpenAiConsultant && (
            <MagneticWrapper strength={0.25} cursorType="button">
              <button
                type="button"
                onClick={onOpenAiConsultant}
                className="px-5 py-3 rounded-full bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 text-[var(--accent-text)] border border-[var(--accent)]/30 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                <span>{t('heroAiScopingCta')}</span>
              </button>
            </MagneticWrapper>
          )}
        </motion.div>

        {/* Real Contact Channels (Email & WhatsApp - No Empty Fake Socials) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-8 pt-6 border-t border-[var(--border)]/60 text-xs"
        >
          <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-mono mr-1">
            {t('connectLabel')}
          </span>
          <a
            href={`mailto:${settings.contact_email}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--surface-2)] hover:bg-cyan-500/10 hover:border-cyan-500/40 text-[var(--text)] hover:text-cyan-300 transition border border-[var(--border)] font-mono text-xs"
          >
            <Mail className="w-3.5 h-3.5 text-cyan-400" />
            <span>{settings.contact_email}</span>
          </a>
          <a
            href={`https://wa.me/92${settings.whatsapp_number.replace(/\D/g, '').replace(/^0/, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--surface-2)] hover:bg-emerald-500/10 hover:border-emerald-500/40 text-[var(--text)] hover:text-emerald-300 transition border border-[var(--border)] font-mono text-xs"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp: {settings.whatsapp_number}</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
