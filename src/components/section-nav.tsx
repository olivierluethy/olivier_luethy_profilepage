"use client";

import { useEffect, useState } from "react";

import { SectionIcon } from "@/components/section-icons";
import { homeSections } from "@/lib/sections";

/**
 * Homepage jump navigation — the site's signature element.
 *
 * On desktop it is a fixed labelled rail on the right edge; on smaller screens
 * it is a sticky panel below the main nav that WRAPS so every section is
 * visible at once (no horizontal scrolling, nothing hidden off-screen). Both
 * are driven by one scroll-spy and both are plain anchors + icons, so a jump
 * always lands immediately regardless of what is animating on the way past.
 */
export function SectionNav() {
  const [active, setActive] = useState<string>(homeSections[0].id);

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

  return (
    <>
      {/* Desktop: fixed labelled rail on the right edge */}
      <nav
        aria-label="Page sections"
        className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 rail:block"
      >
        <ul className="pointer-events-auto flex flex-col gap-0.5 rounded-2xl border border-line bg-ground/70 p-1.5 backdrop-blur-md">
          {homeSections.map((section) => {
            const isActive = section.id === active;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`group flex items-center gap-2.5 rounded-full py-1.5 pl-2.5 pr-3.5 transition-colors ${
                    isActive
                      ? "bg-signal-wash text-signal-ink"
                      : "text-faint hover:text-muted"
                  }`}
                >
                  <SectionIcon
                    id={section.id}
                    className={`size-4 shrink-0 transition-colors ${
                      isActive ? "text-signal-ink" : "text-line-strong group-hover:text-muted"
                    }`}
                  />
                  <span className="font-mono text-hud uppercase">
                    {section.short}
                  </span>
                  <span className="sr-only">{section.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile and tablet: sticky panel that wraps — all sections visible */}
      <nav
        aria-label="Page sections"
        className="sticky top-nav z-40 border-b border-line bg-ground/90 backdrop-blur-md rail:hidden"
      >
        <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-1.5 px-3 py-2.5">
          {homeSections.map((section) => {
            const isActive = section.id === active;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 font-mono text-hud uppercase transition-colors ${
                    isActive
                      ? "border-signal bg-signal text-[#0B0F14]"
                      : "border-line bg-panel text-muted"
                  }`}
                >
                  <SectionIcon id={section.id} className="size-3.5 shrink-0" />
                  {section.short}
                  <span className="sr-only"> — {section.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
