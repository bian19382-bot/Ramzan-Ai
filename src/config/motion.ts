export const MOTION = {
  duration: {
    fast: 0.18,
    base: 0.35,
    slow: 0.7,
    cinema: 1.2,
  },
  ease: {
    easeOut: [0.22, 1, 0.36, 1] as const,
    easeInOut: [0.65, 0, 0.35, 1] as const,
  },
  distance: {
    reveal: 24,
  },
  stagger: {
    cards: 0.07,
    hero: 0.12,
  },
};
