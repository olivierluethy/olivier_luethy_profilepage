import type { SVGProps } from "react";

/**
 * The site's recurring motif: an FPV on-screen-display targeting reticle.
 * Used as the brand mark and as a section marker.
 */
export function Reticle({
  className = "size-4",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {/* Corner brackets */}
      <path
        d="M2 7V2h5M17 2h5v5M22 17v5h-5M7 22H2v-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      {/* Crosshair */}
      <path
        d="M12 8.5v2.25M12 13.25v2.25M8.5 12h2.25M13.25 12h2.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
