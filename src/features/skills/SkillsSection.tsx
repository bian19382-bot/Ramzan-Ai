import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Server, Code, Bot, FolderTree, Database, Cloud, Globe, Terminal, Layout, Compass, Paintbrush } from 'lucide-react';
import { Skill, SkillGroup } from '../../types/portfolio';
import { useLanguage } from '../i18n/LanguageContext';

interface SkillsSectionProps {
  skillGroups: SkillGroup[];
  skills: Skill[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skillGroups, skills }) => {
  const [activeTab, setActiveTab] = useState(skillGroups[0]?.id || 'sg-1');
  const { language, t } = useLanguage();
  const isRoman = language === 'ur-roman';

  const getToolIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('google') || n.includes('studio')) return <Sparkles className="w-5 h-5 text-cyan-400" />;
    if (n.includes('chatgpt') || n.includes('claude')) return <Bot className="w-5 h-5 text-purple-400" />;
    if (n.includes('github')) return <FolderTree className="w-5 h-5 text-emerald-400" />;
    if (n.includes('supabase')) return <Database className="w-5 h-5 text-emerald-400" />;
    if (n.includes('cloudflare')) return <Cloud className="w-5 h-5 text-amber-400" />;
    if (n.includes('vercel')) return <Globe className="w-5 h-5 text-blue-400" />;
    if (n.includes('netlify')) return <Terminal className="w-5 h-5 text-cyan-400" />;
    if (n.includes('layout')) return <Layout className="w-5 h-5 text-indigo-400" />;
    if (n.includes('navigation')) return <Compass className="w-5 h-5 text-teal-400" />;
    if (n.includes('styling') || n.includes('code')) return <Paintbrush className="w-5 h-5 text-pink-400" />;
    return <Code className="w-5 h-5 text-[var(--accent-text)]" />;
  };

  const activeSkills = skills.filter((s) => s.group_id === activeTab && s.visible);

  return (
    <section id="skills" className="py-24 px-5 sm:px-8 lg:px-12 border-t border-[var(--border)] relative bg-[var(--surface)]/30">
      <div className="max-w-[1200px] w-full mx-auto">
        {/* Eyebrow & Title */}
        <div className="mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2 block font-mono">
            {t('skillsEyebrow')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-[var(--text)] tracking-tight">
            {t('skillsTitle')}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl mt-2 leading-relaxed">
            {t('skillsSub')}
          </p>
        </div>

        {/* Tabbed category selector */}
        <div
          role="tablist"
          aria-label="Tool categories"
          className="flex flex-wrap items-center gap-2 mb-8 p-1.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] max-w-3xl"
        >
          {skillGroups.map((group) => {
            const isActive = activeTab === group.id;
            return (
              <button
                key={group.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(group.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[var(--accent)] text-white shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]'
                }`}
              >
                <span>{group.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Category Skills Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {activeSkills.map((sk) => {
              const isExploring = sk.name.toLowerCase().includes('exploring');
              const cleanName = sk.name.replace(/\(Exploring\)/i, '').trim();

              return (
                <div
                  key={sk.id}
                  className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)] hover:border-cyan-500/50 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] flex items-center justify-center border border-[var(--border)]">
                        {getToolIcon(sk.name)}
                      </div>
                      <span
                        className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full border ${
                          isExploring
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {isExploring ? (isRoman ? 'Exploring' : 'Exploring') : (isRoman ? 'Used' : 'Used')}
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-display text-[var(--text)] mb-1.5">
                      {cleanName}
                    </h3>

                    <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                      {sk.context}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--border)]/50 flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                    <span>{sk.group_name}</span>
                    <span className="text-cyan-400">• Practical Workflow</span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
