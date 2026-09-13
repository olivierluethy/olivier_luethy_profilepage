import type { ReactNode } from "react";

/**
 * Line icons for the homepage jump-nav, one per section id.
 *
 * Hand-drawn inline SVGs in the same stroke style as `Reticle` (1.5px,
 * rounded, `currentColor`) so no icon dependency is added and everything
 * inherits the active/inactive colour from its parent link.
 */

const ICONS: Record<string, ReactNode> = {
  // Home — a house
  top: (
    <>
      <path d="M5 12 3 12l9 -9 9 9 -2 0" />
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
      <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
    </>
  ),
  // Featured work — a star
  work: (
    <path d="M12 4l2.36 4.78 5.28 .77 -3.82 3.72 .9 5.26 -4.72 -2.48 -4.72 2.48 .9 -5.26 -3.82 -3.72 5.28 -.77z" />
  ),
  // Tech stack — code brackets
  stack: (
    <>
      <path d="M7.5 8.5 4 12l3.5 3.5" />
      <path d="M16.5 8.5 20 12l-3.5 3.5" />
      <path d="M13.5 5.5l-3 13" />
    </>
  ),
  // All projects — a grid
  projects: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.2" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2" />
    </>
  ),
  // Experience — a briefcase
  path: (
    <>
      <rect x="3" y="7.5" width="18" height="12.5" rx="2" />
      <path d="M8.5 7.5V5.5a2 2 0 0 1 2 -2h3a2 2 0 0 1 2 2v2" />
      <path d="M3 13a20 20 0 0 0 18 0" />
    </>
  ),
  // Hackathons — a trophy
  hackathons: (
    <>
      <path d="M7 4h10v6a5 5 0 0 1 -10 0z" />
      <path d="M7 6H4.7a1.2 1.2 0 0 0 -1.2 1.2v.4a3 3 0 0 0 3 3" />
      <path d="M17 6h2.3a1.2 1.2 0 0 1 1.2 1.2v.4a3 3 0 0 1 -3 3" />
      <path d="M12 15v3.5" />
      <path d="M9 21a3 3 0 0 1 6 0" />
      <path d="M8.5 21h7" />
    </>
  ),
  // Maker — a wrench
  maker: (
    <path d="M7 10h3v-3l-3.5 -3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1 -3 3l-6 -6a6 6 0 0 1 -8 -8l3.5 3.5" />
  ),
  // Photography — a camera
  photography: (
    <>
      <path d="M5 7.5h1.5a1.5 1.5 0 0 0 1.4 -1l.4 -1a1 1 0 0 1 .95 -.7h5.6a1 1 0 0 1 .95 .7l.4 1a1.5 1.5 0 0 0 1.4 1H19a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2H5a2 2 0 0 1 -2 -2v-8a2 2 0 0 1 2 -2" />
      <circle cx="12" cy="13" r="3.2" />
    </>
  ),
  // Sports — a running figure
  sports: (
    <>
      <circle cx="13" cy="4.5" r="1.6" />
      <path d="M4 17l5 1 .75 -1.5" />
      <path d="M15 21v-4l-4 -3 1 -6" />
      <path d="M7 12v-3l5 -1 3 3 3 1" />
    </>
  ),
  // Community — people
  community: (
    <>
      <circle cx="9" cy="7.5" r="3" />
      <path d="M3.5 20.5v-1.5a4 4 0 0 1 4 -4h3a4 4 0 0 1 4 4v1.5" />
      <path d="M16 4.75a3.5 3.5 0 0 1 0 6.5" />
      <path d="M20.5 20.5v-1.5a4 4 0 0 0 -3 -3.85" />
    </>
  ),
  // Writing — a pencil
  writing: (
    <>
      <path d="M4 20h4L18.5 9.5a2.5 2.5 0 0 0 -3.5 -3.5L4 16.5z" />
      <path d="M13.5 7l3.5 3.5" />
    </>
  ),
  // Contact — an envelope
  contact: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M4 7.5l8 5.5 8 -5.5" />
    </>
  ),
};

export interface SectionIconProps {
  /** Section id — the icon key. */
  id: string;
  className?: string;
}

/** Renders the line icon for a section id. */
export function SectionIcon({ id, className = "size-4" }: SectionIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {ICONS[id] ?? ICONS.top}
    </svg>
  );
}
