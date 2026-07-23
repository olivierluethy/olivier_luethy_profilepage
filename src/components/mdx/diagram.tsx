import { MdxImage } from "@/components/mdx/mdx-image";
import { getImageSize } from "@/lib/image-size";
import { site } from "@/lib/site";

export interface DiagramProps {
  /**
   * Path under /public. Either an export (`.drawio.svg`, `.svg`, `.png`) or a
   * raw diagrams.net file (`.drawio`, `.xml`).
   */
  src: string;
  alt: string;
  /** Optional caption shown under the diagram. */
  caption?: string;
}

/**
 * Renders a diagram inline, never behind a click.
 *
 * Exported images are treated as ordinary responsive images, which is the
 * preferred route because they need no third party and stay crisp. A raw
 * diagrams.net file is embedded through the diagrams.net viewer instead, which
 * fetches the file over the network and therefore needs the deployed site URL
 * — it will not resolve against localhost.
 */
export async function Diagram({ src, alt, caption }: DiagramProps) {
  const isRawDiagram = /\.(drawio|xml)$/i.test(src);

  if (!isRawDiagram) {
    const { width, height } = await getImageSize(src);
    return (
      <MdxImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        caption={caption}
      />
    );
  }

  const absolute = `${site.url.replace(/\/$/, "")}${src}`;
  const viewer = `https://viewer.diagrams.net/?lightbox=1&highlight=FF8A3D&nav=1&title=${encodeURIComponent(
    alt,
  )}#U${encodeURIComponent(absolute)}`;

  return (
    <figure className="my-8">
      <div className="aspect-[16/10] overflow-hidden rounded-lg border border-line bg-panel">
        <iframe
          src={viewer}
          title={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="size-full"
        />
      </div>
      <figcaption className="mt-3 font-mono text-hud uppercase text-faint">
        {caption ?? alt} · diagrams.net
      </figcaption>
    </figure>
  );
}
