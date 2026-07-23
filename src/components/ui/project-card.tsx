import Image from "next/image";
import Link from "next/link";

import { Reticle } from "@/components/reticle";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/ui/status-pill";
import type { ProjectSummary } from "@/lib/content/types";

export interface ProjectCardProps {
  project: ProjectSummary;
  /** `featured` gets the cover image and more room; `compact` is list density. */
  variant?: "featured" | "compact";
  /** Featured cards render an <h3> by default; the grid may need <h4>. */
  priority?: boolean;
}

/**
 * Project card used by both homepage project sections. Hover motion is pure
 * CSS on the group, so the card stays a server component.
 */
export function ProjectCard({
  project,
  variant = "featured",
  priority = false,
}: ProjectCardProps) {
  const { frontmatter, dateRange } = project;
  const href = `/projects/${frontmatter.slug}`;

  if (variant === "compact") {
    return (
      <Link
        href={href}
        className="group flex flex-col gap-4 rounded-lg border border-line bg-panel p-5 transition-all duration-300 hover:-translate-y-1 hover:border-signal/50 hover:shadow-panel sm:flex-row sm:items-start sm:gap-6"
      >
        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded border border-line sm:w-44">
          <Image
            src={frontmatter.coverImage}
            alt={`Cover image for ${frontmatter.title}`}
            fill
            sizes="(min-width: 640px) 176px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <StatusPill status={frontmatter.status} />
            <span className="font-mono text-hud uppercase text-faint">
              {dateRange}
            </span>
          </div>

          <h3 className="mt-3 font-display text-xl font-semibold text-balance transition-colors group-hover:text-signal-ink">
            {frontmatter.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-pretty text-sm leading-relaxed text-muted">
            {frontmatter.summary}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {frontmatter.techStack.slice(0, 4).map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
            {frontmatter.techStack.length > 4 ? (
              <Badge tone="outline">+{frontmatter.techStack.length - 4}</Badge>
            ) : null}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-panel transition-all duration-300 hover:-translate-y-1.5 hover:border-signal/50 hover:shadow-panel"
    >
      <div className="relative aspect-video overflow-hidden border-b border-line">
        <Image
          src={frontmatter.coverImage}
          alt={`Cover image for ${frontmatter.title}`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 560px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {/* Corner reticle — appears on hover as a lock-on cue. */}
        <Reticle className="absolute right-4 top-4 size-5 text-signal opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <StatusPill status={frontmatter.status} />
          <span className="font-mono text-hud uppercase text-faint">
            {dateRange}
          </span>
        </div>

        <h3 className="mt-4 text-balance font-display text-display-sm font-bold transition-colors group-hover:text-signal-ink">
          {frontmatter.title}
        </h3>
        <p className="mt-3 text-pretty leading-relaxed text-muted">
          {frontmatter.summary}
        </p>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {frontmatter.techStack.slice(0, 5).map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>

        <span className="mt-6 inline-flex items-center gap-2 font-mono text-hud uppercase text-signal-ink">
          Read the write-up
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
