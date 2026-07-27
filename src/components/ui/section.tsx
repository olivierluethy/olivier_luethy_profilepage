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
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`scroll-mt-nav border-t border-line py-14 sm:py-24 lg:py-28 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
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

        <div className="mt-10 sm:mt-12">{children}</div>
      </div>
    </section>
  );
}
