import type { Easing } from "framer-motion";

export type EasingTuple = [number, number, number, number];

export interface AnimationConfig {
  duration: number;
  ease: Easing | EasingTuple;
  delay?: number;
}
