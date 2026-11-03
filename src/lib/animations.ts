import { Variants } from 'motion/react';

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
      ease: [0.16, 1, 0.3, 1], // Smooth cinematic ease
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
      ease: [0.16, 1, 0.3, 1],
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
      ease: [0.22, 1, 0.36, 1],
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
