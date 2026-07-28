"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { Reticle } from "@/components/reticle";
import { DroneQuad } from "@/components/ui/drone-quad";

/* ---------------------------------------------------------------------------
   The obstacle course

   A small freestyle course laid out across the top band of the section: two
   race gates, a pylon and two floating blocks. The drones' flight paths are
   routed through these exact coordinates, so the weaving is real — they thread
   the gates and bow around the pylon/blocks rather than drifting over an empty
   backdrop. Positions are fractions of the container width and of a fixed top
   band so the same numbers drive both the rendered glyphs and the flight math.
--------------------------------------------------------------------------- */

/** Height of the band the course (and the flying) lives in, from the top. */
const BAND_H = 560;
const bandTop = (f: number) => 20 + f * (BAND_H - 40);

type ObstacleKind = "gate" | "pylon" | "block";

interface Obstacle {
  kind: ObstacleKind;
  /** Left edge as a fraction of container width. */
  fx: number;
  /** Vertical band fraction (0 = top of band, 1 = bottom). */
  f: number;
  size: number;
  opacity: number;
  /** Parallax travel in px against scroll — deeper things move more. */
  depth: number;
  /** Precomputed top offset in px. */
  top: number;
}

const RAW_COURSE: Omit<Obstacle, "top">[] = [
  { kind: "gate", fx: 0.13, f: 0.5, size: 130, opacity: 0.5, depth: 46 },
  { kind: "block", fx: 0.31, f: 0.16, size: 74, opacity: 0.28, depth: 20 },
  { kind: "pylon", fx: 0.47, f: 0.64, size: 118, opacity: 0.34, depth: 30 },
  { kind: "block", fx: 0.64, f: 0.24, size: 70, opacity: 0.26, depth: 22 },
  { kind: "gate", fx: 0.82, f: 0.46, size: 112, opacity: 0.44, depth: 62 },
];

// Sorted left→right so a drone can traverse the course in order.
const COURSE: Obstacle[] = RAW_COURSE.map((o) => ({ ...o, top: bandTop(o.f) })).sort(
  (a, b) => a.fx - b.fx,
);

/** Glyph footprint in px — gates/blocks are square, the pylon is tall. */
function footprint(o: Obstacle) {
  const w = o.kind === "pylon" ? o.size * 0.5 : o.size;
  return { w, h: o.size };
}

/** Centre of an obstacle's opening/mass, in container px. */
function centreOf(o: Obstacle, W: number) {
  const { w, h } = footprint(o);
  return { x: o.fx * W + w / 2, y: o.top + h / 2 };
}

/* ---------------------------------------------------------------------------
   Maneuver kinematics

   Each maneuver is a pure function of normalised time t∈[0,1] returning the
   drone's full pose. Every maneuver starts and ends level (pitch/roll a whole
   number of turns) so consecutive maneuvers chain without a visible snap. The
   sequencer improvises by picking the next maneuver at random, so the flight
   never settles into one repeating loop.
--------------------------------------------------------------------------- */

interface Pose {
  x: number;
  y: number;
  /** Screen-plane rotation (deg): nose attitude, flips and loops. */
  pitch: number;
  /** Barrel-roll rotation (deg) about the axis of travel. */
  roll: number;
  /** +1 nose-right, -1 nose-left (mirrors the glyph). */
  facing: number;
}

interface Maneuver {
  dur: number;
  sample: (t: number) => Pose;
  end: Pose;
}

interface Point {
  x: number;
  y: number;
}

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const clamp01 = (v: number) => clamp(v, 0, 1);
const rand = (a: number, b: number) => a + Math.random() * (b - a);

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function qBez(p0: Point, c: Point, p1: Point, t: number): Point {
  const m = 1 - t;
  return {
    x: m * m * p0.x + 2 * m * t * c.x + t * t * p1.x,
    y: m * m * p0.y + 2 * m * t * c.y + t * t * p1.y,
  };
}

function qBezDir(p0: Point, c: Point, p1: Point, t: number): Point {
  const m = 1 - t;
  return {
    x: 2 * m * (c.x - p0.x) + 2 * t * (p1.x - c.x),
    y: 2 * m * (c.y - p0.y) + 2 * t * (p1.y - c.y),
  };
}

/** Rotation that points the (possibly mirrored) glyph's nose along a velocity. */
function heading(dx: number, dy: number, facing: number) {
  let a = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (facing < 0) {
    a -= 180;
    if (a < -180) a += 360;
  }
  return a;
}

