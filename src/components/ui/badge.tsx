import type { ReactNode } from "react";

export type BadgeTone = "default" | "signal" | "outline";

const TONES: Record<BadgeTone, string> = {
  default: "border-line bg-panel text-muted",
  signal: "border-signal/40 bg-signal-wash text-signal-ink",
  outline: "border-line-strong bg-transparent text-muted",
};

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

/** Small mono chip used for tech stack, tags and metadata values. */
export function Badge({ children, tone = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-hud uppercase ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
