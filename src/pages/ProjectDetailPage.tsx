import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, Github, Share2, Check, ArrowRight, X, Sparkles, FolderKanban } from 'lucide-react';
import { dataProvider } from '../data/dataProvider';
import { AiProjectConsultant } from '../features/ai/AiProjectConsultant';
import { cinematicFadeUp } from '../lib/cinematicMotion';
import { HoloScanImage } from '../components/ui/HoloScanImage';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [db, setDb] = useState(() => dataProvider.getDatabase());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = dataProvider.subscribe(() => {
      setDb({ ...dataProvider.getDatabase() });
    });

    void dataProvider.syncWithSupabase().finally(() => {
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const project = db.projects.find((p) => p.slug === slug);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [consultantOpen, setConsultantOpen] = useState(false);

  if (!project && isLoading) {
    return (
      <div className="min-h-screen bg-[#070709] text-white flex items-center justify-center p-6">
        <p className="text-sm font-mono text-[#A1A1AA]">Retrieving mission telemetry...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#070709] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center text-cyan-400 mb-4 border border-white/10">
          <FolderKanban className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold font-cinematic mb-2 uppercase">404 — Mission File Not Found</h1>
        <p className="text-sm text-[#A1A1AA] max-w-md mb-8 font-sans">
          The requested mission "{slug}" does not exist in the active telemetry registry.
        </p>
        <Link
          to="/"
          className="px-6 py-3 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-cyan-300 transition shadow-md font-mono"
        >
          Return to Mission Files
        </Link>
      </div>
    );
  }

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
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const currentIndex = db.projects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? db.projects[currentIndex - 1] : null;
  const nextProject = currentIndex < db.projects.length - 1 ? db.projects[currentIndex + 1] : null;

  return (
    <div className="relative min-h-screen bg-[#070709] text-[#F3F4F6] py-16 px-4 sm:px-8 lg:px-12 overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="fixed -inset-10 bg-gradient-to-tr from-cyan-500/10 via-violet-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <motion.div
        variants={cinematicFadeUp}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto space-y-10 relative z-10"
      >
        {/* Top Breadcrumb & Share */}
        <div className="flex items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--border)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Projects</span>
          </Link>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--border)] text-xs text-[var(--text)] transition flex items-center gap-1.5 cursor-pointer"
            aria-label="Share case study"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>

        {/* Hero Cover */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden bg-black border border-amber-400/30 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
          <img
            src={project.cover_image_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-black/75 backdrop-blur-md text-amber-300 border border-amber-400/40 flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>COLLIDING SPARKS // {project.category_name}</span>
            </span>
          </div>
        </div>

        {/* Title, Summary & Meta */}
        <div>
          <motion.h1
            variants={cinematicFadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl md:text-6xl font-black font-cinematic tracking-tight text-white uppercase mb-4"
          >
            {project.title}
          </motion.h1>
          <p className="text-base sm:text-lg text-[#A1A1AA] font-sans leading-relaxed">
            {project.summary}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[var(--surface-2)]/60 border border-[var(--border)] mt-8">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Role</span>
              <p className="text-xs sm:text-sm font-semibold text-[var(--text)] mt-0.5">{project.role}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Delivered</span>
              <p className="text-xs sm:text-sm font-semibold text-[var(--text)] mt-0.5">{project.project_date}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Category</span>
              <p className="text-xs sm:text-sm font-semibold text-[var(--text)] mt-0.5">{project.category_name}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Status</span>
              <p className="text-xs sm:text-sm font-semibold text-emerald-400 mt-0.5 capitalize">{project.status}</p>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-[var(--accent)] hover:brightness-110 text-white font-semibold text-xs sm:text-sm transition flex items-center gap-2 shadow-md"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Launch Live System</span>
            </a>
          )}

          {project.source_url && (
            <a
              href={project.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-[var(--surface-2)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--text)] font-semibold text-xs sm:text-sm transition flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              <span>Source Repository</span>
            </a>
          )}

          <button
            onClick={() => setConsultantOpen(true)}
            className="px-5 py-2.5 rounded-full bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 text-[var(--accent-text)] border border-[var(--accent)]/30 text-xs sm:text-sm font-semibold flex items-center gap-2 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span>AI Architecture Feasibility</span>
          </button>
        </div>

        {/* Problem and Approach */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--accent-text)] font-mono">
              The Problem Statement
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
              {project.problem}
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--accent-text)] font-mono">
              Technical Architecture & Strategy
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
              {project.approach}
            </p>
          </div>
        </div>

        {/* Technical Challenges */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--accent-text)] font-mono">
            Key Technical Challenges Overcome
          </h2>
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            {project.challenges}
          </div>
        </div>

        {/* Results */}
        {project.results && (
          <div className="p-6 rounded-2xl bg-[var(--accent)]/5 border border-[var(--accent)]/25 space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--accent-text)] font-mono">
              Business & Technical Impact
            </h2>
            <p className="text-base text-[var(--text)] font-medium leading-relaxed">
              {project.results}
            </p>
          </div>
        )}

        {/* Gallery Lightbox */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-[var(--border)]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
              Visual Documentation
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.gallery.map((img, idx) => (
                <div
                  key={img.id || idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className="group relative aspect-[16/10] rounded-2xl overflow-hidden bg-black/40 border border-[var(--border)] cursor-pointer hover:border-[var(--accent)] transition"
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

        {/* Prev / Next Navigation */}
        <div className="pt-8 border-t border-[var(--border)] flex items-center justify-between gap-4">
          {prevProject ? (
            <Link
              to={`/projects/${prevProject.slug}`}
              className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--accent)]/40 transition flex items-center gap-3 text-left group"
            >
              <ArrowLeft className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-text)] group-hover:-translate-x-1 transition" />
              <div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Previous</span>
                <p className="text-xs sm:text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent-text)] line-clamp-1">{prevProject.title}</p>
              </div>
            </Link>
          ) : <div />}

          {nextProject && (
            <Link
              to={`/projects/${nextProject.slug}`}
              className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--accent)]/40 transition flex items-center gap-3 text-right group"
            >
              <div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Next</span>
                <p className="text-xs sm:text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent-text)] line-clamp-1">{nextProject.title}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-text)] group-hover:translate-x-1 transition" />
            </Link>
          )}
        </div>

        {/* GTS Footer Credit */}
        <div className="pt-8 mt-12 border-t border-[var(--border)] text-center text-xs font-mono text-[var(--text-muted)] flex items-center justify-center gap-1.5 flex-wrap">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
          <span>Developed with <strong className="font-semibold text-[var(--text)]">GTS — GenTech Studio</strong> | Founder: <strong className="font-semibold text-[var(--text)]">Hamza Rizwan</strong></span>
        </div>
      </motion.div>

      {/* Lightbox Dialog */}
      {activeImageIndex !== null && project.gallery && project.gallery[activeImageIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setActiveImageIndex(null)}
        >
          <button
            onClick={() => setActiveImageIndex(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={project.gallery[activeImageIndex].url}
            alt="Preview"
            className="max-w-4xl max-h-[85vh] object-contain rounded-xl"
          />
        </div>
      )}

      {/* AI Scoping Assistant */}
      <AiProjectConsultant
        isOpen={consultantOpen}
        onClose={() => setConsultantOpen(false)}
        initialTopic={project.title}
      />
    </div>
  );
};
