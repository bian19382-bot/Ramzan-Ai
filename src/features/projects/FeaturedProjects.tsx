import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, X, FolderKanban, Plus, Sparkles } from 'lucide-react';
import { Project, Category } from '../../types/portfolio';
import { ProjectCard } from './ProjectCard';
import { CaseStudyModal } from './CaseStudyModal';
import { useLanguage } from '../i18n/LanguageContext';

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
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'title'>('featured');
  const [activeCaseStudy, setActiveCaseStudy] = useState<Project | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Filter and Sort logic
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
      if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.sort_order - b.sort_order;
      }
      if (sortBy === 'newest') {
        return new Date(b.project_date).getTime() - new Date(a.project_date).getTime();
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [projects, selectedCategory, searchQuery, sortBy]);

  const displayedProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  return (
    <section id="projects" className="py-24 px-5 sm:px-8 lg:px-12 border-t border-[var(--border)] relative">
      <div className="max-w-[1200px] w-full mx-auto">
        {/* Eyebrow & Title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2 block font-mono">
              {t('projectsEyebrow')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-[var(--text)] tracking-tight">
              {t('projectsTitle')}
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-xl mt-2">
              {t('projectsSub')}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {projects.length > 0 && (
              <div className="text-xs font-mono text-[var(--text-muted)] bg-[var(--surface-2)] px-3 py-1.5 rounded-full border border-[var(--border)]">
                Showing {displayedProjects.length} of {filteredProjects.length} projects
              </div>
            )}
          </div>
        </motion.div>

        {/* Filter Bar & Controls only shown if there are projects */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8"
          >
            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[var(--accent)] text-white shadow-sm'
                    : 'bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]'
                }`}
              >
                All Projects
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-[var(--accent)] text-white shadow-sm'
                      : 'bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search & Sort */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={searchQuery ?? ''}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <select
                value={sortBy ?? 'featured'}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
                aria-label="Sort projects"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest First</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </motion.div>
        )}

        {/* Projects Grid or Zero/Empty State */}
        {displayedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 32, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={idx === 0 && project.featured && selectedCategory === 'all' && !searchQuery ? 'lg:col-span-2' : ''}
              >
                <ProjectCard
                  project={project}
                  onOpenCaseStudy={(proj) => setActiveCaseStudy(proj)}
                  isLargeFeatured={idx === 0 && project.featured && selectedCategory === 'all' && !searchQuery}
                />
              </motion.div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          /* Clean Initial State for Ramzan Ghafoor */
          <div className="py-20 px-6 text-center rounded-3xl bg-[var(--surface-2)]/30 border border-[var(--border)] max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4 text-[var(--accent)] shadow-sm">
              <FolderKanban className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-display text-[var(--text)] mb-2">
              Ready for Real Projects
            </h3>
            <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto mb-6 leading-relaxed">
              All demo data has been cleared. You can now add your real web development projects with screenshots, descriptions, tools, and live demo links directly from the Admin panel.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#contact"
                className="px-6 py-2.5 rounded-full bg-[var(--accent)] hover:brightness-110 active:scale-95 text-white text-xs sm:text-sm font-semibold transition inline-flex items-center gap-2 shadow-md"
              >
                <span>Get in Touch for Projects</span>
              </a>
            </div>
          </div>
        ) : (
          /* Filtered search empty state */
          <div className="py-16 text-center rounded-3xl bg-[var(--surface-2)]/40 border border-[var(--border)] p-8">
            <div className="w-14 h-14 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4 text-[var(--text-muted)]">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-[var(--text)] mb-1">
              No matching projects found
            </h3>
            <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto mb-5">
              Nothing matches '{searchQuery}'. Try another keyword or reset your filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-full bg-[var(--accent)] text-white text-xs font-semibold hover:brightness-110 transition cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-8 py-3.5 rounded-full bg-[var(--surface-2)] hover:bg-[var(--border)] border border-[var(--border)] text-sm font-semibold text-[var(--text)] transition cursor-pointer shadow-sm"
            >
              Load More Works
            </button>
          </div>
        )}
      </div>

      {/* Case Study Modal */}
      <CaseStudyModal
        project={activeCaseStudy}
        onClose={() => setActiveCaseStudy(null)}
        onSelectProject={(proj) => setActiveCaseStudy(proj)}
        allProjects={projects}
        onOpenConsultantForProject={onOpenConsultantForProject}
      />
    </section>
  );
};
