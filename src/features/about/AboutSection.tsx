import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Code, CheckCircle2, ChevronDown, ChevronUp, Mail, Layers } from 'lucide-react';
import { Profile } from '../../types/portfolio';
import { useLanguage } from '../i18n/LanguageContext';
import { mosqueDoorVariants, mosqueDoorRightVariants, squidInkVariants, spinInVariants, spinInFontVariants, safeViewport } from '../../lib/animations';

interface AboutSectionProps {
  profile: Profile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const [expanded, setExpanded] = useState(false);
  const { language, t } = useLanguage();
  const isRoman = language === 'ur-roman';

  const highlights = isRoman
    ? [
        { label: 'Main Focus', text: 'Web development' },
        { label: 'Workflow', text: 'AI-assisted tools aur practical project building' },
        { label: 'Maqsad', text: 'Apni skills improve karna aur practical websites banana' },
        { label: 'Tareeqa', text: 'Clear communication aur realistic expectations' },
        { label: 'Availability', text: 'Munasib opportunities ke liye available' },
      ]
    : [
        { label: 'Main Focus', text: 'Web development' },
        { label: 'Workflow', text: 'AI-assisted tools and hands-on project building' },
        { label: 'Current Goal', text: 'Improve my skills and build practical web projects' },
        { label: 'Approach', text: 'Clear communication and realistic expectations' },
        { label: 'Availability', text: 'Open to suitable opportunities' },
      ];

  return (
    <section id="about" className="py-24 px-5 sm:px-8 lg:px-12 border-t border-[var(--border)] relative">
      <div className="max-w-[1200px] w-full mx-auto">
        {/* Eyebrow & Title with Mosque Door Arched Reveal & Spin In Typography */}
        <motion.div
          variants={mosqueDoorVariants}
          initial="hidden"
          whileInView="visible"
          viewport={safeViewport}
          className="mb-12"
        >
          <motion.span
            variants={spinInFontVariants}
            initial="hidden"
            whileInView="visible"
            viewport={safeViewport}
            className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2 block font-mono"
          >
            {t('aboutEyebrow')}
          </motion.span>
          <motion.h2
            variants={spinInFontVariants}
            initial="hidden"
            whileInView="visible"
            viewport={safeViewport}
            className="text-3xl sm:text-4xl font-bold font-display text-[var(--text)] tracking-tight"
          >
            {t('aboutTitle')}
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column (7 cols): Bio Narrative with Mosque Door Swing */}
          <motion.div
            variants={mosqueDoorVariants}
            initial="hidden"
            whileInView="visible"
            viewport={safeViewport}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <p className="text-base sm:text-lg text-[var(--text)] leading-relaxed font-normal">
              {isRoman
                ? 'Mera naam Ramzan hai. Main AI Creator & Digital Professional hoon aur filhal mera main focus web development seekhna aur practical website projects banana hai. Main AI-assisted tools ki madad se ideas explore karta hoon, apna workflow behtar banata hoon aur seekhta hoon ke websites ko plan, build, test aur publish kaise kiya jata hai.'
                : "I'm Ramzan, an AI Creator & Digital Professional with a current focus on web development. I'm building my skills by working on practical website projects and using AI-assisted tools to explore ideas, improve workflows, and learn how websites are planned, built, tested, and published."}
            </p>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden space-y-4"
                >
                  <div className="p-5 rounded-2xl bg-[var(--surface-2)]/60 border border-[var(--border)] text-sm sm:text-base text-[var(--text-muted)] leading-relaxed space-y-3">
                    <p>
                      {isRoman
                        ? 'Mere current toolkit mein Google AI Studio, ChatGPT, Claude AI, GitHub, Supabase, Cloudflare, Vercel aur Netlify shamil hain. Main practical projects aur experimentation ke zariye apni skills improve kar raha hoon. Har project ke scope aur deliverables ko clear rakhna mere liye important hai.'
                        : 'My current toolkit includes Google AI Studio, ChatGPT, Claude AI, GitHub, Supabase, Cloudflare, Vercel, and Netlify. I continue to learn through experimentation and hands-on projects, and I aim to communicate clearly about each project’s scope and what I can deliver.'}
                    </p>
                    <p>
                      {isRoman
                        ? 'Main un munasib opportunities ke liye available hoon jahan project ki requirements meri current abilities ke mutabiq hon aur mujhe practical kaam ke zariye mazeed seekhne ka mauqa mile.'
                        : "I'm open to suitable opportunities with individuals and businesses where the project requirements fit my current abilities and allow me to keep learning through practical work."}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                <span>{expanded ? t('aboutShowLess') : t('aboutReadMore')}</span>
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#contact"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>{isRoman ? 'Rabta Karein' : "Let's Talk"}</span>
              </a>

              <a
                href="#projects"
                className="px-6 py-3 rounded-full bg-[var(--surface-2)] hover:bg-cyan-500/10 dark:hover:bg-cyan-500/15 border border-[var(--border)] hover:border-cyan-400 text-[var(--text)] hover:text-cyan-700 dark:hover:text-cyan-300 font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 shadow-xs hover:shadow-[0_0_15px_rgba(6,182,212,0.25)]"
              >
                <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>{t('heroExploreCta')}</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column (5 cols): Verified Highlights Cards with Mosque Door Right Swing */}
          <motion.div
            variants={mosqueDoorRightVariants}
            initial="hidden"
            whileInView="visible"
            viewport={safeViewport}
            className="lg:col-span-5 flex flex-col gap-3.5"
          >
            <motion.h3
              variants={spinInFontVariants}
              initial="hidden"
              whileInView="visible"
              viewport={safeViewport}
              className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1"
            >
              {isRoman ? 'Mere Focus Points' : 'About Highlights'}
            </motion.h3>
            {highlights.map((h, idx) => (
              <motion.div
                key={idx}
                variants={squidInkVariants}
                initial="hidden"
                whileInView="visible"
                viewport={safeViewport}
                custom={idx}
                className="p-4 rounded-xl bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] shadow-sm hover:border-cyan-400 dark:hover:border-cyan-400 hover:bg-cyan-50/70 dark:hover:bg-cyan-950/25 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300 flex items-start gap-3.5 group cursor-default"
              >
                <motion.div
                  variants={spinInVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={safeViewport}
                  custom={idx * 0.1}
                  className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 border border-cyan-500/20 group-hover:border-cyan-500 dark:group-hover:border-cyan-400 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </motion.div>
                <div>
                  <motion.span
                    variants={spinInFontVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={safeViewport}
                    className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 dark:text-cyan-400/90 font-bold block"
                  >
                    // {h.label}
                  </motion.span>
                  <p className="text-xs sm:text-sm text-[var(--text)] mt-0.5 font-medium leading-snug group-hover:text-cyan-800 dark:group-hover:text-cyan-200 transition-colors">
                    {h.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
