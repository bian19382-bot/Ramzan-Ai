import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { X, ArrowDown, Sparkles, Play, Pause, ChevronLeft, ChevronRight, Terminal } from 'lucide-react';
import { Profile } from '../../types/portfolio';
import { safeStorage } from '../../lib/storage';

const STORAGE_WELCOME_DISMISSED = 'portfolio_welcome_banner_dismissed';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 28,
  delay = 80,
  className = '',
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
        className={`ml-0.5 text-cyan-400 font-mono ${
          isTyping ? 'opacity-100 animate-pulse' : 'opacity-40 animate-pulse'
        }`}
      >
        ▋
      </span>
    </span>
  );
};

interface WelcomePhotoBannerProps {
  profile: Profile;
  onDismiss: () => void;
  isOpen: boolean;
}

type WelcomeAnimationType = 'fade-in' | 'pop-jump' | 'mosque-door';

interface WelcomeBannerItem {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  alt: string;
  animationType: WelcomeAnimationType;
  animationLabel: string;
}

const WELCOME_BANNERS: WelcomeBannerItem[] = [
  {
    id: 'welcome-banner-1',
    url: '/assets/aistudio/AI-Powered_Digital_Professional_Banner_5eadb61b.png',
    title: 'AI Creator & Digital Professional',
    subtitle: 'Building modern digital experiences with AI-powered creativity',
    alt: "Welcome - I'm Ramzan, AI Creator & Digital Professional",
    animationType: 'fade-in',
    animationLabel: 'Fade In',
  },
  {
    id: 'welcome-banner-2',
    url: '/assets/aistudio/Futuristic_Web_Development_Showcase_0fb0ba38.png',
    title: 'Web Development & Solutions',
    subtitle: 'Modern Websites. Creative Digital Solutions. Responsive Design.',
    alt: 'Ramzan - Web Development - Modern Websites & Digital Solutions',
    animationType: 'pop-jump',
    animationLabel: 'Pop & Jump',
  },
  {
    id: 'welcome-banner-3',
    url: '/assets/aistudio/Neon_Portfolio_Showcase_Banner_6ba44114.png',
    title: 'Projects & Interactive Portfolio',
    subtitle: 'Explore My Web Development Work & Case Studies',
    alt: 'Ramzan - Projects & Portfolio Showcase',
    animationType: 'mosque-door',
    animationLabel: 'Mosque Door 3D',
  },
];

const welcomeAnimationVariants: Record<WelcomeAnimationType, Variants> = {
  'fade-in': {
    initial: {
      opacity: 0,
      scale: 0.96,
      filter: 'blur(8px) brightness(1.2)',
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
      filter: 'blur(6px)',
      transition: {
        duration: 0.45,
        ease: [0.4, 0, 1, 1] as const,
      },
    },
  },
  'pop-jump': {
    initial: {
      scale: 0.6,
      y: 70,
      opacity: 0,
      filter: 'blur(8px) brightness(1.5)',
    },
    animate: {
      scale: [0.6, 1.1, 0.96, 1.02, 1],
      y: [70, -24, 8, -2, 0],
      opacity: [0, 1, 1, 1, 1],
      filter: [
        'blur(8px) brightness(1.5)',
        'blur(0px) brightness(1.2)',
        'blur(0px) brightness(1)',
        'blur(0px) brightness(1)',
        'blur(0px) brightness(1)',
      ],
      transition: {
        duration: 0.78,
        times: [0, 0.42, 0.68, 0.86, 1],
        ease: [0.34, 1.56, 0.64, 1] as const,
      },
    },
    exit: {
      scale: [1, 1.06, 0.7],
      y: [0, -12, -70],
      opacity: [1, 0.85, 0],
      filter: 'blur(6px)',
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

export const WelcomePhotoBanner: React.FC<WelcomePhotoBannerProps> = ({
  profile,
  onDismiss,
  isOpen,
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % WELCOME_BANNERS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  const currentBanner = WELCOME_BANNERS[currentIndex];

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying((prev) => !prev);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + WELCOME_BANNERS.length) % WELCOME_BANNERS.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % WELCOME_BANNERS.length);
  };

  const handleSelectBanner = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

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
            <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-black/60 border-b border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-cyan-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-[11px] uppercase tracking-widest font-mono font-semibold text-cyan-300">
                  Featured Showcase [{currentIndex + 1}/{WELCOME_BANNERS.length}]
                </span>
                <span className="text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-400/40 text-[9px] uppercase tracking-wider font-bold hidden xs:inline shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                  {currentBanner.animationLabel}
                </span>
                <span className="text-white/30 hidden sm:inline">•</span>
                <span className="text-xs text-white/70 hidden sm:inline">
                  {profile.full_name} — AI Creator & Web Developer
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Stop / Play Button */}
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono flex items-center gap-1 transition cursor-pointer border ${
                    isPlaying
                      ? 'bg-black/60 border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/20'
                      : 'bg-amber-500/20 border-amber-400/80 text-amber-200 hover:bg-amber-500/30 animate-pulse'
                  }`}
                  title={isPlaying ? 'Stop banner auto-play' : 'Resume banner auto-play'}
                  aria-label={isPlaying ? 'Stop banner auto-play' : 'Resume banner auto-play'}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>Play</span>
                    </>
                  )}
                </button>

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

            {/* Banner Media Showcase with Per-Banner Animations (Banner 1: Fade In | Banner 2: Pop & Jump | Banner 3: Mosque Door 3D) */}
            <div className="relative group cursor-pointer overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-black/90 [perspective:1400px]" onClick={handleExplore}>
              <AnimatePresence initial={false} mode="wait">
                <motion.img
                  key={currentBanner.id}
                  src={currentBanner.url}
                  alt={currentBanner.alt}
                  variants={welcomeAnimationVariants[currentBanner.animationType]}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute inset-0 w-full h-full object-contain sm:object-cover drop-shadow-2xl"
                />
              </AnimatePresence>

              {/* Prev / Next Navigation Arrows */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-cyan-500/30 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Previous banner"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-cyan-500/30 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Next banner"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dot Indicators */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/70 px-2.5 py-1 rounded-full border border-white/10">
                {WELCOME_BANNERS.map((b, idx) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={(e) => handleSelectBanner(idx, e)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentIndex
                        ? 'w-5 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                        : 'w-1.5 bg-white/40 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Bottom Quick-Action Bar */}
              <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col sm:flex-row items-center justify-between gap-3 z-20">
                <div className="text-left w-full sm:w-auto">
                  <p className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
                    Portfolio • AI Creator & Web Developer
                  </p>
                  <TypewriterText
                    key={`wb-title-${currentBanner.id}`}
                    text={currentBanner.title}
                    speed={20}
                    delay={100}
                    className="text-sm sm:text-base font-bold text-white tracking-tight mt-0.5 block"
                  />
                  <TypewriterText
                    key={`wb-sub-${currentBanner.id}`}
                    text={currentBanner.subtitle}
                    speed={16}
                    delay={300}
                    className="text-xs text-zinc-300 mt-0.5 hidden xs:block"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExplore();
                    }}
                    className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm shadow-[0_0_20px_rgba(6,182,212,0.5)] transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
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
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/15 transition cursor-pointer shrink-0"
                  >
                    Enter Site
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
