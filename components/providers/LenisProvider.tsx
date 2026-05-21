"use client";

import { useLayoutEffect, useState } from "react";
import { ReactLenis } from "lenis/react";
import { LENIS_OPTIONS } from "@/lib/constants";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [enableLenis, setEnableLenis] = useState(false);

  useLayoutEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnableLenis(desktop && !reduced);
  }, []);

  if (!enableLenis) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      {children}
    </ReactLenis>
  );
}
