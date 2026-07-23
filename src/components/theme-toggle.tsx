"use client";

import { useTheme } from "next-themes";

function SunGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5">
      <circle cx="8" cy="8" r="3" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.1 3.1l1.4 1.4M11.5 11.5l1.4 1.4M12.9 3.1l-1.4 1.4M4.5 11.5l-1.4 1.4" />
      </g>
    </svg>
  );
}

function MoonGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5">
      <path d="M13.5 9.8A6 6 0 0 1 6.2 2.5a6 6 0 1 0 7.3 7.3Z" fill="currentColor" />
    </svg>
  );
}

/**
 * Theme switch, styled as an OSD mode readout rather than a generic icon button.
 *
 * The two states are driven by the `dark:` variant rather than by React state,
 * so the correct label paints before hydration — no mount guard, no flash and
 * no hydration mismatch. `resolvedTheme` is only read inside the click handler,
 * by which point the client is always hydrated.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line px-3 font-mono text-hud uppercase text-muted transition-colors hover:border-signal hover:text-signal-ink"
      aria-label="Switch between day and night theme"
    >
      <span className="flex items-center gap-1.5 dark:hidden">
        <SunGlyph />
        <span className="hidden sm:inline">Day</span>
      </span>
      <span className="hidden items-center gap-1.5 dark:flex">
        <MoonGlyph />
        <span className="hidden sm:inline">Night</span>
      </span>
    </button>
  );
}
