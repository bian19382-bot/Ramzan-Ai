import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Hammer, Sparkles, ChevronDown, ChevronUp, Layers, Terminal } from 'lucide-react';
import { Profile } from '../../types/portfolio';
import { useLanguage } from '../i18n/LanguageContext';
import { cinematicFadeUp, safeViewport } from '../../lib/cinematicMotion';

interface AboutSectionProps {
  profile: Profile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const [expanded, setExpanded] = useState(false);
  const { language } = useLanguage();
  const isRoman = language === 'ur-roman';

  const stages = [
    {
      num: '01',
      title: isRoman ? 'EXPLORE' : 'EXPLORE',
      sub: isRoman ? 'Tools, Workflows aur Ideas' : 'Discover tools, workflows and ideas',
      desc: isRoman
        ? 'Google AI Studio, Claude AI, aur ChatGPT jaise cutting-edge models ki madad se creative system architecture aur UI/UX concepts ko explore karta hoon.'
        : 'Exploring cutting-edge models like Google AI Studio, Claude AI, and ChatGPT to plan clean architectures and user experience concepts.',
      icon: Compass,
      tag: 'RESEARCH & IDEATION',
    },
    {
      num: '02',
      title: isRoman ? 'BUILD' : 'BUILD',
      sub: isRoman ? 'Digital Experiences aur Websites' : 'Create digital experiences and websites',
      desc: isRoman
        ? 'React 19, TypeScript, aur modern Tailwind CSS ke sath zero-layout-shift responsive web applications aur full-stack interfaces develop karta hoon.'
        : 'Developing responsive web applications, modular components, and accessible interfaces with React 19, TypeScript, and modern Tailwind CSS.',
      icon: Hammer,
      tag: 'ENGINEERING & PROTOTYPING',
    },
    {
      num: '03',
      title: isRoman ? 'IMPROVE' : 'IMPROVE',
      sub: isRoman ? 'Seekhna, Test karna aur Polish' : 'Learn, experiment and improve projects',
      desc: isRoman
        ? 'Cloudflare Pages, Supabase edge database, aur GitHub continuous deployment ke zariye projects ko iterate, test aur publish karta hoon.'
        : 'Iterating, testing, and hardening digital experiences via Cloudflare Pages, Supabase edge databases, and automated GitHub workflows.',
      icon: Sparkles,
      tag: 'OPTIMIZATION & ITERATION',
    },
  ];

  return (
    <section id="about" className="py-28 px-5 sm:px-8 lg:px-12 bg-[#0A0B10] border-t border-white/5 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1320px] w-full mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          variants={cinematicFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={safeViewport}
          className="mb-16 border-b border-white/5 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400 uppercase tracking-widest mb-3">
              <Terminal className="w-3.5 h-3.5" />
              <span>CHAPTER 01 // NARRATIVE ARCHIVE</span>
            </div>
            <h2 className="font-cinematic text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase">
              ORIGIN STORY
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1AA] font-sans mt-2 max-w-xl">
              {isRoman
                ? 'Ek self-driven digital creator aur web developer ka seekhne aur practical projects banane ka safar.'
                : "The journey of a self-driven digital creator and web developer who is continuously learning, testing, and building."}
            </p>
          </div>

          <div className="text-right hidden md:block font-mono text-[11px] text-[#71717A]">
            <span>FILE // ORIGIN_DATA_01</span>
            <div className="text-cyan-400/80 font-semibold mt-0.5">LOCATION: PUNJAB, PAKISTAN</div>
          </div>
        </motion.div>

        {/* Narrative Lead */}
        <motion.div
          variants={cinematicFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={safeViewport}
          className="mb-16 max-w-4xl"
        >
          <p className="text-base sm:text-xl text-[#F3F4F6] font-display leading-relaxed">
            {isRoman
              ? 'Mera naam Ramzan hai. Main AI Creator & Digital Professional hoon aur mera main focus modern web development seekhna aur practical websites banana hai. Main AI-assisted tools ki madad se workflows ko accelerate karta hoon aur explore karta hoon ke digital ideas ko code aur functioning reality me kaise dhalte hain.'
              : "I'm Ramzan, an AI Creator & Digital Professional with a focused dedication to modern web development. I build my capabilities by creating real website projects, leveraging AI-assisted workflows to explore ideas, and mastering how modern web experiences are planned, engineered, tested, and published."}
          </p>

          <div className="mt-6">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-wider cursor-pointer"
            >
              <span>{expanded ? (isRoman ? 'Tafseel Band Karein [-]' : 'Collapse Detailed Narrative [-]') : (isRoman ? 'Mazeed Safar Parhein [+]' : 'Read Full Narrative [+]')}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden mt-6"
              >
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-sm text-[#A1A1AA] leading-relaxed space-y-4 font-sans">
                  <p>
                    {isRoman
                      ? 'Mere daily practical toolkit mein Google AI Studio, ChatGPT, Claude AI, GitHub, Supabase, Cloudflare, Vercel aur Netlify shamil hain. Main continuous experimentation aur hands-on testing ke zariye apni skills enhance kar raha hoon.'
                      : 'My daily technical toolkit includes Google AI Studio, ChatGPT, Claude AI, GitHub, Supabase, Cloudflare, Vercel, and Netlify. I continue to sharpen my craft through hands-on testing, honest scoping, and modular component architecture.'}
                  </p>
                  <p>
                    {isRoman
                      ? 'Main un munasib opportunities ke liye hamesha open hoon jahan requirements meri current abilities ke mutabiq hon aur mujhe practical web projects ke zariye naye standards sikhne ka moqa mile.'
                      : "I remain actively open to suitable collaborative opportunities and client projects where requirements align with my abilities and allow me to deliver genuine value while learning through real-world execution."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* The 3 Alter Ego Visual Stages: 01 EXPLORE, 02 BUILD, 03 IMPROVE */}
        <div className="relative">
          {/* Subtle Horizontal Connecting Beam (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent -translate-y-12 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {stages.map((stg, idx) => {
              const IconComp = stg.icon;
              return (
                <motion.div
                  key={stg.num}
                  variants={cinematicFadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={safeViewport}
                  custom={idx}
                  className="group relative p-6 sm:p-8 rounded-2xl bg-[#0D0F14] border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.12)] flex flex-col justify-between"
                >
                  {/* Corner Accent reticle */}
                  <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-cyan-400/40 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div>
                    {/* Header: Stage Number & Tag */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5 font-mono text-[10px] text-[#71717A]">
                      <span className="text-cyan-400 font-bold tracking-widest text-xs">
                        STAGE // {stg.num}
                      </span>
                      <span className="uppercase tracking-wider">{stg.tag}</span>
                    </div>

                    {/* Icon & Title */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 text-cyan-400 flex items-center justify-center group-hover:scale-105 group-hover:border-cyan-400/40 transition-all">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <h3 className="font-cinematic text-3xl font-black text-white tracking-wide uppercase">
                        {stg.num} — {stg.title}
                      </h3>
                    </div>

                    <p className="text-xs font-mono text-cyan-400/80 mb-3 tracking-wide">
                      {stg.sub}
                    </p>

                    <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed font-sans">
                      {stg.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#71717A]">
                    <span>STATUS: ACTIVE DISCOVERY</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
