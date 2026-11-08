import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowUpRight, Sparkles, Terminal, ShieldCheck } from 'lucide-react';
import { Profile, SocialLink, SiteSettings } from '../../types/portfolio';
import { useLanguage } from '../i18n/LanguageContext';
import { letterContainer, letterVariant, cinematicFadeUp, safeViewport } from '../../lib/cinematicMotion';
import { HoloScanImage } from '../../components/ui/HoloScanImage';

interface HeroSectionProps {
  profile: Profile;
  settings: SiteSettings;
  socials: SocialLink[];
  onOpenAiConsultant?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  profile,
  settings,
  onOpenAiConsultant,
}) => {
  const { language } = useLanguage();
  const isRoman = language === 'ur-roman';

  // Desktop pointer bloom
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width) * 100;
    const y = ((clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  // Scroll parallax for cinematic depth
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0.2]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 0.96]);
  const photoY = useTransform(scrollY, [0, 600], [0, 80]);

  // Master headline letters
  const headlineLetters = 'RAMZAN'.split('');

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 px-5 sm:px-8 lg:px-12 bg-[#070709] text-[#F3F4F6] overflow-hidden select-none"
    >
      {/* Cinematic Deep Background Atmospherics */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Fine Technical Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '4rem 4rem',
          }}
        />

        {/* Ambient Electric Violet & Cyan Bloom on Desktop */}
        <div
          className="absolute inset-0 transition-opacity duration-500 opacity-60 hidden md:block"
          style={{
            background: `radial-gradient(750px circle at ${mousePos.x}% ${mousePos.y}%, rgba(56, 189, 248, 0.12), rgba(124, 92, 255, 0.08) 40%, transparent 80%)`,
          }}
        />

        {/* Top Vignette Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-gradient-to-b from-cyan-500/10 via-violet-500/5 to-transparent blur-3xl" />
      </div>

      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="max-w-[1320px] w-full mx-auto relative z-10 flex-1 flex flex-col justify-center"
      >
        {/* Top Telemetry Strip */}
        <motion.div
          variants={cinematicFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={safeViewport}
          className="mb-8 pt-4 flex flex-wrap items-center justify-between gap-3 text-[10px] sm:text-[11px] font-mono tracking-widest text-[#71717A] border-b border-white/5 pb-4"
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>FILE 001 // RAMZAN</span>
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden sm:inline">IDENTITY: DIGITAL CREATOR</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>STATUS: OPEN TO OPPORTUNITIES</span>
            </span>
            <span className="hidden md:inline text-white/20">|</span>
            <span className="hidden md:inline">SPEC: WEB DEVELOPMENT</span>
          </div>
        </motion.div>

        {/* Main Grid: Left Cinematic Typography, Right Welcome Banner Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center py-4">
          {/* Left Column (7 cols): Massive Oversized Typography */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <motion.div
                variants={cinematicFadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={safeViewport}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.04] border border-white/10 text-xs font-mono text-cyan-300 tracking-wider"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isRoman ? 'ALTER EGO // DIGITAL PROFILE' : 'ALTER EGO // DIGITAL PROFILE'}</span>
              </motion.div>

              {/* Master Headline: RAMZAN in Big Shoulders / Space Grotesk */}
              <motion.h1
                variants={letterContainer}
                initial="hidden"
                whileInView="visible"
                viewport={safeViewport}
                className="font-cinematic text-7xl sm:text-8xl md:text-9xl xl:text-[10.5rem] font-black text-white tracking-tighter leading-[0.88] select-none uppercase overflow-hidden"
              >
                {headlineLetters.map((char, index) => (
                  <motion.span
                    key={index}
                    variants={letterVariant}
                    className="inline-block hover:text-cyan-400 transition-colors duration-200"
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.h1>

              {/* Subtitle: AI Creator & Digital Professional */}
              <motion.div
                variants={cinematicFadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={safeViewport}
                custom={2}
                className="pt-2"
              >
                <p className="text-xl sm:text-2xl md:text-3xl font-display font-medium text-white/90 tracking-tight">
                  {isRoman ? 'AI Creator aur Web Developer' : 'AI Creator & Digital Professional'}
                </p>
                <p className="text-xs sm:text-sm font-mono text-cyan-400/90 tracking-wide mt-1">
                  // SPECIALIZING IN MODERN WEB DEVELOPMENT & WORKFLOWS
                </p>
              </motion.div>
            </div>

            {/* Authentic Narrative Intro */}
            <motion.p
              variants={cinematicFadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={safeViewport}
              custom={3}
              className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-xl font-sans"
            >
              {isRoman
                ? 'Main AI tools aur modern web technologies ki madad se digital experiences banata hoon. Practical projects par kaam kar ke seekh raha hoon aur unique web solutions create karta hoon.'
                : 'Learning and crafting modern digital experiences through AI-assisted workflows and web engineering. Exploring ideas, building practical projects, and turning vision into functioning websites.'}
            </motion.p>

            {/* Quick CTAs */}
            <motion.div
              variants={cinematicFadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={safeViewport}
              custom={4}
              className="pt-4 flex flex-wrap items-center gap-4"
            >
              <a
                href="#projects"
                className="px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-xs sm:text-sm tracking-wider uppercase hover:bg-cyan-300 active:scale-98 transition-all duration-200 flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                <span>{isRoman ? 'Mission Files Dekhein' : 'Explore Mission Files'}</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="px-6 py-3.5 rounded-xl bg-white/[0.05] border border-white/15 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase hover:border-cyan-400 hover:bg-cyan-500/10 active:scale-98 transition-all duration-200 flex items-center gap-2"
              >
                <span>{isRoman ? 'Signal Bhejein' : 'Send The Signal'}</span>
                <ArrowUpRight className="w-4 h-4 text-cyan-400" />
              </a>

              {onOpenAiConsultant && (
                <button
                  type="button"
                  onClick={onOpenAiConsultant}
                  className="px-4 py-3.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300 hover:text-white hover:bg-violet-500/20 text-xs font-mono tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                  title="Ask AI Project Consultant"
                >
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  <span>AI ARCHITECT</span>
                </button>
              )}
            </motion.div>
          </div>

          {/* Right Column (5 cols): Developer Workstation Portrait Photo with Holographic Scan */}
          <div className="lg:col-span-5 relative">
            <motion.div
              style={{ y: photoY }}
              variants={cinematicFadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={safeViewport}
              custom={2}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Outer HUD Telemetry Frame */}
              <div className="relative p-2 rounded-3xl bg-gradient-to-b from-white/10 via-white/5 to-white/0 border border-white/10 shadow-2xl">
                {/* Developer Workstation Portrait Photo with Alter Ego Holographic Scan */}
                <HoloScanImage
                  src="/assets/aistudio/Thoughtful_Developer_at_Workstation_c68f193a.png"
                  alt="Ramzan - AI Creator & Web Developer"
                  aspectRatio="aspect-[4/5] sm:aspect-[4/5]"
                  telemetryLabel="SPEC // RAMZAN_PORTRAIT_001"
                  className="shadow-2xl"
                />

                {/* Sub-card Telemetry Data Bar */}
                <div className="mt-3 px-3 py-2.5 rounded-xl bg-black/60 border border-white/5 flex items-center justify-between text-[10px] font-mono text-[#A1A1AA]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>SYS // AUTHENTIC_IDENTITY</span>
                  </div>
                  <span className="text-cyan-400/90 font-semibold tracking-wider">PAKISTAN (GMT+5)</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Scroll-To-Explore Indicator */}
      <motion.div
        variants={cinematicFadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={safeViewport}
        custom={5}
        className="max-w-[1320px] w-full mx-auto relative z-10 pt-8 flex items-center justify-between border-t border-white/5 text-[10px] font-mono text-[#71717A]"
      >
        <span className="tracking-widest uppercase">
          {isRoman ? 'NICHE SCROLL KAREIN // PERSPECTIVE' : 'SCROLL TO EXPLORE // 3D PERSPECTIVE'}
        </span>

        <div className="flex items-center gap-2">
          <span className="w-1 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-transparent animate-pulse" />
          <span className="text-white/40">NEXT: ORIGIN STORY</span>
        </div>
      </motion.div>
    </section>
  );
};
