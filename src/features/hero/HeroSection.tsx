import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import {
  ArrowDown,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Mail,
  MessageCircle,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Terminal,
} from 'lucide-react';
import { Profile, SocialLink, SiteSettings } from '../../types/portfolio';
import { AmbientCanvas } from './AmbientCanvas';
import { useLanguage } from '../i18n/LanguageContext';
import { MagneticWrapper } from '../../components/ui/MagneticWrapper';
import { soundFx } from '../../lib/soundFx';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursorChar?: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 28,
  delay = 80,
  className = '',
  cursorChar = '▋',
}) => {
  const [displayed, setDisplayed] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayed('');
    setIsTyping(true);
    let index = 0;
    let intervalId: ReturnType<typeof setInterval>;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        if (index < text.length) {
          setDisplayed(text.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(intervalId);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, delay]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>{displayed}</span>
      <span
        className={`ml-0.5 text-cyan-400 font-mono transition-opacity duration-150 ${
          isTyping ? 'opacity-100 animate-pulse' : 'opacity-40 animate-pulse'
        }`}
      >
        {cursorChar}
      </span>
    </span>
  );
};

export type BannerAnimationType = 'fade-in' | 'pop-jump' | 'mosque-door';

interface HeroBannerItem {
  id: string;
  url: string;
  title: string;
  titleRoman: string;
  category: string;
  categoryRoman: string;
  alt: string;
  animationType: BannerAnimationType;
  animationLabel: string;
  animationLabelRoman: string;
}

const HERO_BANNERS: HeroBannerItem[] = [
  {
    id: 'banner-ai-creator',
    url: '/assets/aistudio/AI-Powered_Digital_Professional_Banner_5eadb61b.png',
    title: 'AI Creator & Digital Professional',
    titleRoman: 'AI Creator aur Digital Professional',
    category: 'AI & DIGITAL CREATIVE WORKFLOWS',
    categoryRoman: 'AI AUR MODERN DIGITAL WORKFLOWS',
    alt: "Welcome - I'm Ramzan, AI Creator & Digital Professional - Web Development",
    animationType: 'fade-in',
    animationLabel: 'Fade In',
    animationLabelRoman: 'Fade In',
  },
  {
    id: 'banner-web-dev',
    url: '/assets/aistudio/Futuristic_Web_Development_Showcase_0fb0ba38.png',
    title: 'Modern Web Development & Solutions',
    titleRoman: 'Modern Web Development aur Creative Websites',
    category: 'FULL-STACK & RESPONSIVE DESIGN',
    categoryRoman: 'RESPONSIVE DESIGN AUR FAST PERFORMANCE',
    alt: "Ramzan Web Development - Modern Websites & Creative Digital Solutions",
    animationType: 'pop-jump',
    animationLabel: 'Pop & Jump',
    animationLabelRoman: 'Pop & Jump',
  },
  {
    id: 'banner-portfolio',
    url: '/assets/aistudio/Neon_Portfolio_Showcase_Banner_6ba44114.png',
    title: 'Projects & Interactive Portfolio',
    titleRoman: 'Real Projects aur Live Portfolio Showcase',
    category: 'LIVE DEMOS & CASE STUDIES',
    categoryRoman: 'CHALTE HUYE PROJECTS AUR DEMOS',
    alt: "Ramzan Projects & Portfolio - Creative Ideas & Digital Experiences",
    animationType: 'mosque-door',
    animationLabel: 'Mosque Door 3D',
    animationLabelRoman: 'Mosque Door 3D',
  },
];

