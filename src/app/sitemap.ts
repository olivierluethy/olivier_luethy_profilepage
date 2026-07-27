import type { MetadataRoute } from "next";

import { getAllPosts } from "@/lib/content/blog";
import { getAllProjects } from "@/lib/content/projects";
import { absoluteUrl } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/resume"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  const projects: MetadataRoute.Sitemap = getAllProjects().map((project) => ({
    url: absoluteUrl(`/projects/${project.frontmatter.slug}`),
    // Ongoing projects have no end date, so fall back to when they started.
    lastModified: new Date(
      project.frontmatter.endDate || project.frontmatter.startDate,
    ),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: absoluteUrl(`/blog/${post.frontmatter.slug}`),
    lastModified: new Date(post.publishedAt),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...projects, ...posts];
}
