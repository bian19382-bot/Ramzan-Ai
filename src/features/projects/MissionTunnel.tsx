import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  ArrowUpRight,
  Terminal,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Project } from '../../types/portfolio';
import { HoloScanImage } from '../../components/ui/HoloScanImage';

interface MissionTunnelProps {
  projects: Project[];
  onOpenCaseStudy: (project: Project) => void;
}

export const MissionTunnel: React.FC<MissionTunnelProps> = ({
  projects,
  onOpenCaseStudy,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!projects || projects.length === 0) return null;

  const total = projects.length;
  const activeProject = projects[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full py-8 select-none">
      {/* 3D Perspective Stage */}
      <div className="relative w-full min-h-[460px] sm:min-h-[520px] flex items-center justify-center perspective-stage overflow-hidden py-6">
        <div className="relative w-full max-w-2xl h-[420px] sm:h-[480px] flex items-center justify-center preserve-3d">
          {projects.map((project, idx) => {
            // Calculate offset relative to active index with wrapping
            let offset = idx - activeIndex;
            if (offset < -Math.floor(total / 2)) offset += total;
            if (offset > Math.floor(total / 2)) offset -= total;

            // Only render cards within near view (-2 to +2)
            if (Math.abs(offset) > 2) return null;

            const isCurrent = offset === 0;

            // 3D positioning coordinates based on depth
            const xOffset = offset * 260; // Spread horizontally
            const zOffset = -Math.abs(offset) * 220; // Step back in depth
            const rotateY = offset * -18; // Angle inward toward center
            const scale = 1 - Math.abs(offset) * 0.14;
            const opacity = 1 - Math.abs(offset) * 0.42;

            return (
              <motion.div
                key={project.id}
                onClick={() => {
                  if (isCurrent) {
                    onOpenCaseStudy(project);
                  } else {
                    setActiveIndex(idx);
                  }
                }}
                animate={{
                  x: xOffset,
                  z: zOffset,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                }}
                transition={{
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  zIndex: isCurrent ? 30 : 20 - Math.abs(offset),
                  transformStyle: 'preserve-3d',
                }}
                className={`absolute w-[90%] sm:w-[540px] rounded-3xl bg-[#0D0F16] border transition-colors duration-300 shadow-2xl cursor-pointer ${
                  isCurrent
                    ? 'border-cyan-400/50 shadow-[0_0_50px_rgba(56,189,248,0.22)]'
                    : 'border-white/10 hover:border-white/25'
                }`}
              >
                {/* Mission Header Strip */}
                <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between text-[11px] font-mono text-[#A1A1AA] bg-black/40 rounded-t-3xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-white font-bold tracking-wider">
                      MISSION // 0{idx + 1}
                    </span>
                  </div>
                  <span className="text-cyan-400/80 uppercase tracking-widest text-[10px]">
                    {project.category_name}
                  </span>
                </div>

                {/* Holographic Cover Scan */}
                <div className="p-4 sm:p-5">
                  <HoloScanImage
                    src={
                      project.cover_image_url ||
                      '/assets/aistudio/Neon_Portfolio_Hero__Welcome__I_m_Ramzan_85351036.png'
                    }
                    alt={project.title}
                    aspectRatio="aspect-[16/9]"
                    telemetryLabel={`FILE_${idx + 1}`}
                  />
                </div>

                {/* Mission Details */}
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg sm:text-xl font-bold font-display text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                      {project.title}
                    </h3>
                    <ArrowUpRight className="w-5 h-5 text-cyan-400 shrink-0" />
                  </div>

                  <p className="text-xs sm:text-sm text-[#A1A1AA] line-clamp-2 leading-relaxed">
                    {project.summary}
                  </p>

                  {/* Tool Stack Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-mono">
                    {project.tools.slice(0, 4).map((tool, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-[#CBD5E1]"
                      >
                        {tool}
                      </span>
                    ))}
                    {project.tools.length > 4 && (
                      <span className="text-cyan-400 font-semibold px-1">
                        +{project.tools.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Actions Bar */}
                  {isCurrent && (
                    <div
                      className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => onOpenCaseStudy(project)}
                        className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-cyan-300 transition cursor-pointer flex items-center gap-1.5 shadow-md"
                      >
                        <span>INSPECT MISSION</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-2">
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-white/[0.06] hover:bg-cyan-500 hover:text-black text-[#A1A1AA] border border-white/10 transition"
                            title="Launch Live Project"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {project.source_url && (
                          <a
                            href={project.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-white/[0.06] hover:bg-cyan-500 hover:text-black text-[#A1A1AA] border border-white/10 transition"
                            title="View Source Repository"
                          >
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls & Index Bar */}
      <div className="mt-6 flex items-center justify-between max-w-2xl mx-auto px-4 font-mono text-xs text-[#A1A1AA]">
        <button
          onClick={handlePrev}
          className="p-3 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-white transition active:scale-95 cursor-pointer flex items-center gap-1.5"
          aria-label="Previous project"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">PREV</span>
        </button>

        {/* Dots Indicators */}
        <div className="flex items-center gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === activeIndex
                  ? 'w-6 bg-cyan-400'
                  : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Jump to project ${i + 1}`}
            />
          ))}
          <span className="ml-2 text-[11px] text-cyan-400 font-bold">
            0{activeIndex + 1} / 0{total}
          </span>
        </div>

        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-white transition active:scale-95 cursor-pointer flex items-center gap-1.5"
          aria-label="Next project"
        >
          <span className="hidden sm:inline">NEXT</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
