import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

import matter from "gray-matter";

import { formatLongDate, readingMinutes, toTimestamp } from "@/lib/content/dates";
import {
  optionalString,
  optionalStringArray,
  requireDate,
  requireString,
} from "@/lib/content/frontmatter";
import type { BlogFrontmatter, BlogPost } from "@/lib/content/types";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function parsePost(fileName: string): BlogPost {
  const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), "utf8");
  const { data, content } = matter(raw);
  const fm = data as Record<string, unknown>;

  const date = requireDate(fm, "date", fileName);

  const frontmatter: BlogFrontmatter = {
    title: requireString(fm, "title", fileName),
    slug: requireString(fm, "slug", fileName),
    date,
    summary: requireString(fm, "summary", fileName),
    coverImage: optionalString(fm, "coverImage", fileName),
    tags: optionalStringArray(fm, "tags", fileName),
    relatedProjects: optionalStringArray(fm, "relatedProjects", fileName),
  };

  return {
    frontmatter,
    body: content,
    publishedAt: toTimestamp(date),
    formattedDate: formatLongDate(date),
    readingMinutes: readingMinutes(content),
  };
}

/** All posts, newest first. Cached per render pass. */
export const getAllPosts = cache((): BlogPost[] => {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const posts = fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map(parsePost);

  const duplicate = posts
    .map((post) => post.frontmatter.slug)
    .find((slug, index, all) => all.indexOf(slug) !== index);
  if (duplicate) {
    throw new Error(`Duplicate blog slug "${duplicate}" in /content/blog.`);
  }

  return posts.sort((a, b) => b.publishedAt - a.publishedAt);
});

export const getPostSlugs = cache((): string[] =>
  getAllPosts().map((post) => post.frontmatter.slug),
);

export function getPostBySlug(slug: string): BlogPost | null {
  return getAllPosts().find((post) => post.frontmatter.slug === slug) ?? null;
}

export function getLatestPosts(limit = 3): BlogPost[] {
  return getAllPosts().slice(0, limit);
}
