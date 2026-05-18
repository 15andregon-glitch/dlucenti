"use client";

import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { useIsMobile } from "./useMediaQuery";

/** Prefer native scroll & lighter motion on mobile and when reduced motion is set. */
export function usePerformanceMode() {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  return {
    reducedMotion,
    isMobile,
    /** Use for Lenis, parallax, GSAP, and heavy filters */
    lightMotion: reducedMotion || isMobile,
  };
}