/** Eased travel along a quadratic bezier; nose follows the path, level at ends. */
function pathMan(
  from: Point,
  end: Point,
  ctrl: Point,
  dur: number,
  facing: number,
  attitude: number,
): Maneuver {
  const sample = (t: number): Pose => {
    const te = easeInOut(clamp01(t));
    const pos = qBez(from, ctrl, end, te);
    const dir = qBezDir(from, ctrl, end, te);
    const head = clamp(heading(dir.x, dir.y, facing), -attitude, attitude);
    // sin() window keeps the attitude flair in the middle and level at both ends.
    return { x: pos.x, y: pos.y, pitch: head * Math.sin(Math.PI * te), roll: 0, facing };
  };
  return { dur, sample, end: { x: end.x, y: end.y, pitch: 0, roll: 0, facing } };
}

/** Full front/back flip in place, with a little bob. */
function flipMan(from: Point, facing: number, bounds: Bounds): Maneuver {
  const dir = Math.random() < 0.5 ? 1 : -1;
  const drift = 18 * facing;
  const bob = Math.min(28, from.y - bounds.minY);
  const sample = (t: number): Pose => {
    const te = easeInOut(clamp01(t));
    return {
      x: from.x + drift * te,
      y: from.y - Math.sin(Math.PI * te) * bob,
      pitch: -360 * dir * te,
      roll: 0,
      facing,
    };
  };
  return { dur: 0.85, sample, end: { x: from.x + drift, y: from.y, pitch: 0, roll: 0, facing } };
}

/** Barrel roll; optionally flips facing at the edge-on midpoint to reverse. */
function rollMan(from: Point, facing: number, flip = false): Maneuver {
  const nf = flip ? -facing : facing;
  const drift = 42 * (flip ? nf : facing);
  const sample = (t: number): Pose => {
    const te = easeInOut(clamp01(t));
    return {
      x: from.x + drift * te,
      y: from.y - Math.sin(Math.PI * te) * 8,
      pitch: 0,
      roll: 360 * te,
      facing: flip ? (te < 0.5 ? facing : nf) : facing,
    };
  };
  return { dur: 0.7, sample, end: { x: from.x + drift, y: from.y, pitch: 0, roll: 0, facing: nf } };
}

/** Vertical loop; when `flip` it doubles as an Immelmann turn-around. */
function loopMan(
  from: Point,
  facing: number,
  bounds: Bounds,
  size: number,
  flip: boolean,
  dur: number,
): Maneuver {
  const R = clamp((from.y - bounds.minY) / 2 - 4, size * 0.45, size * 0.95);
  const cx = from.x;
  const cy = from.y - R;
  const nf = flip ? -facing : facing;
  const exit = flip ? nf * size * 0.55 : 0;
  const sample = (t: number): Pose => {
    const te = easeInOut(clamp01(t));
    const phi = Math.PI / 2 + 2 * Math.PI * te;
    return {
      x: cx + R * Math.cos(phi) + exit * te,
      y: cy + R * Math.sin(phi),
      pitch: -360 * te,
      roll: 0,
      facing: flip ? (te < 0.5 ? facing : nf) : facing,
    };
  };
  return { dur, sample, end: { x: from.x + exit, y: from.y, pitch: 0, roll: 0, facing: nf } };
}

/** Shoot straight through a gate's centre and out the far side. */
function gatePass(from: Point, o: Obstacle, W: number, facing: number): Maneuver {
  const c = centreOf(o, W);
  const end = {
    x: clamp(c.x + facing * o.size * 0.7, o.size * 0.5, W - o.size * 0.5),
    y: c.y,
  };
  // Control point placed so the curve passes exactly through the gate centre.
  const ctrl = {
    x: 2 * c.x - 0.5 * (from.x + end.x),
    y: 2 * c.y - 0.5 * (from.y + end.y),
  };
  return pathMan(from, end, ctrl, rand(1.4, 1.8), facing, 30);
}

/** Bow around a pylon or block, arcing to the side away from its mass. */
function weaveAround(
  from: Point,
  o: Obstacle,
  W: number,
  facing: number,
  bounds: Bounds,
): Maneuver {
  const c = centreOf(o, W);
  const { w } = footprint(o);
  const above = c.y > BAND_H / 2;
  const end = {
    x: clamp(c.x + facing * (w * 0.85), bounds.minX, bounds.maxX),
    y: clamp(c.y + (above ? -o.size * 0.5 : o.size * 0.5), bounds.minY, bounds.maxY),
  };
  const mid = { x: (from.x + end.x) / 2, y: (from.y + end.y) / 2 };
  const bow = mid.y > c.y ? 1 : -1;
  const ctrl = { x: mid.x, y: clamp(mid.y + bow * o.size * 0.65, bounds.minY, bounds.maxY) };
  return pathMan(from, end, ctrl, rand(2.1, 3.0), facing, 26);
}

/* ---------------------------------------------------------------------------
   The sequencer — improvised freestyle

   Each drone walks the course left↔right. On the way it threads gates and bows
   around pylons/blocks; between legs it rolls the dice on a flip, roll or loop;
   at the ends it whips an Immelmann turn-around and heads back. Random choices
   mean no two passes look the same.
--------------------------------------------------------------------------- */

