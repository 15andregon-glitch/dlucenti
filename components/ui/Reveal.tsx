"use client";

import { m, useInView } from "framer-motion";
import { useRef } from "react";
import { fadeIn } from "@/animations/framer";
import { cn } from "@/lib/cn";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const { lightMotion } = usePerformanceMode();

  if (lightMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <m.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeIn}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </m.div>
  );
}
