"use client";

import type { TechIcon } from "@/lib/tech-icons";

/**
 * A wall of the technologies used across the projects. Tapping one asks the
 * project explorer (further down the page) to filter to it, via a window event
 * so neither component has to own the other's state or pull the page into
 * dynamic rendering.
 */
export function TechGrid({ tech }: { tech: TechIcon[] }) {
  const select = (name: string) => {
    window.dispatchEvent(new CustomEvent("select-tech", { detail: name }));
  };

  return (
    <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
      {tech.map((item) => (
        <li key={item.name}>
          <button
            type="button"
            onClick={() => select(item.name)}
            title={`Show projects using ${item.name}`}
            className="group flex w-full flex-col items-center gap-2.5 rounded-lg border border-line bg-panel px-2 py-4 text-muted transition-colors hover:border-signal/50 hover:text-signal-ink"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={`size-7 ${item.branded ? "" : "opacity-50"}`}
            >
              <path d={item.path} fill="currentColor" />
            </svg>
            <span className="text-center font-mono text-hud uppercase leading-tight">
              {item.name}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
