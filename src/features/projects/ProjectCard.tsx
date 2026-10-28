import React from 'react';
import { ExternalLink, Github, ArrowUpRight, Code2 } from 'lucide-react';
import { Project } from '../../types/portfolio';

interface ProjectCardProps {
  project: Project;
  onOpenCaseStudy: (project: Project) => void;
  isLargeFeatured?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpenCaseStudy,
  isLargeFeatured = false,
}) => {
  const visibleTools = project.tools.slice(0, 4);
  const remainingToolsCount = project.tools.length - 4;

  const fallbackSvg =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%2318181b"/><text x="400" y="250" fill="%23a1a1aa" font-family="sans-serif" font-size="22" text-anchor="middle">Project Preview</text></svg>';

  return (
    <article
      onClick={() => onOpenCaseStudy(project)}
      className={`group relative rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-card)] hover:border-[var(--accent)]/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer ${
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
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Clean Unboxed Category Overlay */}
          <div className="absolute top-3 left-3">
            <span className="text-[11px] font-semibold tracking-wider bg-black/75 backdrop-blur-md text-white px-2.5 py-1 rounded-md">
              {project.category_name}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg sm:text-xl font-bold font-display text-[var(--text)] group-hover:text-[var(--accent)] transition line-clamp-1">
              {project.title}
            </h3>
            <ArrowUpRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition shrink-0" />
          </div>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-4">
            {project.summary}
          </p>

          {/* Tech stack: clean unboxed metadata with bullet separators */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--text-muted)]">
            <Code2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
            {visibleTools.map((tool, idx) => (
              <React.Fragment key={idx}>
                <span className="font-mono text-[11px]">{tool}</span>
                {idx < visibleTools.length - 1 && <span className="opacity-40">·</span>}
              </React.Fragment>
            ))}
            {remainingToolsCount > 0 && (
              <span className="text-[10px] font-mono text-[var(--accent)]">
                +{remainingToolsCount} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 border-t border-[var(--border)]/50 flex items-center justify-between text-xs font-medium">
        <span className="text-[var(--accent)] font-semibold flex items-center gap-1 group-hover:underline">
          View Details
        </span>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--accent)] hover:text-white text-[var(--text-muted)] transition"
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
              className="p-2 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--accent)] hover:text-white text-[var(--text-muted)] transition"
              title="View Source Repository"
              aria-label={`View ${project.title} source code`}
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
