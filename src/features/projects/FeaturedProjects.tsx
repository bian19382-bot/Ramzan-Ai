import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, FolderKanban, Terminal, Box, Grid } from 'lucide-react';
import { Project, Category } from '../../types/portfolio';
import { ProjectCard } from './ProjectCard';
import { MissionTunnel } from './MissionTunnel';
import { CaseStudyModal } from './CaseStudyModal';
import { useLanguage } from '../i18n/LanguageContext';
import { cinematicFadeUp, safeViewport } from '../../lib/cinematicMotion';

interface FeaturedProjectsProps {
  projects: Project[];
  categories: Category[];
  onOpenConsultantForProject?: (projectTitle: string) => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({
  projects,
  categories,
  onOpenConsultantForProject,
}) => {
  const { language } = useLanguage();
  const isRoman = language === 'ur-roman';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCaseStudy, setActiveCaseStudy] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'tunnel' | 'grid'>('tunnel');

  // Filter logic
  const filteredProjects = useMemo(() => {
    let result = projects.filter((p) => p.status === 'published');

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category_id === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.tools.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.sort_order - b.sort_order;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <section id="projects" className="py-28 px-5 sm:px-8 lg:px-12 bg-[#070709] border-t border-white/5 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-cyan-500/5 via-violet-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-[1320px] w-full mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          variants={cinematicFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={safeViewport}
          className="mb-12 border-b border-white/5 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400 uppercase tracking-widest mb-3">
              <Terminal className="w-3.5 h-3.5" />
              <span>CHAPTER 02 // REPOSITORIES & DEPLOYMENTS</span>
            </div>
            <h2 className="font-cinematic text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase">
              MISSION FILES
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1AA] font-sans mt-2 max-w-xl">
              {isRoman
                ? 'Selected digital projects, working web prototypes aur live case studies.'
                : 'Selected digital projects, live web applications, and architectural case studies.'}
            </p>
          </div>

          {/* View Mode Toggle: 3D Tunnel vs Grid Matrix */}
          <div className="flex items-center gap-2 self-start md:self-auto p-1 rounded-xl bg-white/[0.04] border border-white/10 font-mono text-xs">
            <button
              onClick={() => setViewMode('tunnel')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'tunnel'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D TUNNEL</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>GRID VIEW</span>
            </button>
          </div>
        </motion.div>

        {/* Filter & Search Bar */}
        <motion.div
          variants={cinematicFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={safeViewport}
          className="mb-10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs"
        >
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 font-semibold'
                  : 'bg-white/[0.02] border-white/10 text-[#71717A] hover:text-white hover:border-white/20'
              }`}
            >
              ALL MISSIONS ({projects.filter((p) => p.status === 'published').length})
            </button>
            {categories.map((cat) => {
              const count = projects.filter(
                (p) => p.status === 'published' && p.category_id === cat.id
              ).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 font-semibold'
                      : 'bg-white/[0.02] border-white/10 text-[#71717A] hover:text-white hover:border-white/20'
                  }`}
                >
                  {cat.name.toUpperCase()} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#71717A] absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter missions..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-cyan-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-[#71717A] hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Main Display: 3D Tunnel Mode vs Matrix Grid Mode */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl p-8">
            <FolderKanban className="w-8 h-8 text-[#71717A] mx-auto mb-3" />
            <p className="text-sm text-white font-medium">No missions match your query.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-mono text-cyan-400 underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : viewMode === 'tunnel' ? (
          <div>
            <MissionTunnel
              projects={filteredProjects}
              onOpenCaseStudy={(proj) => setActiveCaseStudy(proj)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx}
                onOpenCaseStudy={(proj) => setActiveCaseStudy(proj)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {activeCaseStudy && (
          <CaseStudyModal
            project={activeCaseStudy}
            onClose={() => setActiveCaseStudy(null)}
            onOpenConsultant={onOpenConsultantForProject}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
