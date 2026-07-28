import type { SVGProps } from "react";

const MOTORS = [
  { x: 26, y: 26 },
  { x: 94, y: 26 },
  { x: 26, y: 94 },
  { x: 94, y: 94 },
];

/**
 * Top-down FPV quad silhouette, drawn in `currentColor` so a parent can tint it
 * with the signal accent. The four props spin via the `.drone-prop` CSS class,
 * which the reduced-motion rules in globals.css stop automatically.
 */
export function DroneQuad({
  spin = true,
  ...props
}: SVGProps<SVGSVGElement> & { spin?: boolean }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" {...props}>
      {/* Arms */}
      <g stroke="currentColor" strokeWidth="6" strokeLinecap="round">
        <line x1="60" y1="60" x2="26" y2="26" />
        <line x1="60" y1="60" x2="94" y2="26" />
        <line x1="60" y1="60" x2="26" y2="94" />
        <line x1="60" y1="60" x2="94" y2="94" />
      </g>

      {/* Prop discs — a translucent sweep plus two blades per motor */}
      {MOTORS.map((m, i) => (
        <g
          key={i}
          className={spin ? "drone-prop" : undefined}
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <circle cx={m.x} cy={m.y} r="17" fill="currentColor" opacity="0.1" />
          <ellipse cx={m.x} cy={m.y} rx="17" ry="2.6" fill="currentColor" opacity="0.4" />
          <ellipse cx={m.x} cy={m.y} rx="2.6" ry="17" fill="currentColor" opacity="0.4" />
        </g>
      ))}

      {/* Motor bells */}
      {MOTORS.map((m, i) => (
        <circle
          key={i}
          cx={m.x}
          cy={m.y}
          r="6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
      ))}

      {/* Body */}
      <rect x="46" y="47" width="28" height="31" rx="6" fill="currentColor" />
      {/* Camera nub at the front */}
      <rect x="54" y="40" width="12" height="10" rx="2.5" fill="currentColor" />
      {/* Rear antenna */}
      <line x1="60" y1="78" x2="60" y2="92" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="60" cy="92" r="2.4" fill="currentColor" />
    </svg>
  );
}
