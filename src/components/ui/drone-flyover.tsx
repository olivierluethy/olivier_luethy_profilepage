"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Reticle } from "@/components/reticle";
import { DroneQuad } from "@/components/ui/drone-quad";

interface Flyer {
  id: number;
  /** Vertical band as a % of the section height. */
  top: number;
  /** Glyph width in px (also sets depth — smaller reads as further away). */
  size: number;
  /** 1 = left→right, -1 = right→left. */
  dir: 1 | -1;
  /** Seconds for one crossing. */
  dur: number;
  delay: number;
  /** Vertical bob amplitude in px. */
  drift: number;
  opacity: number;
  /** The one drone the HUD is locked onto. */
  tracked?: boolean;
}

/**
 * The lead drone travels the busiest band with a HUD lock; the rest are smaller,
 * fainter, and further back. Spread of speeds/delays keeps the sky from
 * pulsing in unison.
 */
const FLYERS: Flyer[] = [
  { id: 1, top: 15, size: 80, dir: 1, dur: 25, delay: 0, drift: 16, opacity: 0.8, tracked: true },
  { id: 2, top: 34, size: 52, dir: -1, dur: 32, delay: 2.5, drift: 20, opacity: 0.4 },
  { id: 3, top: 62, size: 92, dir: 1, dur: 22, delay: 6.5, drift: 12, opacity: 0.6 },
  { id: 4, top: 47, size: 38, dir: -1, dur: 41, delay: 11, drift: 24, opacity: 0.25 },
  { id: 5, top: 79, size: 58, dir: 1, dur: 35, delay: 4, drift: 16, opacity: 0.42 },
];

/** Fixed positions for the reduced-motion still. */
const STILLS = [
  { left: "12%", top: "20%", size: 70, opacity: 0.5, tracked: true },
  { left: "68%", top: "40%", size: 50, opacity: 0.32 },
  { left: "44%", top: "74%", size: 60, opacity: 0.38 },
];

function Lock({ size }: { size: number }) {
  return (
    <>
      <motion.span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-signal"
        style={{ width: size * 1.7, height: size * 1.7 }}
        animate={{ opacity: [0.85, 0.4, 0.85] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Reticle className="size-full" />
      </motion.span>
      <span
        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-mono uppercase text-signal"
        style={{ top: -size * 0.62, fontSize: 9, letterSpacing: "0.16em" }}
      >
        Trk·01 lock
      </span>
    </>
  );
}

/**
 * Ambient FPV flyover for the Make section: amber quad silhouettes drifting
 * across the band, with the site's targeting reticle locked onto the lead one.
 * Sits behind the content, ignores pointer events, and honours reduced motion.
 */
export function DroneFlyover() {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className="absolute inset-0">
        {STILLS.map((s, i) => (
          <div
            key={i}
            className="absolute text-signal"
            style={{ left: s.left, top: s.top, width: s.size, opacity: s.opacity }}
          >
            <DroneQuad spin={false} className="h-auto w-full" />
            {s.tracked ? <Lock size={s.size} /> : null}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {FLYERS.map((f) => (
        <motion.div
          key={f.id}
          className="absolute left-0 text-signal"
          style={{ top: `${f.top}%`, width: f.size, willChange: "transform" }}
          initial={{ x: f.dir > 0 ? "-16vw" : "116vw" }}
          animate={{
            x: f.dir > 0 ? ["-16vw", "116vw"] : ["116vw", "-16vw"],
            y: [0, -f.drift, f.drift * 0.6, -f.drift * 0.4, 0],
          }}
          transition={{
            x: { duration: f.dur, repeat: Infinity, ease: "linear", delay: f.delay },
            y: {
              duration: f.dur * 0.55,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: f.delay,
            },
          }}
        >
          <div className="relative" style={{ opacity: f.opacity }}>
            <motion.div
              animate={{ rotate: f.dir > 0 ? [-5, 5, -3] : [5, -5, 3] }}
              transition={{
                duration: f.dur * 0.4,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
                delay: f.delay,
              }}
            >
              <DroneQuad
                className="h-auto w-full"
                style={{ transform: f.dir < 0 ? "scaleX(-1)" : undefined }}
              />
            </motion.div>
            {f.tracked ? <Lock size={f.size} /> : null}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
