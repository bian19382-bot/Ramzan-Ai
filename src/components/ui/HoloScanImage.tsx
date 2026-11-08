import React, { useState } from 'react';
import { motion } from 'motion/react';

interface HoloScanImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  telemetryLabel?: string;
  priority?: boolean;
  onHover?: () => void;
}

export const HoloScanImage: React.FC<HoloScanImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-video',
  telemetryLabel,
  onHover,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
        if (onHover) onHover();
      }}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden group select-none border border-white/10 rounded-2xl bg-[#090B10] ${aspectRatio} ${className}`}
    >
      {/* Corner Reticle Brackets (HUD Telemetry) */}
      <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-cyan-400/70 z-20 pointer-events-none transition-all group-hover:scale-110" />
      <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-cyan-400/70 z-20 pointer-events-none transition-all group-hover:scale-110" />
      <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-cyan-400/70 z-20 pointer-events-none transition-all group-hover:scale-110" />
      <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-cyan-400/70 z-20 pointer-events-none transition-all group-hover:scale-110" />

      {/* Technical Telemetry Label */}
      {telemetryLabel && (
        <div className="absolute top-3 left-7 z-20 pointer-events-none flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-cyan-400/90 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-cyan-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>{telemetryLabel}</span>
        </div>
      )}

      {/* Pointer-based Color Bloom Light (Desktop) */}
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}% ${mousePos.y}%, rgba(56, 189, 248, 0.18), transparent 70%)`,
        }}
      />

      {/* Main Image with Smooth Loading and Subtle Zoom */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${isHovered ? 'scale-105 brightness-105' : 'scale-100 brightness-95'}`}
      />

      {/* Holographic Laser Scanline */}
      <div className="holo-scanline" />

      {/* Subtle Grid & Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none z-10" />
    </div>
  );
};