const bannerAnimationVariants: Record<BannerAnimationType, Variants> = {
  'fade-in': {
    initial: {
      opacity: 0,
      scale: 0.96,
      filter: 'blur(10px) brightness(1.2)',
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px) brightness(1)',
      transition: {
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      scale: 1.02,
      filter: 'blur(8px)',
      transition: {
        duration: 0.45,
        ease: [0.4, 0, 1, 1] as const,
      },
    },
  },
  'pop-jump': {
    initial: {
      scale: 0.58,
      y: 80,
      opacity: 0,
      filter: 'blur(8px) brightness(1.5)',
    },
    animate: {
      scale: [0.58, 1.12, 0.95, 1.02, 1],
      y: [80, -28, 10, -3, 0],
      opacity: [0, 1, 1, 1, 1],
      filter: [
        'blur(8px) brightness(1.5)',
        'blur(0px) brightness(1.25)',
        'blur(0px) brightness(1)',
        'blur(0px) brightness(1)',
        'blur(0px) brightness(1)',
      ],
      transition: {
        duration: 0.8,
        times: [0, 0.42, 0.68, 0.86, 1],
        ease: [0.34, 1.56, 0.64, 1] as const,
      },
    },
    exit: {
      scale: [1, 1.06, 0.68],
      y: [0, -14, -80],
      opacity: [1, 0.85, 0],
      filter: 'blur(8px)',
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  },
  'mosque-door': {
    initial: {
      opacity: 0,
      rotateY: -72,
      transformPerspective: 1200,
      transformOrigin: 'left center',
      scale: 0.88,
      filter: 'blur(8px) brightness(0.65)',
    },
    animate: {
      opacity: 1,
      rotateY: 0,
      transformPerspective: 1200,
      transformOrigin: 'left center',
      scale: 1,
      filter: 'blur(0px) brightness(1)',
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      rotateY: 65,
      transformPerspective: 1200,
      transformOrigin: 'right center',
      scale: 0.88,
      filter: 'blur(8px)',
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 1, 1] as const,
      },
    },
  },
};

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

  // Banner rotation state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-advance with smooth fade every 4.5 seconds
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentBanner = HERO_BANNERS[currentIndex];

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playButtonClick();
    setIsPlaying((prev) => !prev);
  };

  const handlePrevBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length);
  };

  const handleNextBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % HERO_BANNERS.length);
  };

  const handleSelectBanner = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

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

        {/* Centerpiece: 3-Banner Dynamic Fade Showcase with Stop/Play Control */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden p-1 sm:p-1.5 bg-gradient-to-r from-cyan-500/50 via-purple-500/40 to-blue-600/50 border border-cyan-400/50 shadow-[0_0_70px_rgba(6,182,212,0.3)] group cursor-pointer"
          onClick={handleScrollToProjects}
        >
          {/* Subtle outer animated glow aura */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-blue-500/30 blur-2xl opacity-75 group-hover:opacity-100 transition duration-500 pointer-events-none" />

          <div className="relative rounded-[18px] sm:rounded-[22px] overflow-hidden bg-black aspect-[16/9] w-full flex items-center justify-center cyber-scanline select-none">
            {/* Cyber HUD Corner Brackets */}
            <span className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400 z-30 pointer-events-none" />
            <span className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400 z-30 pointer-events-none" />
            <span className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400 z-30 pointer-events-none" />
            <span className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400 z-30 pointer-events-none" />

            {/* Top Right: Keep ONLY the Stop / Play Toggle Button on the banner */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30">
              <button
                type="button"
                onClick={handleTogglePlay}
                className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full backdrop-blur-md border font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg active:scale-95 ${
                  isPlaying
                    ? 'bg-black/85 border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                    : 'bg-amber-500/25 border-amber-400/80 text-amber-200 hover:bg-amber-500/35 hover:border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                }`}
                title={
                  isPlaying
                    ? 'Banner ko stop / pause karein'
                    : 'Banner ko dobara chalaein / resume karein'
                }
                aria-label={
                  isPlaying
                    ? 'Stop banner rotation'
                    : 'Play banner rotation'
                }
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                    <span>{isRoman ? 'Stop Karein' : 'Stop Slide'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                    <span>{isRoman ? 'Chalaein' : 'Resume Slide'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Dynamic Per-Banner Animated Display (Banner 1: Fade In | Banner 2: Pop & Jump | Banner 3: Mosque Door 3D) */}
            <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center [perspective:1400px]">
              <AnimatePresence initial={false} mode="wait">
                <motion.img
                  key={currentBanner.id}
                  src={currentBanner.url}
                  alt={currentBanner.alt}
                  variants={bannerAnimationVariants[currentBanner.animationType]}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  fetchPriority="high"
                  className="absolute inset-0 w-full h-full object-contain sm:object-cover drop-shadow-2xl"
                />
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Futuristic Telemetry HUD Strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4"
        >
          <div className="px-3 py-2 rounded-xl bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] dark:border-cyan-500/25 hover:border-cyan-400 dark:hover:border-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center justify-center gap-2 text-[11px] font-mono text-[var(--text-muted)] font-medium shadow-sm transition-all cursor-default">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
            <span>CORE // WEB DEV</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] dark:border-cyan-500/25 hover:border-cyan-400 dark:hover:border-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center justify-center gap-2 text-[11px] font-mono text-[var(--text-muted)] font-medium shadow-sm transition-all cursor-default">
            <Sparkles className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
            <span>AI ASSISTED</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] dark:border-cyan-500/25 hover:border-cyan-400 dark:hover:border-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center justify-center gap-2 text-[11px] font-mono text-[var(--text-muted)] font-medium shadow-sm transition-all cursor-default">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400" />
            <span>DIRECT CHANNELS</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] dark:border-cyan-500/25 hover:border-cyan-400 dark:hover:border-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center justify-center gap-2 text-[11px] font-mono text-[var(--text-muted)] font-medium shadow-sm transition-all cursor-default">
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
              className="px-7 py-3 rounded-full bg-[var(--surface)] hover:bg-cyan-500/10 dark:hover:bg-cyan-500/15 border border-[var(--border)] hover:border-cyan-400 text-[var(--text)] hover:text-cyan-600 dark:hover:text-cyan-300 font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
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
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--surface-2)] hover:bg-cyan-500/10 hover:border-cyan-400 text-[var(--text)] hover:text-cyan-700 dark:hover:text-cyan-300 hover:shadow-[0_0_12px_rgba(6,182,212,0.25)] transition border border-[var(--border)] font-mono text-xs"
          >
            <Mail className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>{settings.contact_email}</span>
          </a>
          <a
            href={`https://wa.me/92${settings.whatsapp_number.replace(/\D/g, '').replace(/^0/, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--surface-2)] hover:bg-emerald-500/10 hover:border-emerald-500 text-[var(--text)] hover:text-emerald-700 dark:hover:text-emerald-300 hover:shadow-[0_0_12px_rgba(16,185,129,0.25)] transition border border-[var(--border)] font-mono text-xs"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>WhatsApp: {settings.whatsapp_number}</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
