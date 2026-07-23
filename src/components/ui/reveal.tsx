"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export type RevealTrigger = "view" | "mount";

export interface RevealProps {
  children: ReactNode;
  /** Seconds of delay — used to stagger siblings. */
  delay?: number;
  className?: string;
  /**
   * `view` (default) waits until the element scrolls into the viewport.
   * `mount` animates immediately and is what above-the-fold content must use:
   * content that is already visible on load should never depend on a scroll
   * trigger to appear.
   */
  trigger?: RevealTrigger;
}

/**
 * Entrance animation.
 *
 * When the visitor prefers reduced motion the element renders in its final
 * state immediately, with no transform, opacity fade or observer attached.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  trigger = "view",
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const target = { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      {...(trigger === "mount"
        ? { animate: target }
        : {
            whileInView: target,
            viewport: { once: true, margin: "0px 0px -10% 0px" },
          })}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Convenience wrapper: staggers children by a fixed step. */
export function RevealList({
  children,
  step = 0.08,
  className,
  trigger,
}: {
  children: ReactNode[];
  step?: number;
  className?: string;
  trigger?: RevealTrigger;
}) {
  return (
    <>
      {children.map((child, index) => (
        <Reveal
          key={index}
          delay={index * step}
          className={className}
          trigger={trigger}
        >
          {child}
        </Reveal>
      ))}
    </>
  );
}
