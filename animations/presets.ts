/** Shared motion tokens — tuned for fluid, light performance */
export const EASE = {
  maison: [0.22, 1, 0.36, 1] as const,
  out: [0.16, 1, 0.3, 1] as const,
} as const;

export const DURATION = {
  fast: 0.25,
  base: 0.45,
  slow: 0.65,
} as const;

export const STAGGER = {
  tight: 0.03,
  base: 0.05,
} as const;
