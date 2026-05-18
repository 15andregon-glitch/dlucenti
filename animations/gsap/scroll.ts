import type Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap } from "./register";

/**
 * Bridges Lenis smooth scroll with GSAP ScrollTrigger.
 * Invoke once Lenis instance is available (see LenisScrollBridge).
 */
export function connectLenisToScrollTrigger(lenis: Lenis) {
  registerGsap();

  lenis.on("scroll", ScrollTrigger.update);

  const ticker = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(ticker);
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length && value !== undefined) {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  ScrollTrigger.addEventListener("refresh", () => lenis.resize());
  ScrollTrigger.refresh();

  return () => {
    lenis.off("scroll", ScrollTrigger.update);
    gsap.ticker.remove(ticker);
    ScrollTrigger.scrollerProxy(document.documentElement, {});
  };
}
