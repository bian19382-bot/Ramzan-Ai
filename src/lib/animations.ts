import { Variants } from 'motion/react';

/**
 * Standard viewport configuration for re-triggering animations EVERY time
 * a visitor scrolls into view from top-to-bottom or bottom-to-top.
 */
export const safeViewport = {
  once: false,
  amount: 0.15,
};

/**
 * 1. MOSQUE DOOR ANIMATION
 * Inspired by grand architectural arched double doors opening outward in 3D perspective.
 */
export const mosqueDoorVariants: Variants = {
  hidden: {
    opacity: 0,
    rotateY: -65,
    transformOrigin: 'left center',
    filter: 'brightness(0.6)',
  },
  visible: (custom = 0) => ({
    opacity: 1,
    rotateY: 0,
    transformOrigin: 'left center',
    filter: 'brightness(1)',
    transition: {
      duration: 0.85,
      delay: custom * 0.1,
      ease: [0.16, 1, 0.3, 1] as const, // Smooth cinematic ease
    },
  }),
};

export const mosqueDoorRightVariants: Variants = {
  hidden: {
    opacity: 0,
    rotateY: 65,
    transformOrigin: 'right center',
    filter: 'brightness(0.6)',
  },
  visible: (custom = 0) => ({
    opacity: 1,
    rotateY: 0,
    transformOrigin: 'right center',
    filter: 'brightness(1)',
    transition: {
      duration: 0.85,
      delay: custom * 0.1,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

/**
 * 2. SQUID INK IN ANIMATION
 * Organic fluid ink blossom spreading outward from center with liquid neon expansion.
 */
export const squidInkVariants: Variants = {
  hidden: {
    clipPath: 'circle(0% at 50% 50%)',
    opacity: 0,
    scale: 0.92,
    filter: 'blur(10px) brightness(1.8)',
  },
  visible: (custom = 0) => ({
    clipPath: 'circle(150% at 50% 50%)',
    opacity: 1,
    scale: 1,
    filter: 'blur(0px) brightness(1)',
    transition: {
      duration: 0.9,
      delay: custom * 0.12,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

/**
 * 3. SPIN IN ANIMATION
 * High-energy vortex whirl spinning into position with elastic spring settle.
 */
export const spinInVariants: Variants = {
  hidden: {
    rotate: -220,
    scale: 0.2,
    opacity: 0,
    filter: 'blur(6px)',
  },
  visible: (custom = 0) => ({
    rotate: 0,
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 18,
      mass: 0.8,
      delay: custom * 0.06,
    },
  }),
};

/**
 * 4. SPIN IN HEADING / FONT ANIMATION
 * Designed specifically for typography, titles, headings, and font badges.
 * Spins into place with a snappy spring settle so letters snap into razor-sharp focus.
 */
export const spinInFontVariants: Variants = {
  hidden: {
    rotate: -120,
    scale: 0.35,
    opacity: 0,
    filter: 'blur(8px)',
    transformOrigin: 'center center',
  },
  visible: (custom = 0) => ({
    rotate: 0,
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transformOrigin: 'center center',
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 18,
      mass: 0.75,
      delay: custom * 0.06,
    },
  }),
};

/**
 * 5. COLLIDING SPARKS ANIMATION
 * High-velocity converging kinetic particle collision with electric impact flash,
 * bursting sparks, and rapid spring settle into crisp UI focus.
 * Used when opening any project, case study, or admin modal.
 */
export const collidingSparksVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.82,
    y: 28,
    filter: 'brightness(2.2) contrast(150%) blur(8px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'brightness(1) contrast(100%) blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 22,
      mass: 0.85,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.88,
    y: -24,
    filter: 'brightness(1.8) contrast(130%) blur(6px)',
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 1, 1] as const,
    },
  },
};

/**
 * Backdrop for Colliding Sparks Modal
 */
export const collidingSparksBackdropVariants: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
  },
  visible: {
    opacity: 1,
    backdropFilter: 'blur(16px)',
    transition: {
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * 6. COLLIDING SPARKS PANEL / PAGE ANIMATION
 * High-energy kinetic spark convergence for full-page views, admin portal, and tab switching.
 */
export const collidingSparksPanelVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.93,
    y: 18,
    filter: 'brightness(1.7) blur(5px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'brightness(1) blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 24,
      mass: 0.9,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -12,
    filter: 'brightness(1.4) blur(4px)',
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1] as const,
    },
  },
};

// Backwards-compatible aliases during transition
export const liquidGasVariants = collidingSparksVariants;
export const liquidGasBackdropVariants = collidingSparksBackdropVariants;
export const liquidGasPanelVariants = collidingSparksPanelVariants;

