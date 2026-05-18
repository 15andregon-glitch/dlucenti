import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/**
 * Registers GSAP plugins once on the client.
 * Call from providers or useGSAP before any timeline work.
 */
export function registerGsap() {
  if (typeof window === "undefined") return gsap;
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return gsap;
}

export function isGsapRegistered() {
  return registered;
}

export { gsap, ScrollTrigger };
