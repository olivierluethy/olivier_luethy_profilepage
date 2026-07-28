import type { SVGProps } from "react";

/**
 * Side-profile FPV freestyle quad, drawn in `currentColor` so a parent can tint
 * it with the signal accent. This is the natural viewpoint — the drone seen
 * from the side as it flies past, nose (camera) pointing right by default; the
 * flyover mirrors it for left-bound drones.
 *
 * The two propellers are edge-on discs that flicker via the `.drone-prop` class
 * to read as spinning blur; the reduced-motion rules in globals.css stop them.
 */
export function DroneQuad({
  spin = true,
  ...props
}: SVGProps<SVGSVGElement> & { spin?: boolean }) {
  const propClass = spin ? "drone-prop" : undefined;
  return (
    <svg viewBox="0 0 160 96" fill="none" aria-hidden="true" {...props}>
      {/* Arms rising from the body to each motor */}
      <g stroke="currentColor" strokeWidth="7" strokeLinecap="round">
        <line x1="66" y1="58" x2="38" y2="42" />
        <line x1="94" y1="58" x2="122" y2="42" />
      </g>

      {/* Motor bells */}
      <rect x="32" y="33" width="12" height="13" rx="2.5" fill="currentColor" />
      <rect x="116" y="33" width="12" height="13" rx="2.5" fill="currentColor" />

      {/* Spinning props, seen edge-on as thin discs */}
      <g className={propClass} style={{ transformOrigin: "38px 30px" }}>
        <ellipse cx="38" cy="30" rx="31" ry="5" fill="currentColor" opacity="0.28" />
        <ellipse cx="38" cy="30" rx="31" ry="1.4" fill="currentColor" opacity="0.6" />
      </g>
      <g className={propClass} style={{ transformOrigin: "122px 30px", animationDelay: "0.06s" }}>
        <ellipse cx="122" cy="30" rx="31" ry="5" fill="currentColor" opacity="0.28" />
        <ellipse cx="122" cy="30" rx="31" ry="1.4" fill="currentColor" opacity="0.6" />
      </g>

      {/* Immortal-T VTX antenna at the back */}
      <g stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
        <line x1="58" y1="52" x2="58" y2="17" />
        <line x1="49" y1="17" x2="67" y2="17" />
      </g>

      {/* Battery strapped on top of the frame */}
      <rect x="63" y="40" width="34" height="15" rx="3" fill="currentColor" opacity="0.85" />
      {/* Carbon frame plate */}
      <rect x="59" y="54" width="42" height="12" rx="4" fill="currentColor" />

      {/* Camera barrel at the front, lens leading the direction of flight */}
      <line
        x1="99"
        y1="52"
        x2="116"
        y2="47"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <circle cx="118" cy="46" r="4" fill="currentColor" />
    </svg>
  );
}
