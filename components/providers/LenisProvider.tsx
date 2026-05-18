"use client";

import { ReactLenis } from "lenis/react";
import { LENIS_OPTIONS } from "@/lib/constants";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const { lightMotion } = usePerformanceMode();

  // Native scroll on mobile — smoother touch, less main-thread work
  if (lightMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      {children}
    </ReactLenis>
  );
}
