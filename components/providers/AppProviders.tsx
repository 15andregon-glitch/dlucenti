"use client";

import { MotionConfig, LazyMotion, domAnimation } from "framer-motion";
import { LenisProvider } from "./LenisProvider";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const { reducedMotion } = usePerformanceMode();

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig
        reducedMotion={reducedMotion ? "always" : "user"}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <LenisProvider>{children}</LenisProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
