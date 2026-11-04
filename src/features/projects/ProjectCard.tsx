import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Code2, ExternalLink, Github } from 'lucide-react';
import { Project } from '../../types/portfolio';
import { FuturisticSpotlightCard } from '../../components/ui/FuturisticSpotlightCard';
import { spinInVariants, spinInFontVariants, safeViewport } from '../../lib/animations';

interface ProjectCardProps {
  project: Project;
  onOpenCaseStudy: (project: Project) => void;
  isLargeFeatured?: boolean;
  index?: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpenCaseStudy,
  isLargeFeatured = false,
  index = 0,
}) => {
  const visibleTools = project.tools.slice(0, 4);
  const remainingToolsCount = project.tools.length - 4;

  const fallbackSvg =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%2318181b"/><text x="400" y="250" fill="%23a1a1aa" font-family="sans-serif" font-size="22" text-anchor="middle">Project Preview</text></svg>';

  return (
    <FuturisticSpotlightCard
      onClick={() => onOpenCaseStudy(project)}
      glowColor="cyan"
      cursorType="project"
      animationType="mosque-door"
      animationDelay={index % 6}
      className={`cursor-pointer flex flex-col justify-between ${
        isLargeFeatured ? 'lg:col-span-2' : ''
      }`}
    >
      <div>
        {/* Cover Image Container (16:10 aspect ratio) */}
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-[var(--surface-2)]">
          <img
            src={project.cover_image_url || fallbackSvg}
            alt={project.title}
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = fallbackSvg;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Futuristic Category Overlay with Spin-In Tag */}
          <div className="absolute top-3 left-3 z-20">
            <motion.span
              variants={spinInFontVariants}
              initial="hidden"
              whileInView="visible"
              viewport={safeViewport}
              custom={index * 0.1}
              className="text-[10px] font-mono uppercase tracking-wider bg-black/80 backdrop-blur-md text-cyan-300 px-3 py-1 rounded-md border border-cyan-500/30 flex items-center gap-1.5 shadow-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>{project.category_name}</span>
            </motion.span>
          </div>

          {/* Live indicator if demo is available */}
          {project.live_url && (
            <div className="absolute top-3 right-3 z-20">
              <span className="text-[10px] font-mono uppercase tracking-wider bg-black/80 backdrop-blur-md text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>LIVE SYSTEM</span>
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-2 mb-2">
            <motion.h3
              variants={spinInFontVariants}
              initial="hidden"
              whileInView="visible"
              viewport={safeViewport}
              className="text-lg sm:text-xl font-bold font-display text-[var(--text)] group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors line-clamp-1"
            >
              {project.title}
            </motion.h3>
            <ArrowUpRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </div>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-4 font-normal">
            {project.summary}
          </p>

          {/* Tech stack metadata with Spin-In Whirl effect */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--text-muted)]">
            <Code2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
            {visibleTools.map((tool, idx) => (
              <motion.span
                key={idx}
                variants={spinInVariants}
                initial="hidden"
                whileInView="visible"
                viewport={safeViewport}
                custom={idx}
                className="inline-flex items-center"
              >
                <span className="font-mono text-[11px] text-cyan-800 dark:text-cyan-200/90 font-medium px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  {tool}
                </span>
                {idx < visibleTools.length - 1 && <span className="opacity-40 ml-1.5 mr-0.5">·</span>}
              </motion.span>
            ))}
            {remainingToolsCount > 0 && (
              <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-400 font-semibold">
                +{remainingToolsCount} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 border-t border-[var(--border)]/70 flex items-center justify-between text-xs font-medium">
        <span className="text-cyan-700 dark:text-cyan-400 font-semibold flex items-center gap-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 font-mono text-xs">
          <span>// OPEN CASE STUDY</span>
        </span>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[var(--surface-2)] hover:bg-cyan-500 hover:text-white dark:hover:text-black text-[var(--text-muted)] hover:shadow-[0_0_12px_rgba(6,182,212,0.5)] transition-all shadow-sm"
              title="Launch Live Demo"
              aria-label={`Launch ${project.title} live demo`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {project.source_url && (
            <a
              href={project.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[var(--surface-2)] hover:bg-cyan-500 hover:text-white dark:hover:text-black text-[var(--text-muted)] hover:shadow-[0_0_12px_rgba(6,182,212,0.5)] transition-all shadow-sm"
              title="View Source Repository"
              aria-label={`View ${project.title} source code`}
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </FuturisticSpotlightCard>
  );
};
