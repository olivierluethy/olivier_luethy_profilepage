import type { ReactNode } from "react";

import { Reticle } from "@/components/reticle";
import { Reveal } from "@/components/ui/reveal";

export interface SectionProps {
  /** Jump-nav target; must match an id in `homeSections`. */
  id: string;
  /** Short OSD channel label shown above the heading. */
  callsign: string;
  title: string;
  /** Optional standfirst under the heading. */
  lede?: string;
  children: ReactNode;
  /** Extra classes on the <section> — used for alternating backgrounds. */
  className?: string;
  /**
   * Optional decorative layer rendered behind the content, clipped to the
   * section. Non-interactive and hidden from assistive tech.
   */
  backdrop?: ReactNode;
}

/**
 * Shared homepage section shell: consistent rhythm, heading treatment and
 * scroll offset so every jump-nav target lands clear of the sticky nav.
 */
export function Section({
  id,
  callsign,
  title,
  lede,
  children,
  className = "",
  backdrop,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`scroll-mt-nav border-t border-line py-10 sm:py-20 lg:py-24 ${
        backdrop ? "relative isolate overflow-hidden" : ""
      } ${className}`}
    >
      {backdrop ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {backdrop}
        </div>
      ) : null}
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="flex items-center gap-2.5 font-mono text-hud uppercase text-signal-ink">
            <Reticle className="size-4" />
            {callsign}
          </p>
          <h2
            id={`${id}-heading`}
            className="mt-4 max-w-3xl text-balance font-display text-display font-bold sm:mt-5"
          >
            {title}
          </h2>
          {lede ? (
            <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:mt-5 sm:text-lg">
              {lede}
            </p>
          ) : null}
        </Reveal>

        <div className="mt-8 sm:mt-10">{children}</div>
      </div>
    </section>
  );
}
