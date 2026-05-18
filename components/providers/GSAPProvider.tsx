"use client";

import { useEffect } from "react";
import { registerGsap } from "@/animations/gsap/register";

/** Ensures GSAP plugins are registered on the client before any section animations. */
export function GSAPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerGsap();
  }, []);

  return <>{children}</>;
}
