import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Github, Calendar, Tag, ArrowRight, Share2, Check, Sparkles } from 'lucide-react';
import { Project } from '../../types/portfolio';

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectProject: (proj: Project) => void;
  allProjects: Project[];
  onOpenConsultantForProject?: (projectTitle: string) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  onClose,
  onSelectProject,
  allProjects,
  onOpenConsultantForProject,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeImageIndex !== null) {
          setActiveImageIndex(null);
        } else {
          onClose();
        }
      }
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, activeImageIndex, onClose]);

  if (!project) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const related = allProjects
    .filter((p) => p.id !== project.id && (p.category_id === project.category_id || p.featured))
    .slice(0, 2);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center p-3 sm:p-6 lg:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Modal Window Container */}
        <motion.article
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-4xl bg-[var(--surface)] border border-[var(--border)] rounded-[24px] shadow-2xl overflow-hidden z-10 my-8 text-[var(--text)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-study-title"
        >
          {/* Header Bar */}
          <div className="sticky top-0 z-20 glass-panel border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-text)] bg-[var(--accent)]/10 px-2.5 py-1 rounded-full border border-[var(--accent)]/20">
                Case Study
              </span>
              <span className="text-xs text-[var(--text-muted)] font-mono hidden sm:inline">
                {project.category_name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] transition cursor-pointer"
                title="Share case study"
                aria-label="Share case study"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] transition cursor-pointer"
                aria-label="Close case study"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Hero Cover Banner */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden bg-black/40">
            <img
              src={project.cover_image_url}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent" />
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-10 space-y-10">
            {/* Title & Summary */}
            <div>
              <h1
                id="case-study-title"
                className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-[var(--text)] mb-4"
              >
                {project.title}
              </h1>
              <p className="text-base sm:text-xl text-[var(--text-muted)] leading-relaxed font-normal">
                {project.summary}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[var(--surface-2)]/60 border border-[var(--border)]">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Role</span>
                <p className="text-xs sm:text-sm font-semibold text-[var(--text)] mt-1">{project.role}</p>
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Completed</span>
                <p className="text-xs sm:text-sm font-semibold text-[var(--text)] mt-1">{project.project_date}</p>
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Category</span>
                <p className="text-xs sm:text-sm font-semibold text-[var(--text)] mt-1">{project.category_name}</p>
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Deliverables</span>
                <p className="text-xs sm:text-sm font-semibold text-[var(--accent-text)] mt-1">Live System</p>
              </div>
            </div>

            {/* Action Buttons (Live Demo & Source only if provided) */}
            <div className="flex flex-wrap items-center gap-3">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-[var(--accent)] hover:brightness-110 text-white font-medium text-xs sm:text-sm transition flex items-center gap-2 shadow-md"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Launch Live Demo</span>
                </a>
              )}

              {project.source_url && (
                <a
                  href={project.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-[var(--surface-2)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--text)] font-medium text-xs sm:text-sm transition flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  <span>View Source Code</span>
                </a>
              )}

              {onOpenConsultantForProject && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenConsultantForProject(project.title);
                  }}
                  className="px-5 py-2.5 rounded-full bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 text-[var(--accent-text)] border border-[var(--accent)]/30 font-medium text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                  <span>AI Scoping: Build Similar System</span>
                </button>
              )}
            </div>

            {/* Detailed Case Study Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--accent-text)] font-mono">
                  The Problem
                </h2>
                <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                  {project.problem}
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--accent-text)] font-mono">
                  The Architecture & Approach
                </h2>
                <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                  {project.approach}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--accent-text)] font-mono">
                Key Technical Challenges & Solutions
              </h2>
              <div className="p-5 rounded-2xl bg-[var(--surface-2)]/40 border border-[var(--border)] text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                {project.challenges}
              </div>
            </div>

            {project.results && (
              <div className="p-6 rounded-2xl bg-[var(--accent)]/5 border border-[var(--accent)]/25 space-y-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--accent-text)] font-mono">
                  Measurable Impact & Results
                </h2>
                <p className="text-base text-[var(--text)] font-medium leading-relaxed">
                  {project.results}
                </p>
              </div>
            )}

            {/* Tools & Technologies */}
            <div className="space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Tech Stack Utilized
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-mono bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Gallery Lightbox Preview */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
                  Project Gallery
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery.map((img, idx) => (
                    <div
                      key={img.id || idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className="group relative aspect-[16/10] rounded-xl overflow-hidden bg-black/40 border border-[var(--border)] cursor-pointer hover:border-[var(--accent)] transition"
                    >
                      <img
                        src={img.url}
                        alt={img.alt_text || img.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                        <span className="text-xs text-white font-medium">{img.caption}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next / Related Projects Navigation */}
            {related.length > 0 && (
              <div className="pt-8 border-t border-[var(--border)]">
                <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-4">
                  Explore Related Work
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {related.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectProject(rel)}
                      className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="pr-4">
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">{rel.category_name}</span>
                        <h3 className="text-xs sm:text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent-text)] transition line-clamp-1">
                          {rel.title}
                        </h3>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-text)] group-hover:translate-x-1 transition shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.article>

        {/* Accessible Lightbox Modal */}
        {activeImageIndex !== null && project.gallery && project.gallery[activeImageIndex] && (
          <div
            className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setActiveImageIndex(null)}
          >
            <button
              onClick={() => setActiveImageIndex(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              aria-label="Close image preview"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
              <img
                src={project.gallery[activeImageIndex].url}
                alt={project.gallery[activeImageIndex].alt_text || 'Preview'}
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />
              <p className="text-sm text-white/80 mt-4 text-center">
                {project.gallery[activeImageIndex].caption}
              </p>
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};
