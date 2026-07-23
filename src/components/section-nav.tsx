"use client";

import { useEffect, useRef, useState } from "react";

import { homeSections } from "@/lib/sections";

/**
 * Homepage jump navigation — the site's signature element.
 *
 * On desktop it is a fixed OSD channel rail on the right edge; on smaller
 * screens it becomes a sticky horizontal strip under the main nav. Both are
 * driven by one scroll-spy and both are plain anchors, so a jump always lands
 * immediately regardless of what is animating on the way past.
 */
export function SectionNav() {
  const [active, setActive] = useState<string>(homeSections[0].id);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // A thin band across the upper-middle of the viewport. Whichever section
    // is crossing it is the one the reader is looking at.
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 },
    );

    const elements = homeSections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  // Keep the active chip visible in the mobile strip.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const chip = strip.querySelector<HTMLAnchorElement>(`[data-chip="${active}"]`);
    if (!chip) return;

    const offset =
      chip.offsetLeft - strip.clientWidth / 2 + chip.clientWidth / 2;
    strip.scrollTo({ left: Math.max(0, offset), behavior: "smooth" });
  }, [active]);

  return (
    <>
      {/* Desktop: fixed channel rail */}
      <nav
        aria-label="Page sections"
        className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 rail:block"
      >
        <ul className="pointer-events-auto flex flex-col items-end gap-1">
          {homeSections.map((section) => {
            const isActive = section.id === active;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className="group flex items-center justify-end gap-2.5 py-1.5 pl-4"
                >
                  <span
                    className={`font-mono text-hud uppercase transition-colors ${
                      isActive
                        ? "text-signal-ink"
                        : "text-faint group-hover:text-muted"
                    }`}
                  >
                    {section.callsign}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`h-px transition-all duration-300 ${
                      isActive
                        ? "w-7 bg-signal"
                        : "w-3.5 bg-line-strong group-hover:w-5"
                    }`}
                  />
                  <span className="sr-only">{section.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile and tablet: sticky strip below the main nav */}
      <nav
        aria-label="Page sections"
        className="sticky top-nav z-40 border-b border-line bg-ground/85 backdrop-blur-md rail:hidden"
      >
        <div
          ref={stripRef}
          className="flex gap-1 overflow-x-auto px-4 py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {homeSections.map((section) => {
            const isActive = section.id === active;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                data-chip={section.id}
                aria-current={isActive ? "true" : undefined}
                className={`shrink-0 rounded-full border px-3 py-1.5 font-mono text-hud uppercase transition-colors ${
                  isActive
                    ? "border-signal bg-signal text-[#0B0F14]"
                    : "border-line bg-panel text-muted"
                }`}
              >
                {section.callsign}
                <span className="sr-only"> — {section.label}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