interface DroneState {
  i: number;
  dir: number;
  facing: number;
  turn: boolean;
  pose: Pose;
}

interface DroneConfig {
  id: number;
  size: number;
  opacity: number;
  /** Chance per leg of throwing in a freestyle trick. */
  trick: number;
  /** Duration multiplier — bigger = slower = reads as closer/heavier. */
  speed: number;
  tracked?: boolean;
  startX: number;
  startF: number;
  start: number;
}

const DRONES: DroneConfig[] = [
  { id: 1, size: 76, opacity: 0.85, trick: 0.42, speed: 1.0, tracked: true, startX: 0.15, startF: 0.5, start: 0 },
  { id: 2, size: 52, opacity: 0.4, trick: 0.3, speed: 1.16, startX: 0.62, startF: 0.2, start: 2 },
  { id: 3, size: 44, opacity: 0.26, trick: 0.22, speed: 1.32, startX: 0.4, startF: 0.78, start: 3 },
];

function nextManeuver(
  d: DroneState,
  W: number,
  bounds: Bounds,
  cfg: DroneConfig,
): Maneuver {
  const from = { x: d.pose.x, y: d.pose.y };
  const roomy = from.y > bounds.minY + cfg.size * 1.15;

  // Turn-around scheduled from the last leg: reverse and head back.
  if (d.turn) {
    d.turn = false;
    const m = roomy
      ? loopMan(from, d.facing, bounds, cfg.size, true, 1.9)
      : rollMan(from, d.facing, true);
    d.facing *= -1;
    return m;
  }

  // Freestyle trick between legs.
  if (Math.random() < cfg.trick) {
    const r = Math.random();
    if (r < 0.4) return flipMan(from, d.facing, bounds);
    if (r < 0.7 || !roomy) return rollMan(from, d.facing);
    return loopMan(from, d.facing, bounds, cfg.size, false, 1.7);
  }

  // Otherwise fly the next obstacle: thread gates, bow around the rest.
  const o = COURSE[d.i];
  const man =
    o.kind === "gate"
      ? gatePass(from, o, W, d.facing)
      : weaveAround(from, o, W, d.facing, bounds);

  const ni = d.i + d.dir;
  if (ni < 0 || ni >= COURSE.length) {
    d.turn = true;
    d.dir *= -1;
    d.i += d.dir;
  } else {
    d.i = ni;
  }
  return man;
}

/* ---------------------------------------------------------------------------
   Rendering
--------------------------------------------------------------------------- */

