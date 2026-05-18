"use client";

import { useEffect, type DependencyList, type RefObject } from "react";
import { gsap, registerGsap } from "@/animations/gsap/register";

/**
 * GSAP-ready hook with automatic context cleanup.
 * Pass a scope ref for scoped selectors inside components.
 */
export function useGSAP(
  callback: () => void,
  deps: DependencyList = [],
  scope?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(callback, scope?.current ?? undefined);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
