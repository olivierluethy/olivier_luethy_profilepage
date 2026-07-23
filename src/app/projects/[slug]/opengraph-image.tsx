import { ImageResponse } from "next/og";

import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/components/og-card";
import { getAllProjects, getProjectBySlug } from "@/lib/content/projects";
import { site } from "@/lib/site";

export const alt = "Project cover";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Pre-render one OG image per project at build time. */
export function generateStaticParams() {
  return getAllProjects().map((project) => ({
    slug: project.frontmatter.slug,
  }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return new ImageResponse(
      <OgCard eyebrow="Project" title="Not found" footer={site.name} />,
      size,
    );
  }

  const { frontmatter, dateRange } = project;

  return new ImageResponse(
    (
      <OgCard
        eyebrow={`${frontmatter.status === "active" ? "Active" : "Archived"} · ${dateRange}`}
        title={frontmatter.title}
        subtitle={frontmatter.summary}
        chips={frontmatter.techStack}
        footer={site.name}
      />
    ),
    size,
  );
}
