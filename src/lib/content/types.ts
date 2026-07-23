/** Shared types for the MDX content layer. */

export type ProjectStatus = "active" | "archived";

/**
 * Frontmatter for `/content/projects/*.mdx`.
 *
 * Only `endDate` is meaningfully optional at authoring time — an empty string
 * means the project is ongoing. The URL fields may be omitted in the file and
 * are normalised to `""` by the loader, so consumers can test truthiness.
 */
export interface ProjectFrontmatter {
  title: string;
  slug: string;
  summary: string;
  /** What this person actually did, in their own words. */
  role: string;
  status: ProjectStatus;
  /** `YYYY-MM`. */
  startDate: string;
  /** `YYYY-MM`, or `""` while ongoing. */
  endDate: string;
  techStack: string[];
  /** Third-party services and APIs the project talks to. */
  interfaces: string[];
  /** AI models/APIs used, if any. */
  aiModels: string[];
  liveUrl: string;
  githubUrl: string;
  linkedinPostUrl: string;
  coverImage: string;
  featured: boolean;
  tags: string[];
}

/** Frontmatter for `/content/blog/*.mdx`. */
export interface BlogFrontmatter {
  title: string;
  slug: string;
  /** `YYYY-MM-DD`. */
  date: string;
  summary: string;
  coverImage: string;
  tags: string[];
  /** Slugs of projects this post is about; rendered as inline project cards. */
  relatedProjects: string[];
}

/** Fields the loader derives so pages don't repeat the same date maths. */
export interface ProjectComputed {
  /** True when `endDate` is empty. */
  isOngoing: boolean;
  /** Human range, e.g. `Apr 2026 — Present`. */
  dateRange: string;
  /** Sort key: ms timestamp of `startDate`. */
  startedAt: number;
  /** Sort key: ms timestamp of `endDate`, or `Infinity` while ongoing. */
  endedAt: number;
}

/**
 * A project without its MDX body.
 *
 * Client components (the filterable project list) take this shape so the raw
 * MDX never has to be serialised into the browser payload.
 */
export interface ProjectSummary extends ProjectComputed {
  frontmatter: ProjectFrontmatter;
}

export interface Project extends ProjectSummary {
  /** Raw MDX body, compiled at render time. */
  body: string;
}

export interface BlogPost {
  frontmatter: BlogFrontmatter;
  body: string;
  /** Sort key: ms timestamp of `date`. */
  publishedAt: number;
  /** Human date, e.g. `12 June 2026`. */
  formattedDate: string;
  /** Rounded reading time in minutes, minimum 1. */
  readingMinutes: number;
}
