import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface CollidingSparksBurstProps {
  className?: string;
  count?: number;
}

interface Spark {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

const SPARK_COLORS = [
  '#f59e0b', // Amber kinetic gold
  '#06b6d4', // Cyan electric
  '#8b5cf6', // Violet plasma
  '#3b82f6', // Neon blue
  '#ffffff', // Pure incandescent white
  '#ec4899', // Hyper pink
];

export const CollidingSparksBurst: React.FC<CollidingSparksBurstProps> = ({
  className = '',
  count = 28,
}) => {
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    const generated: Spark[] = [];
    for (let i = 0; i < count; i++) {
      // Half from left stream, half from right stream
      const isLeft = i % 2 === 0;
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const distance = 80 + Math.random() * 140;

      generated.push({
        id: i,
        // Start either far left or far right converging to center
        startX: isLeft ? -120 - Math.random() * 80 : 120 + Math.random() * 80,
        startY: (Math.random() - 0.5) * 60,
        // Then burst outward in 360 degrees
        endX: Math.cos(angle) * distance,
        endY: Math.sin(angle) * distance,
        size: 2 + Math.random() * 3.5,
        color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
        delay: Math.random() * 0.08,
        duration: 0.55 + Math.random() * 0.35,
      });
    }
    setSparks(generated);
  }, [count]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden flex items-center justify-center z-30 ${className}`}
      aria-hidden="true"
    >
      {/* Central Collision Energy Flash */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 2.8, 0],
          opacity: [0, 0.9, 0],
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-amber-400 via-cyan-400 to-violet-500 blur-2xl pointer-events-none"
      />

      {/* Incandescent Core Flash */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1.4, 0],
          opacity: [0, 1, 0],
        }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="absolute w-12 h-12 rounded-full bg-white blur-md"
      />

      {/* Horizontal Spark Jets Collision Line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{
          scaleX: [0, 1.8, 0],
          opacity: [0, 1, 0],
        }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="absolute h-0.5 w-64 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_15px_#06b6d4]"
      />

      {/* Radiating Colliding Sparks Particles */}
      {sparks.map((spark) => (
        <motion.span
          key={spark.id}
          initial={{
            x: spark.startX,
            y: spark.startY,
            scale: 0.3,
            opacity: 0,
          }}
          animate={{
            x: [spark.startX, 0, spark.endX],
            y: [spark.startY, 0, spark.endY],
            scale: [0.3, 1.8, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: spark.duration,
            delay: spark.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            width: spark.size,
            height: spark.size,
            backgroundColor: spark.color,
            boxShadow: `0 0 8px ${spark.color}, 0 0 16px ${spark.color}`,
          }}
          className="absolute rounded-full"
        />
      ))}
    </div>
  );
};
