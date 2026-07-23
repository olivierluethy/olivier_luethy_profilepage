import type { ProjectStatus } from "@/lib/content/types";

export interface StatusPillProps {
  status: ProjectStatus;
  className?: string;
}

/**
 * Active/archived indicator. Active carries a pulsing signal dot; archived is
 * deliberately quiet so an honest "archived" never reads as a failure state.
 * Colour is never the only signal — the label always says which it is.
 */
export function StatusPill({ status, className = "" }: StatusPillProps) {
  const isActive = status === "active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-hud uppercase ${
        isActive
          ? "border-signal/40 bg-signal-wash text-signal-ink"
          : "border-line bg-panel text-faint"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${
          isActive ? "animate-pulse bg-signal" : "bg-faint"
        }`}
      />
      {isActive ? "Active" : "Archived"}
    </span>
  );
}
