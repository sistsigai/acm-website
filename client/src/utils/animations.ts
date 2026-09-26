import type { Variants } from "framer-motion";

export const fadeIn = (
  direction: "up" | "down" | "left" | "right",
  delay: number = 0
): Variants => {
  return {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
    },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        type: "tween",
        duration: 0.6,
        delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };
};
