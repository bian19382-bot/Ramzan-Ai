import React from 'react';
import { ArrowUpRight, ExternalLink, Github, Terminal } from 'lucide-react';
import { Project } from '../../types/portfolio';
import { HoloScanImage } from '../../components/ui/HoloScanImage';

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

  const fallbackUrl = '/assets/aistudio/Neon_Portfolio_Hero__Welcome__I_m_Ramzan_85351036.png';

  return (
    <article
      onClick={() => onOpenCaseStudy(project)}
      className={`group relative rounded-3xl bg-[#0D0F14] border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_0_35px_rgba(56,189,248,0.14)] cursor-pointer flex flex-col justify-between overflow-hidden select-none ${
        isLargeFeatured ? 'lg:col-span-2' : ''
      }`}
    >
      <div>
        {/* Card Header Telemetry Strip */}
        <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between text-[11px] font-mono text-[#A1A1AA] bg-black/40">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-white font-semibold">MISSION // 0{index + 1}</span>
          </div>
          <span className="text-cyan-400/80 uppercase tracking-wider text-[10px]">
            {project.category_name}
          </span>
        </div>

        {/* HoloScan Cover Image */}
        <div className="p-4 sm:p-5">
          <HoloScanImage
            src={project.cover_image_url || fallbackUrl}
            alt={project.title}
            aspectRatio="aspect-[16/10]"
            telemetryLabel={`SPEC // 0${index + 1}`}
          />
        </div>

        {/* Project Body */}
        <div className="px-5 pb-4 sm:px-6 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg sm:text-xl font-bold font-display text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
              {project.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-[#71717A] group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </div>

          <p className="text-xs sm:text-sm text-[#A1A1AA] line-clamp-2 leading-relaxed">
            {project.summary}
          </p>

          {/* Tools stack */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 text-[10px] font-mono text-[#71717A]">
            {visibleTools.map((tool, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-[#CBD5E1]"
              >
                {tool}
              </span>
            ))}
            {remainingToolsCount > 0 && (
              <span className="text-cyan-400 font-semibold px-1">
                +{remainingToolsCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 py-3.5 sm:px-6 border-t border-white/5 bg-black/20 flex items-center justify-between text-xs font-mono">
        <span className="text-cyan-400 font-medium group-hover:underline flex items-center gap-1">
          <span>// OPEN CASE STUDY</span>
        </span>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-cyan-500 hover:text-black text-[#A1A1AA] border border-white/10 transition"
              title="Launch Live Project"
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
              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-cyan-500 hover:text-black text-[#A1A1AA] border border-white/10 transition"
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
