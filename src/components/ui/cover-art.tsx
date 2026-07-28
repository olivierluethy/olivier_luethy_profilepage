import Image from "next/image";

/** First 1–2 letters, used when a project has neither cover nor logo. */
function initials(title: string): string {
  const words = title
    .replace(/[^\p{L}\p{N} ]/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return title.replace(/[^\p{L}\p{N}]/gu, "").slice(0, 2).toUpperCase();
}

export interface CoverArtProps {
  coverImage: string;
  favicon: string;
  title: string;
  /** next/image sizes hint for the real-cover case. */
  sizes: string;
  priority?: boolean;
}

/**
 * The image at the top of a project card / the preview fallback. When there is
 * no cover banner it shows the project logo on a panel, and when there is not
 * even a logo it shows a monogram — so a card never renders an empty rectangle.
 */
export function CoverArt({
  coverImage,
  favicon,
  title,
  sizes,
  priority = false,
}: CoverArtProps) {
  if (coverImage) {
    return (
      <Image
        src={coverImage}
        alt={`Cover image for ${title}`}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
    );
  }

  return (
    <div className="flex size-full items-center justify-center bg-panel">
      {favicon ? (
        <Image
          src={favicon}
          alt={`Logo for ${title}`}
          width={96}
          height={96}
          unoptimized
          className="size-[38%] max-h-24 max-w-24 rounded-xl object-contain transition-transform duration-700 group-hover:scale-[1.06]"
        />
      ) : (
        <span className="font-display text-5xl font-bold text-faint transition-colors group-hover:text-signal-ink">
          {initials(title)}
        </span>
      )}
    </div>
  );
}