function ObstacleGlyph({ kind, size }: { kind: ObstacleKind; size: number }) {
  if (kind === "gate") {
    return (
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        style={{ width: size, height: size }}
        className="text-signal"
      >
        <rect
          x="14"
          y="14"
          width="72"
          height="72"
          rx="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="10 7"
          opacity="0.7"
        />
        <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M8 22V8h14M78 8h14v14M92 78v14H78M22 92H8V78" />
        </g>
      </svg>
    );
  }
  if (kind === "pylon") {
    return (
      <svg
        viewBox="0 0 60 120"
        aria-hidden="true"
        style={{ width: size * 0.5, height: size }}
        className="text-signal"
      >
        <path
          d="M22 12h16l8 96H14z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <g stroke="currentColor" strokeWidth="1.6" opacity="0.55">
          <path d="M19 44h22M17 68h26M15 92h30" />
        </g>
        <circle cx="30" cy="10" r="3" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      style={{ width: size, height: size }}
      className="text-signal"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.8"
      >
        <path d="M20 34l30-16 30 16-30 16z" />
        <path d="M20 34v34l30 16V50z" />
        <path d="M80 34v34l-30 16V50z" opacity="0.6" />
      </g>
    </svg>
  );
}

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

function ObstacleLayer({
  obstacle: o,
  progress,
  px,
}: {
  obstacle: Obstacle;
  progress: MotionValue<number>;
  px: MotionValue<number>;
}) {
  const scrollY = useTransform(progress, [0, 1], [o.depth, -o.depth]);
  const leanX = useTransform(px, (v) => (v * o.depth) / 64);
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${o.fx * 100}%`,
        top: o.top,
        opacity: o.opacity,
        x: leanX,
        y: scrollY,
        willChange: "transform",
      }}
    >
      <ObstacleGlyph kind={o.kind} size={o.size} />
    </motion.div>
  );
}

/** One flown drone: owns its motion values and runs its own rAF sequencer. */
function Drone({
  config,
  W,
  px,
  py,
}: {
  config: DroneConfig;
  W: number;
  px: MotionValue<number>;
  py: MotionValue<number>;
}) {
  const { size } = config;
  // Seed the pose from the measured width so the first painted frame is already
  // in place — no flash at the origin, and no setState inside the effect.
  const startX = clamp(config.startX * W, size * 0.5, W - size * 0.5) - size / 2;
  const startY = clamp(bandTop(config.startF), 24, BAND_H - 24) - size * 0.3;
  const x = useMotionValue(startX);
  const y = useMotionValue(startY);
  const pitch = useMotionValue(0);
  const roll = useMotionValue(0);
  const facing = useMotionValue(1);

  // Cursor lean — closer (larger) drones lean a touch more.
  const leanX = useTransform(px, (v) => v * 0.4 * (size / 80));
  const leanY = useTransform(py, (v) => v * 0.4 * (size / 80));

  useEffect(() => {
    if (!W) return;
    const offX = size / 2;
    const offY = size * 0.3;
    const bounds: Bounds = {
      minX: size * 0.5,
      maxX: W - size * 0.5,
      minY: 24,
      maxY: BAND_H - 24,
    };

    const d: DroneState = {
      i: config.start % COURSE.length,
      dir: 1,
      facing: 1,
      turn: false,
      pose: {
        x: clamp(config.startX * W, bounds.minX, bounds.maxX),
        y: clamp(bandTop(config.startF), bounds.minY, bounds.maxY),
        pitch: 0,
        roll: 0,
        facing: 1,
      },
    };

    const apply = (p: Pose) => {
      x.set(p.x - offX);
      y.set(p.y - offY);
      pitch.set(p.pitch);
      roll.set(p.roll);
      facing.set(p.facing);
    };

    let man = nextManeuver(d, W, bounds, config);
    let start = performance.now();
    let raf = 0;
    let paused = false;
    let pauseAt = 0;

    apply(d.pose);

    const tick = (now: number) => {
      let t = (now - start) / 1000 / (man.dur * config.speed);
      if (t >= 1) {
        d.pose = man.end;
        man = nextManeuver(d, W, bounds, config);
        start = now;
        t = 0;
      }
      apply(man.sample(t));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Pause off-tab so the animation never burns cycles in the background.
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        paused = true;
        pauseAt = performance.now();
      } else if (paused) {
        paused = false;
        start += performance.now() - pauseAt;
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [W, size]);

  return (
    <motion.div
      className="absolute left-0 top-0 text-signal"
      style={{ x: leanX, y: leanY, willChange: "transform" }}
    >
      <motion.div style={{ x, y, willChange: "transform" }}>
        <div
          className="relative"
          style={{ width: size, height: size * 0.6, opacity: config.opacity }}
        >
          {config.tracked ? <Lock size={size} /> : null}
          <motion.div style={{ rotate: pitch }}>
            <motion.div style={{ rotateX: roll, transformPerspective: 600 }}>
              <motion.div style={{ scaleX: facing }}>
                <DroneQuad className="h-auto w-full" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Fixed positions for the reduced-motion still. */
const STILLS = [
  { left: "18%", top: "28%", size: 68, opacity: 0.5, tracked: true },
  { left: "68%", top: "48%", size: 50, opacity: 0.32 },
  { left: "46%", top: "72%", size: 58, opacity: 0.36 },
];

/**
 * Ambient FPV flyover for the Make section. Amber quad silhouettes fly an
 * improvised freestyle line through a small course — threading race gates,
 * bowing around a pylon and blocks, and throwing flips, rolls, loops and
 * Immelmann turns — with the site's reticle locked onto the lead one. The
 * whole scene drifts gently with scroll and cursor. Sits behind the content,
 * ignores pointer events, and honours reduced motion with a calm still.
 */
export function DroneFlyover() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const px = useSpring(0, { stiffness: 60, damping: 20 });
  const py = useSpring(0, { stiffness: 60, damping: 20 });

  // Measure the container so the flight math and the glyphs share coordinates.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  // Cursor parallax lives on the window (not the backdrop) so the scene never
  // intercepts clicks or selection over the content above it.
  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        px.set(((event.clientX - rect.left) / rect.width - 0.5) * 24);
        py.set(((event.clientY - rect.top) / rect.height - 0.5) * 16);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced, px, py]);

  if (reduced) {
    return (
      <div className="absolute inset-0">
        {COURSE.map((o, i) => (
          <div
            key={`o${i}`}
            className="absolute"
            style={{ left: `${o.fx * 100}%`, top: o.top, opacity: o.opacity }}
          >
            <ObstacleGlyph kind={o.kind} size={o.size} />
          </div>
        ))}
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
    <div ref={ref} className="absolute inset-0">
      {COURSE.map((o, i) => (
        <ObstacleLayer key={`o${i}`} obstacle={o} progress={scrollYProgress} px={px} />
      ))}

      {width > 0
        ? DRONES.map((config) => (
            <Drone key={config.id} config={config} W={width} px={px} py={py} />
          ))
        : null}
    </div>
  );
}
