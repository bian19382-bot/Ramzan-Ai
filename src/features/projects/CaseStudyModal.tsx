import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Github, Calendar, ArrowRight, Share2, Check, Sparkles, Terminal } from 'lucide-react';
import { Project } from '../../types/portfolio';
import { HoloScanImage } from '../../components/ui/HoloScanImage';

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectProject?: (proj: Project) => void;
  allProjects?: Project[];
  onOpenConsultant?: (projectTitle: string) => void;
  onOpenConsultantForProject?: (projectTitle: string) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  onClose,
  onSelectProject,
  allProjects = [],
  onOpenConsultant,
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

  const fallbackUrl = '/assets/aistudio/Neon_Portfolio_Hero__Welcome__I_m_Ramzan_85351036.png';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center p-3 sm:p-6 lg:p-10 select-none">
      {/* Cinematic Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        aria-hidden="true"
      />

      {/* Modal Container */}
      <motion.article
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 24 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl bg-[#0B0D13] border border-white/10 rounded-[28px] shadow-2xl overflow-hidden z-10 my-8 text-white group"
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-title"
      >
        {/* Header Bar */}
        <div className="sticky top-0 z-20 bg-[#0B0D13]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-md border border-cyan-500/30 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>MISSION // {project.category_name}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-[#A1A1AA] hover:text-white transition cursor-pointer"
              title="Share case study"
              aria-label="Share case study"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-[#A1A1AA] hover:text-white transition cursor-pointer"
              aria-label="Close case study"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 lg:p-10 space-y-8 max-h-[80vh] overflow-y-auto">
          {/* Title & Summary */}
          <div>
            <h1
              id="case-study-title"
              className="font-cinematic text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase mb-4"
            >
              {project.title}
            </h1>
            <p className="text-sm sm:text-base text-[#A1A1AA] font-sans leading-relaxed">
              {project.summary}
            </p>
          </div>

          {/* HoloScan Cover Image */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10">
            <HoloScanImage
              src={project.cover_image_url || fallbackUrl}
              alt={project.title}
              aspectRatio="aspect-[16/9]"
              telemetryLabel="SPEC // MISSION_VISUAL"
            />
          </div>

          {/* Problem & Approach */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.problem && (
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="font-mono text-[10px] text-cyan-400 tracking-widest uppercase">
                  OBJECTIVE // CHALLENGE
                </span>
                <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                  {project.problem}
                </p>
              </div>
            )}

            {project.approach && (
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="font-mono text-[10px] text-cyan-400 tracking-widest uppercase">
                  EXECUTION // ARCHITECTURE
                </span>
                <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                  {project.approach}
                </p>
              </div>
            )}
          </div>

          {/* Tools & Specifications */}
          <div className="p-6 rounded-2xl bg-[#10131B] border border-white/10 space-y-4">
            <span className="font-mono text-[10px] text-cyan-400 tracking-widest uppercase">
              TECHNICAL STACK & WORKFLOW
            </span>
            <div className="flex flex-wrap gap-2">
              {project.tools.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-md bg-white/[0.04] border border-white/10 text-xs font-mono text-[#CBD5E1]"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Actions Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-cyan-300 transition flex items-center gap-2"
                >
                  <span>LAUNCH LIVE DEPLOYMENT</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {project.source_url && (
                <a
                  href={project.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-white font-semibold text-xs tracking-wider uppercase hover:border-cyan-400 hover:bg-cyan-500/10 transition flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  <span>REPOSITORY</span>
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-xs font-mono text-[#71717A] hover:text-white uppercase tracking-wider cursor-pointer"
            >
              CLOSE MISSION FILE [ESC]
            </button>
          </div>
        </div>
      </motion.article>
    </div>
  );
};
