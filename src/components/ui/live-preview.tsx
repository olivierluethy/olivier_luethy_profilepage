"use client";

import { useEffect, useRef, useState } from "react";

import { ActionLink } from "@/components/ui/action-link";
import { CoverArt } from "@/components/ui/cover-art";

/**
 * `refused` comes from the build-time header probe and is a fact.
 * `timeout` means the frame never reported a load — which could be a slow
 * network just as easily as a block, so the two are never conflated in
 * what the page tells the reader.
 */
type PreviewState = "waiting" | "loading" | "ready" | "refused" | "timeout";

export interface LivePreviewProps {
  url: string;
  /** Falls back to this whenever the frame cannot be shown. */
  coverImage: string;
  /** Project logo, for the fallback when there is no cover banner. */
  favicon: string;
  title: string;
  /** Result of the build-time header probe. */
  embeddable: boolean;
}

const LOAD_TIMEOUT_MS = 12000;

const STATUS_COPY: Record<PreviewState, string> = {
  waiting: "Live preview, running in the page",
  loading: "Live preview, running in the page",
  ready: "Live preview, running in the page",
  refused: "This site refuses to be embedded — open it in a new tab",
  timeout: "The preview did not load in time — open it in a new tab",
};

/**
 * Live embedded preview of a project.
 *
 * The frame only starts loading once it scrolls near the viewport and shows a
 * skeleton until it reports a load. Whenever it cannot be shown, the section
 * falls back to a large cover preview with a prominent "Try it" button, so it
 * is always useful rather than sometimes an empty rectangle.
 */
export function LivePreview({
  url,
  coverImage,
  favicon,
  title,
  embeddable,
}: LivePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<PreviewState>(
    embeddable ? "waiting" : "refused",
  );

  // Start loading only when the preview nears the viewport.
  useEffect(() => {
    if (!embeddable) return;
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          setState((current) => (current === "waiting" ? "loading" : current));
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [embeddable]);

  // Fall back if the frame never reports a load.
  useEffect(() => {
    if (state !== "loading") return;

    const timer = setTimeout(() => {
      setState((current) => (current === "loading" ? "timeout" : current));
    }, LOAD_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [state]);

  const showFrame = state === "loading" || state === "ready";

  return (
    <div ref={containerRef}>
      <div className="relative aspect-video overflow-hidden rounded-xl border border-line bg-panel">
        {showFrame ? (
          <iframe
            src={url}
            title={`Live preview of ${title}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            className="size-full"
            onLoad={() => setState("ready")}
          />
        ) : (
          <CoverArt
            coverImage={coverImage}
            favicon={favicon}
            title={title}
            sizes="(min-width: 1024px) 900px, 100vw"
          />
        )}

        {/* Skeleton, covering the frame until it reports a load. */}
        {state === "loading" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-panel">
            <div className="flex flex-col items-center gap-3">
              <div className="h-1 w-32 overflow-hidden rounded-full bg-line">
                <div className="h-full w-1/3 animate-pulse rounded-full bg-signal" />
              </div>
              <span className="font-mono text-hud uppercase text-faint">
                Loading live preview
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <ActionLink href={url} variant="primary" external>
          Try it →
        </ActionLink>
        <span className="font-mono text-hud uppercase text-faint">
          {STATUS_COPY[state]}
        </span>
      </div>
    </div>
  );
}
