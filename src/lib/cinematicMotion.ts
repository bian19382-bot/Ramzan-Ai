import { Variants } from 'motion/react';

/**
 * RAMZAN AI — ALTER EGO CINEMATIC MOTION SYSTEM
 * Designed to mirror the premium Alter Ego Framer Template aesthetic:
 * - Ultra-smooth cubic-bezier curves [0.16, 1, 0.3, 1]
 * - 3D depth perspective and tunnel transitions
 * - Staggered letter typography reveals
 * - Holographic image mask reveals
 * - Accessible and prefers-reduced-motion safe
 */

export const safeViewport = {
  once: true,
  amount: 0.15,
};

export const safeViewportRepeat = {
  once: false,
  amount: 0.2,
};

/**
 * 1. CINEMATIC FADE UP
 * Clean upward transition with editorial precision
 */
export const cinematicFadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 32,
    filter: 'blur(4px)',
  },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.85,
      delay: custom * 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

/**
 * 2. STAGGER CONTAINER
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.1,
    },
  },
};

/**
 * 3. STAGGERED LETTER ANIMATION (Hero Headline RAMZAN)
 */
export const letterContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.15,
    },
  },
};

export const letterVariant: Variants = {
  hidden: {
    opacity: 0,
    y: '100%',
    rotateX: -45,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    y: '0%',
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/**
 * 4. HOLOGRAPHIC IMAGE MASK REVEAL
 */
export const holoImageReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    filter: 'brightness(1.5) contrast(120%) blur(8px)',
    clipPath: 'inset(12% 0% 12% 0%)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'brightness(1) contrast(100%) blur(0px)',
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/**
 * 5. 3D MISSION TUNNEL CARD VARIANTS
 */
export const tunnelCardVariants: Variants = {
  hidden: {
    opacity: 0,
    z: -300,
    scale: 0.85,
    rotateX: 10,
    filter: 'blur(6px)',
  },
  visible: (custom = 0) => ({
    opacity: 1,
    z: 0,
    scale: 1,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      delay: custom * 0.1,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

/**
 * 6. TELEMETRY BADGE / TECHNICAL LABEL REVEAL
 */
export const telemetryBadgeVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -16,
  },
  visible: (custom = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      delay: custom * 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

/**
 * 7. ORIGIN STORY TIMELINE BEAM
 */
export const timelineBeamVariants: Variants = {
  hidden: {
    scaleY: 0,
    transformOrigin: 'top center',
  },
  visible: {
    scaleY: 1,
    transformOrigin: 'top center',
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/**
 * 8. RADAR SWEEP CONCENTRIC RING
 */
export const radarRingVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.6,
  },
  visible: (custom = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.2,
      delay: custom * 0.15,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

/**
 * 9. SIGNAL PULSE WAVE FOR FOOTER
 */
export const signalWaveVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: [0.2, 0.8, 0],
    scale: [0.85, 1.4, 2.0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeOut',
    },
  },
};

/* =========================================================================
 * BACKWARDS-COMPATIBILITY ALIASES
 * Replaces old mosque door, squid ink, and colliding sparks with clean cinematic motion
 * ========================================================================= */
export const mosqueDoorVariants = cinematicFadeUp;
export const mosqueDoorRightVariants = cinematicFadeUp;
export const squidInkVariants = holoImageReveal;
export const spinInVariants = cinematicFadeUp;
export const spinInFontVariants = cinematicFadeUp;
export const collidingSparksVariants = cinematicFadeUp;
export const collidingSparksBackdropVariants = {
  hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
  visible: { opacity: 1, backdropFilter: 'blur(16px)', transition: { duration: 0.35 } },
  exit: { opacity: 0, backdropFilter: 'blur(0px)', transition: { duration: 0.25 } },
};
export const collidingSparksPanelVariants = cinematicFadeUp;
export const liquidGasVariants = cinematicFadeUp;
export const liquidGasBackdropVariants = collidingSparksBackdropVariants;
export const liquidGasPanelVariants = cinematicFadeUp;
