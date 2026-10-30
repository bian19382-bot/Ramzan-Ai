import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Server, Code, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Skill, SkillGroup } from '../../types/portfolio';
import { useLanguage } from '../i18n/LanguageContext';
import { FuturisticSpotlightCard } from '../../components/ui/FuturisticSpotlightCard';
import {
  GoogleAiStudioLogo,
  OpenAiLogo,
  ClaudeLogo,
  CursorLogo,
  SupabaseLogo,
  CloudflareLogo,
  GitHubLogo,
  VercelLogo,
  ReactTsLogo,
  TailwindLogo,
  FigmaLogo,
  DockerLogo,
} from '../../components/icons/BrandIcons';

interface SkillsSectionProps {
  skillGroups: SkillGroup[];
  skills: Skill[];
}

interface ToolMeta {
  icon: React.ReactNode;
  tier: string;
  tierVariant: 'cyan' | 'purple' | 'emerald' | 'amber' | 'blue' | 'rose';
  glowColor: 'cyan' | 'purple' | 'emerald';
  specs: string[];
  statusText: string;
  metricLabel: string;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skillGroups, skills }) => {
  const [activeTab, setActiveTab] = useState(skillGroups[0]?.id || 'sg-1');
  const { language, t } = useLanguage();
  const isRoman = language === 'ur-roman';

  // Professional metadata resolver for tools and engineering workflows
  const getToolMeta = (name: string): ToolMeta => {
    const n = name.toLowerCase();

    if (n.includes('google') || n.includes('studio') || n.includes('gemini')) {
      return {
        icon: <GoogleAiStudioLogo size={22} />,
        tier: 'PRO TIER // 2.5 API',
        tierVariant: 'cyan',
        glowColor: 'cyan',
        specs: ['2M Context Window', 'Multi-Modal Voice/Vision', 'Prompt Engineering'],
        statusText: 'DAILY DRIVER',
        metricLabel: 'API QUOTA: PAID TIER',
      };
    }
    if (n.includes('chatgpt') || n.includes('openai') || n.includes('gpt')) {
      return {
        icon: <OpenAiLogo size={22} />,
        tier: 'PLUS & TEAM PRO',
        tierVariant: 'emerald',
        glowColor: 'emerald',
        specs: ['OpenAI o1 & GPT-4o', 'Deep Logic Reasoning', 'Schema Architecture'],
        statusText: 'PRO SUITE',
        metricLabel: 'ADVANCED REASONING',
      };
    }
    if (n.includes('claude') || n.includes('anthropic') || n.includes('sonnet')) {
      return {
        icon: <ClaudeLogo size={22} />,
        tier: 'SONNET 3.5 PRO',
        tierVariant: 'amber',
        glowColor: 'purple',
        specs: ['Zero-Slop Refactor', 'Nuanced TS Algorithms', 'Comprehensive Docs'],
        statusText: 'PRO WORKSPACE',
        metricLabel: 'CODE QUALITY: STRICT',
      };
    }
    if (n.includes('cursor')) {
      return {
        icon: <CursorLogo size={22} />,
        tier: 'PRO AI EDITOR',
        tierVariant: 'cyan',
        glowColor: 'cyan',
        specs: ['Full Repo Indexing', 'Agent Terminal Exec', 'Instant Multi-File Diffs'],
        statusText: 'DEV WORKSPACE',
        metricLabel: 'MULTI-FILE COPILOT',
      };
    }
    if (n.includes('supabase')) {
      return {
        icon: <SupabaseLogo size={22} />,
        tier: 'PRO CLOUD DB',
        tierVariant: 'emerald',
        glowColor: 'emerald',
        specs: ['PostgreSQL 16 Engine', 'Row Level Security', 'Edge JWT Auth'],
        statusText: 'PRODUCTION DB',
        metricLabel: 'RLS ENFORCED',
      };
    }
    if (n.includes('cloudflare')) {
      return {
        icon: <CloudflareLogo size={22} />,
        tier: 'PRO GLOBAL CDN',
        tierVariant: 'amber',
        glowColor: 'cyan',
        specs: ['330+ Global PoPs', '0ms Cold Starts', 'DDoS Armor & DNS'],
        statusText: 'EDGE DEPLOYED',
        metricLabel: 'LATENCY: <50MS',
      };
    }
    if (n.includes('github')) {
      return {
        icon: <GitHubLogo size={22} />,
        tier: 'TEAM & ACTIONS PRO',
        tierVariant: 'purple',
        glowColor: 'purple',
        specs: ['Matrix CI/CD Runner', 'Lockfile Sanitizer', 'Branch Protection'],
        statusText: 'AUTOMATED PIPELINE',
        metricLabel: 'CI/CD: 100% PASS',
      };
    }
    if (n.includes('vercel')) {
      return {
        icon: <VercelLogo size={22} />,
        tier: 'PRO EDGE RUNTIME',
        tierVariant: 'blue',
        glowColor: 'cyan',
        specs: ['Atomic Git Deploys', 'Instant Rollback', 'Edge Image Optimizer'],
        statusText: 'STATIC CDN',
        metricLabel: 'ZERO-DOWNTIME',
      };
    }
    if (n.includes('react') || n.includes('typescript')) {
      return {
        icon: <ReactTsLogo size={22} />,
        tier: 'STABLE CORE',
        tierVariant: 'blue',
        glowColor: 'cyan',
        specs: ['React 19 Hooks', 'Strict TypeScript 5+', 'Zero-Crash Flow'],
        statusText: 'CORE ENGINE',
        metricLabel: 'STRICT TYPE SAFE',
      };
    }
    if (n.includes('tailwind') || n.includes('motion') || n.includes('styling')) {
      return {
        icon: <TailwindLogo size={22} />,
        tier: 'v4 DESIGN TOKENS',
        tierVariant: 'cyan',
        glowColor: 'cyan',
        specs: ['Day/Night Calibrated', 'Hardware 60FPS', 'Zero-Pill Discipline'],
        statusText: 'DESIGN SYSTEM',
        metricLabel: 'ACCESSIBILITY: AAA',
      };
    }
    if (n.includes('figma')) {
      return {
        icon: <FigmaLogo size={22} />,
        tier: 'PRO WORKSPACE',
        tierVariant: 'rose',
        glowColor: 'purple',
        specs: ['Auto-Layout Frames', 'Design Component Handoff', 'Scalable Vector SVG'],
        statusText: 'UI PROTOTYPING',
        metricLabel: 'VECTOR FIDELITY',
      };
    }
    if (n.includes('docker') || n.includes('container')) {
      return {
        icon: <DockerLogo size={22} />,
        tier: 'ENTERPRISE STACK',
        tierVariant: 'blue',
        glowColor: 'cyan',
        specs: ['Isolated Multi-Stage', 'Reproducible Builds', 'Microservice Pods'],
        statusText: 'CONTAINER READY',
        metricLabel: 'DOCKER ENGINE',
      };
    }

    // Default Fallback
    return {
      icon: <Zap className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
      tier: 'VERIFIED PRACTICE',
      tierVariant: 'cyan',
      glowColor: 'cyan',
      specs: ['Modern Best Practices', 'Production Architecture', 'Hands-On Tested'],
      statusText: 'ACTIVE STACK',
      metricLabel: 'VERIFIED',
    };
  };

  const activeSkills = skills.filter((s) => s.group_id === activeTab && s.visible);

  return (
    <section id="skills" className="py-24 px-5 sm:px-8 lg:px-12 border-t border-[var(--border)] relative bg-[var(--surface)]/30">
      <div className="max-w-[1200px] w-full mx-auto">
        {/* Eyebrow & Title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2 block font-mono">
            {t('skillsEyebrow')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-[var(--text)] tracking-tight">
            {t('skillsTitle')}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl mt-2 leading-relaxed">
            {t('skillsSub')}
          </p>
        </motion.div>

        {/* Tabbed category selector */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45, delay: 0.1 }}
          role="tablist"
          aria-label="Tool categories"
          className="flex flex-wrap items-center gap-2 mb-10 p-1.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] max-w-3xl shadow-sm"
        >
          {skillGroups.map((group) => {
            const isActive = activeTab === group.id;
            return (
              <button
                key={group.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(group.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[var(--surface)] text-[var(--text)] shadow-md border border-[var(--border)] ring-1 ring-cyan-500/30'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]/50'
                }`}
              >
                {group.icon === 'Sparkles' && <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
                {group.icon === 'Server' && <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                {group.icon === 'Code' && <Code className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                <span>{group.name}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Skills & Tools Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {activeSkills.map((sk) => {
              const meta = getToolMeta(sk.name);
              const cleanName = sk.name.replace(/\(Exploring\)/i, '').trim();

              // Badge styling helper
              const getBadgeClasses = (variant: ToolMeta['tierVariant']) => {
                switch (variant) {
                  case 'cyan':
                    return 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30';
                  case 'emerald':
                    return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
                  case 'purple':
                    return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30';
                  case 'amber':
                    return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30';
                  case 'blue':
                    return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30';
                  case 'rose':
                    return 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30';
                  default:
                    return 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30';
                }
              };

              return (
                <FuturisticSpotlightCard
                  key={sk.id}
                  glowColor={meta.glowColor}
                  className="p-6 flex flex-col justify-between h-full"
                >
                  <div>
                    {/* Top Header: Official Brand Logo & Paid Tier Tag */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]/70">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-[var(--surface-2)] flex items-center justify-center border border-[var(--border)] group-hover:border-cyan-500/50 group-hover:shadow-[0_0_18px_rgba(6,182,212,0.25)] transition-all shrink-0">
                          {meta.icon}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
                            ENTERPRISE STACK
                          </span>
                          <span className="text-xs font-mono font-bold text-[var(--text)] tracking-tight">
                            {meta.statusText}
                          </span>
                        </div>
                      </div>

                      {/* Tier / Paid Version Badge */}
                      <span
                        className={`text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1.5 shadow-xs ${getBadgeClasses(
                          meta.tierVariant
                        )}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        <span>{meta.tier}</span>
                      </span>
                    </div>

                    {/* Tool Name & Description */}
                    <h3 className="text-base sm:text-lg font-bold font-display text-[var(--text)] mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                      {cleanName}
                    </h3>

                    <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-4 font-normal">
                      {sk.context}
                    </p>

                    {/* Key Technical Capabilities (Micro-Pill Highlights) */}
                    <div className="space-y-1.5 mb-5 p-3 rounded-xl bg-[var(--surface-2)]/60 border border-[var(--border)]/60">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 dark:text-cyan-400/90 font-bold block mb-1">
                        {isRoman ? 'Production Khasiyat // Capabilities:' : 'Production Architecture // Capabilities:'}
                      </span>
                      <ul className="space-y-1">
                        {meta.specs.map((spec, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-[var(--text)] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Footer Metric Strip */}
                  <div className="pt-3 border-t border-[var(--border)]/70 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[var(--text-muted)] font-medium">
                      SYS // {meta.metricLabel}
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>PRODUCTION READY</span>
                    </span>
                  </div>
                </FuturisticSpotlightCard>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
