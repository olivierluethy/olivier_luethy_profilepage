"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Ambient hero backdrop: a static measurement grid with a slow scanning line
 * passing over it, faded out toward the centre so it never competes with the
 * headline. The sweep is the only moving part and is dropped entirely when the
 * visitor prefers reduced motion.
 */
export function HudBackdrop() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg className="absolute inset-0 size-full text-line">
        <defs>
          <pattern
            id="hud-grid"
            width="56"
            height="56"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M56 0H0V56"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hud-grid)" />
      </svg>

      {prefersReducedMotion ? null : (
        <motion.div
          className="absolute inset-y-0 w-px bg-linear-to-b from-transparent via-signal to-transparent"
          initial={{ left: "-5%", opacity: 0 }}
          animate={{ left: ["-5%", "105%"], opacity: [0, 0.5, 0] }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 4,
            ease: "linear",
          }}
        />
      )}

      {/* Fades the grid away from the type so contrast never suffers. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_45%,transparent_0%,var(--ground)_72%)]" />
    </div>
  );
}
