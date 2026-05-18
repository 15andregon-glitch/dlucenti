import { gsap, ScrollTrigger, registerGsap } from "./register";
import { EASE } from "@/animations/presets";

registerGsap();

/** Editorial reveal — use inside useGSAP or GSAP context */
export function createRevealTimeline(
  target: gsap.TweenTarget,
  options?: { delay?: number; stagger?: number },
) {
  return gsap.timeline({ delay: options?.delay ?? 0 }).from(target, {
    y: 48,
    opacity: 0,
    duration: 1.2,
    stagger: options?.stagger ?? 0.1,
    ease: EASE.maison.join(","),
  });
}

/** Parallax helper for campaign imagery */
export function createParallax(
  target: gsap.TweenTarget,
  trigger: gsap.DOMTarget,
  amount = 80,
) {
  registerGsap();

  return gsap.to(target, {
    y: amount,
    ease: "none",
    scrollTrigger: {
      trigger,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
}
