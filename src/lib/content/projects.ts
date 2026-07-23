import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

import matter from "gray-matter";

import { formatRange, toTimestamp } from "@/lib/content/dates";
import {
  optionalBoolean,
  optionalDate,
  optionalString,
  optionalStringArray,
  requireDate,
  requireOneOf,
  requireString,
} from "@/lib/content/frontmatter";
import type { Project, ProjectFrontmatter, ProjectStatus } from "@/lib/content/types";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");
const STATUSES: readonly ProjectStatus[] = ["active", "archived"];

function parseProject(fileName: string): Project {
  const raw = fs.readFileSync(path.join(PROJECTS_DIR, fileName), "utf8");
  const { data, content } = matter(raw);
  const fm = data as Record<string, unknown>;

  const startDate = requireDate(fm, "startDate", fileName);
  const endDate = optionalDate(fm, "endDate", fileName);

  const frontmatter: ProjectFrontmatter = {
    title: requireString(fm, "title", fileName),
    slug: requireString(fm, "slug", fileName),
    summary: requireString(fm, "summary", fileName),
    role: requireString(fm, "role", fileName),
    status: requireOneOf(fm, "status", fileName, STATUSES),
    startDate,
    endDate,
    techStack: optionalStringArray(fm, "techStack", fileName),
    interfaces: optionalStringArray(fm, "interfaces", fileName),
    aiModels: optionalStringArray(fm, "aiModels", fileName),
    liveUrl: optionalString(fm, "liveUrl", fileName),
    githubUrl: optionalString(fm, "githubUrl", fileName),
    linkedinPostUrl: optionalString(fm, "linkedinPostUrl", fileName),
    coverImage: requireString(fm, "coverImage", fileName),
    featured: optionalBoolean(fm, "featured", fileName),
    tags: optionalStringArray(fm, "tags", fileName),
  };

  return {
    frontmatter,
    body: content,
    isOngoing: endDate === "",
    dateRange: formatRange(startDate, endDate),
    startedAt: toTimestamp(startDate),
    endedAt: endDate ? toTimestamp(endDate) : Number.POSITIVE_INFINITY,
  };
}

/** All projects, newest start date first. Cached per render pass. */
export const getAllProjects = cache((): Project[] => {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  const projects = fs
    .readdirSync(PROJECTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map(parseProject);

  const duplicate = projects
    .map((project) => project.frontmatter.slug)
    .find((slug, index, all) => all.indexOf(slug) !== index);
  if (duplicate) {
    throw new Error(`Duplicate project slug "${duplicate}" in /content/projects.`);
  }

  return projects.sort((a, b) => b.startedAt - a.startedAt);
});

export const getFeaturedProjects = cache((): Project[] =>
  getAllProjects().filter((project) => project.frontmatter.featured),
);

export const getProjectSlugs = cache((): string[] =>
  getAllProjects().map((project) => project.frontmatter.slug),
);

export function getProjectBySlug(slug: string): Project | null {
  return (
    getAllProjects().find((project) => project.frontmatter.slug === slug) ?? null
  );
}

/** Every tag and tech value across all projects, for the filter controls. */
export const getProjectFilters = cache((): { tags: string[]; tech: string[] } => {
  const tags = new Set<string>();
  const tech = new Set<string>();

  for (const project of getAllProjects()) {
    project.frontmatter.tags.forEach((tag) => tags.add(tag));
    project.frontmatter.techStack.forEach((item) => tech.add(item));
  }

  return {
    tags: [...tags].sort((a, b) => a.localeCompare(b)),
    tech: [...tech].sort((a, b) => a.localeCompare(b)),
  };
});

/**
 * Up to `limit` other projects to show at the end of a detail page.
 * Prefers projects sharing a tag, then falls back to the most recent.
 */
export function getRelatedProjects(slug: string, limit = 2): Project[] {
  const current = getProjectBySlug(slug);
  if (!current) return [];

  const others = getAllProjects().filter(
    (project) => project.frontmatter.slug !== slug,
  );
  const currentTags = new Set(current.frontmatter.tags);

  return others
    .map((project) => ({
      project,
      shared: project.frontmatter.tags.filter((tag) => currentTags.has(tag)).length,
    }))
    .sort((a, b) => b.shared - a.shared || b.project.startedAt - a.project.startedAt)
    .slice(0, limit)
    .map((entry) => entry.project);
}
