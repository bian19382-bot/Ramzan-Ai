import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Code, CheckCircle2, ChevronDown, ChevronUp, Mail, Layers } from 'lucide-react';
import { Profile } from '../../types/portfolio';
import { useLanguage } from '../i18n/LanguageContext';

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
        {/* Eyebrow & Title */}
        <div className="mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2 block font-mono">
            {t('aboutEyebrow')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-[var(--text)] tracking-tight">
            {t('aboutTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column (7 cols): Bio Narrative */}
          <div className="lg:col-span-7 flex flex-col gap-6">
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
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:underline cursor-pointer"
              >
                <span>{expanded ? t('aboutShowLess') : t('aboutReadMore')}</span>
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#contact"
                className="px-6 py-3 rounded-full bg-[var(--accent)] hover:brightness-110 active:scale-95 text-white font-medium text-xs sm:text-sm shadow-md transition flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>{isRoman ? 'Rabta Karein' : "Let's Talk"}</span>
              </a>

              <a
                href="#projects"
                className="px-6 py-3 rounded-full bg-[var(--surface-2)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--text)] font-medium text-xs sm:text-sm transition flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>{t('heroExploreCta')}</span>
              </a>
            </div>
          </div>

          {/* Right Column (5 cols): Verified Highlights Cards */}
          <div className="lg:col-span-5 flex flex-col gap-3.5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">
              {isRoman ? 'Mere Focus Points' : 'About Highlights'}
            </h3>
            {highlights.map((h, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:border-cyan-500/40 transition duration-200 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold block">
                    {h.label}
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--text)] mt-0.5 font-medium leading-snug">
                    {h.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
