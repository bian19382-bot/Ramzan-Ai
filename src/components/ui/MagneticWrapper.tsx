import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface MagneticWrapperProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // 0 to 1, default 0.25
  cursorType?: 'nav' | 'button' | 'card' | 'link';
  disabled?: boolean;
}

export const MagneticWrapper: React.FC<MagneticWrapperProps> = ({
  children,
  className = '',
  strength = 0.28,
  cursorType = 'button',
  disabled = false,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;
    const { clientX, clientY } = e;
    const { top, left, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = (clientX - centerX) * strength;
    const deltaY = (clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{
        type: 'spring',
        damping: 15,
        stiffness: 180,
        mass: 0.1,
      }}
      data-magnetic="true"
      data-cursor={cursorType}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};
