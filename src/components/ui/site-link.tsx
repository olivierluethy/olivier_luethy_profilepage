import Image from "next/image";

import type { ProjectFrontmatter } from "@/lib/content/types";

/** Bare hostname for display, e.g. "flickclean.app". */
function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * The project's own web address, always shown as text rather than hidden behind
 * a button. Live projects show their site icon and link out; a project that has
 * gone offline states where it used to live instead of linking to a dead URL.
 */
export function SiteLink({
  frontmatter,
  className = "",
}: {
  frontmatter: ProjectFrontmatter;
  className?: string;
}) {
  const { liveUrl, formerUrl, favicon, title } = frontmatter;

  if (liveUrl) {
    return (
      <a
        href={liveUrl}
        target="_blank"
        rel="noreferrer noopener"
        className={`inline-flex items-center gap-2 font-mono text-hud uppercase text-muted transition-colors hover:text-signal-ink ${className}`}
      >
        {favicon ? (
          <Image
            src={favicon}
            alt={`${title} icon`}
            width={20}
            height={20}
            unoptimized
            className="size-5 rounded"
          />
        ) : null}
        {domainOf(liveUrl)}
        <span aria-hidden="true">↗</span>
      </a>
    );
  }

  if (formerUrl) {
    return (
      <span
        className={`inline-flex items-center gap-2 font-mono text-hud uppercase text-faint ${className}`}
      >
        Was at {domainOf(formerUrl)} — no longer online
      </span>
    );
  }

  return null;
}
