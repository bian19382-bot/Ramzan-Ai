import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { mosqueDoorVariants, squidInkVariants, spinInVariants } from '../../lib/animations';

interface FuturisticSpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  cornerAccents?: boolean;
  glowColor?: 'cyan' | 'purple' | 'emerald';
  cursorType?: 'project' | 'card' | 'button' | 'nav';
  animationType?: 'mosque-door' | 'squid-ink' | 'spin-in' | 'default';
  animationDelay?: number;
}

export const FuturisticSpotlightCard: React.FC<FuturisticSpotlightCardProps> = ({
  children,
  className = '',
  onClick,
  cornerAccents = true,
  glowColor = 'cyan',
  cursorType,
  animationType = 'default',
  animationDelay = 0,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    // Subtle 3D perspective magnetic tilt
    const rotX = -((y - rect.height / 2) / (rect.height / 2)) * 3;
    const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 3;
    setTilt({ rotateX: rotX, rotateY: rotY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const glowGradient =
    glowColor === 'purple'
      ? 'rgba(168, 85, 247, 0.22)'
      : glowColor === 'emerald'
      ? 'rgba(16, 185, 129, 0.22)'
      : 'rgba(6, 182, 212, 0.24)';

  const selectedVariants =
    animationType === 'mosque-door'
      ? mosqueDoorVariants
      : animationType === 'squid-ink'
      ? squidInkVariants
      : animationType === 'spin-in'
      ? spinInVariants
      : undefined;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      variants={selectedVariants}
      initial={selectedVariants ? 'hidden' : undefined}
      whileInView={selectedVariants ? 'visible' : undefined}
      viewport={{ once: true, margin: '-40px' }}
      custom={animationDelay}
      animate={
        !selectedVariants
          ? {
              rotateX: tilt.rotateX,
              rotateY: tilt.rotateY,
              y: isHovered ? -5 : 0,
            }
          : undefined
      }
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 220,
        mass: 0.1,
      }}
      style={{
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
      }}
      data-cursor={cursorType}
      className={`relative rounded-2xl overflow-hidden bg-[var(--surface)]/98 dark:bg-[#0d1017]/95 backdrop-blur-xl border border-[var(--border)] transition-all duration-300 hover:border-cyan-500 dark:hover:border-cyan-400 hover:shadow-[0_4px_28px_rgba(2,132,199,0.2)] dark:hover:shadow-[0_0_35px_rgba(6,182,212,0.3)] group ${className}`}
    >
      {/* Squid Ink In Liquid Aura on Hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out z-10 [clip-path:circle(0%_at_50%_50%)] group-hover:[clip-path:circle(140%_at_50%_50%)]"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, ${glowGradient}, transparent 70%)`,
        }}
      />

      {/* Cyber Corner HUD Brackets */}
      {cornerAccents && (
        <>
          <span className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 border-indigo-400/50 dark:border-cyan-400/40 group-hover:border-indigo-600 dark:group-hover:border-cyan-300 transition-colors pointer-events-none z-20" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 border-indigo-400/50 dark:border-cyan-400/40 group-hover:border-indigo-600 dark:group-hover:border-cyan-300 transition-colors pointer-events-none z-20" />
          <span className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-2 border-l-2 border-indigo-400/50 dark:border-cyan-400/40 group-hover:border-indigo-600 dark:group-hover:border-cyan-300 transition-colors pointer-events-none z-20" />
          <span className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-2 border-r-2 border-indigo-400/50 dark:border-cyan-400/40 group-hover:border-indigo-600 dark:group-hover:border-cyan-300 transition-colors pointer-events-none z-20" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
