"use client";

import { useEffect } from "react";
import { useLenis } from "@/hooks/useLenis";
import { connectLenisToScrollTrigger } from "@/animations/gsap/scroll";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Syncs Lenis with GSAP ScrollTrigger when both are active. */
export function LenisScrollBridge() {
  const lenis = useLenis();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!lenis || reducedMotion) return;
    return connectLenisToScrollTrigger(lenis);
  }, [lenis, reducedMotion]);

  return null;
}
