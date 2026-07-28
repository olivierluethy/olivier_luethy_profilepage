"use client";

import { useState } from "react";

import { StlViewer } from "@/components/ui/stl-viewer";
import type { FusionVersion } from "@/lib/data/fusion";

export interface FusionViewerProps {
  /** Ordered oldest → final. */
  versions: FusionVersion[];
  /** Project title, used in the viewer's accessible label. */
  title: string;
}

/**
 * The interactive centrepiece of a process page: one STL viewer plus a switcher
 * across every design iteration. Defaults to the final (last) version.
 */
export function FusionViewer({ versions, title }: FusionViewerProps) {
  const [active, setActive] = useState(versions.length - 1);
  const current = versions[active];

  return (
    <div>
      <StlViewer
        src={current.file}
        alt={`Interactive 3D model — ${title}, ${current.label}`}
        className="aspect-[16/10] w-full"
      />

      <div
        role="group"
        aria-label="Design versions"
        className="mt-4 flex flex-wrap gap-2"
      >
        {versions.map((version, index) => {
          const isActive = index === active;
          return (
            <button
              key={version.file}
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={isActive}
              className={`rounded-full border px-3 py-1.5 font-mono text-hud uppercase transition-colors ${
                isActive
                  ? "border-signal bg-signal text-[#0B0F14]"
                  : "border-line bg-panel text-muted hover:border-signal/50 hover:text-signal-ink"
              }`}
            >
              {version.label}
            </button>
          );
        })}
      </div>

      <p
        aria-live="polite"
        className="mt-4 text-pretty text-sm leading-relaxed text-muted"
      >
        <span className="font-mono text-hud uppercase text-signal-ink">
          {current.label}
        </span>{" "}
        — {current.note}
      </p>
    </div>
  );
}
