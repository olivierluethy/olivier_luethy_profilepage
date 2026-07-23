"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentType, CSSProperties } from "react";

interface ModelViewerElementProps {
  src: string;
  alt: string;
  poster?: string;
  "camera-controls"?: boolean;
  "auto-rotate"?: boolean;
  "shadow-intensity"?: string;
  "touch-action"?: string;
  "interaction-prompt"?: string;
  ar?: boolean;
  loading?: "auto" | "lazy" | "eager";
  style?: CSSProperties;
  className?: string;
}

/**
 * `<model-viewer>` is a custom element, so it has no JSX intrinsic type.
 * Casting the tag name keeps the call site fully typed without augmenting the
 * global JSX namespace.
 */
const ModelViewerElement =
  "model-viewer" as unknown as ComponentType<ModelViewerElementProps>;

export interface ModelViewerProps {
  /** Path under /public to a .glb or .gltf file. */
  src: string;
  /** Describes the model for screen readers — required, not optional. */
  alt: string;
  /** Shown while the viewer bundle and model load. */
  poster: string;
  className?: string;
}

/**
 * Inline 3D model viewer for CAD exports.
 *
 * The model-viewer bundle is large, so it is only fetched once the component
 * scrolls near the viewport. Until then the poster image stands in, which also
 * means the section costs nothing for visitors who never scroll to it.
 */
export function ModelViewer({ src, alt, poster, className = "" }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    let cancelled = false;

    const load = () => {
      import("@google/model-viewer")
        .then(() => {
          if (!cancelled) setReady(true);
        })
        .catch(() => {
          if (!cancelled) setFailed(true);
        });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          load();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      ref={containerRef}
      className={`relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-panel ${className}`}
    >
      {ready && !failed ? (
        <ModelViewerElement
          src={src}
          alt={alt}
          poster={poster}
          camera-controls
          auto-rotate={!prefersReducedMotion}
          shadow-intensity="1"
          touch-action="pan-y"
          loading="lazy"
          style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt={alt}
          className="size-full object-cover"
          loading="lazy"
        />
      )}

      <span className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-line bg-ground/85 px-2.5 py-1 font-mono text-hud uppercase text-muted backdrop-blur-sm">
        {failed ? "3D unavailable" : ready ? "Drag to orbit" : "3D model"}
      </span>
    </div>
  );
}
