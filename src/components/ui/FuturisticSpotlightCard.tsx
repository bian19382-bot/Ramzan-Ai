import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { cinematicFadeUp } from '../../lib/cinematicMotion';

interface FuturisticSpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  cornerAccents?: boolean;
  glowColor?: 'cyan' | 'purple' | 'emerald';
  cursorType?: 'project' | 'card' | 'button' | 'nav';
  animationType?: string;
  animationDelay?: number;
}

export const FuturisticSpotlightCard: React.FC<FuturisticSpotlightCardProps> = ({
  children,
  className = '',
  onClick,
  cornerAccents = true,
  glowColor = 'cyan',
  cursorType,
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

    // Subtle 3D perspective magnetic tilt (Alter Ego style)
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
      ? 'rgba(129, 140, 248, 0.18)'
      : glowColor === 'emerald'
      ? 'rgba(52, 211, 153, 0.18)'
      : 'rgba(56, 189, 248, 0.18)';

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      variants={cinematicFadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.12 }}
      custom={animationDelay}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        y: isHovered ? -4 : 0,
      }}
      transition={{
        type: 'spring',
        damping: 24,
        stiffness: 240,
        mass: 0.1,
      }}
      style={{
        transformStyle: 'preserve-3d',
        transformPerspective: 1200,
      }}
      data-cursor={cursorType}
      className={`relative rounded-2xl overflow-hidden bg-[#0A0B10] backdrop-blur-xl border border-white/10 transition-all duration-300 hover:border-[#38bdf8]/50 group ${className}`}
    >
      {/* Pointer-based color bloom */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-10"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowGradient}, transparent 70%)`,
        }}
      />

      {/* Cyber Corner HUD Brackets */}
      {cornerAccents && (
        <>
          <span className="absolute top-2 left-2 text-[10px] font-mono text-white/20 group-hover:text-[#38bdf8]/60 transition-colors pointer-events-none z-20">⌜</span>
          <span className="absolute top-2 right-2 text-[10px] font-mono text-white/20 group-hover:text-[#38bdf8]/60 transition-colors pointer-events-none z-20">⌝</span>
          <span className="absolute bottom-2 left-2 text-[10px] font-mono text-white/20 group-hover:text-[#38bdf8]/60 transition-colors pointer-events-none z-20">⌞</span>
          <span className="absolute bottom-2 right-2 text-[10px] font-mono text-white/20 group-hover:text-[#38bdf8]/60 transition-colors pointer-events-none z-20">⌟</span>
        </>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
