export const SITE = {
  name: "D'LUCENTI",
  tagline: "Haute Joaillerie",
  description: "Contemporary minimalism shaped by tradition.",
  locale: "en",
  currency: "EUR",
  heritage: "Paris · Since 1892",
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/** Snappier Lenis — less interpolation lag, better frame consistency */
export const LENIS_OPTIONS = {
  lerp: 0.14,
  duration: 1,
  smoothWheel: true,
  wheelMultiplier: 0.9,
  touchMultiplier: 1,
  infinite: false,
} as const;
