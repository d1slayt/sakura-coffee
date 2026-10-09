"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Fades content up by 12px the first time it enters the viewport.
 * Reduced-motion users get the fade without movement via the app-wide
 * `MotionConfig reducedMotion="user"` (see components/motion-provider.tsx),
 * which keeps server and client markup identical.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const MotionTag = as === "li" ? motion.li : motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
