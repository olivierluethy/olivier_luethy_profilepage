"use client";

import Image from "next/image";
import { useRef } from "react";

export interface MdxImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Rendered under the image when the author supplies a markdown title. */
  caption?: string;
}

/**
 * Responsive, zoomable image for MDX bodies.
 *
 * Zoom uses a native <dialog>, which gives focus trapping, Esc-to-close and
 * inert background for free. Dimensions are measured at build time by
 * `getImageSize`, so the space is reserved correctly and nothing shifts.
 */
export function MdxImage({ src, alt, width, height, caption }: MdxImageProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <figure className="my-8">
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="group block w-full cursor-zoom-in overflow-hidden rounded-lg border border-line bg-panel"
        aria-label={`Enlarge image: ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 768px) 720px, 100vw"
          className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </button>

      {caption ? (
        <figcaption className="mt-3 font-mono text-hud uppercase text-faint">
          {caption}
        </figcaption>
      ) : null}

      <dialog
        ref={dialogRef}
        onClick={() => dialogRef.current?.close()}
        className="m-auto max-h-[92vh] max-w-[95vw] cursor-zoom-out bg-transparent p-0 backdrop:bg-black/85 backdrop:backdrop-blur-sm"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="95vw"
          className="h-auto max-h-[92vh] w-auto rounded-lg object-contain"
        />
      </dialog>
    </figure>
  );
}
