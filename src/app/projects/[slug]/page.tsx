import { notFound } from "next/navigation";

import { MdxContent } from "@/components/mdx/mdx-content";
import { getAllProjects, getProjectBySlug } from "@/lib/content/projects";

/**
 * Project detail page.
 *
 * Phase 1 renders the MDX body so the content pipeline can be verified.
 * The metadata panel, live preview and suggested-projects nav land in Phase 3.
 */

export function generateStaticParams() {
  return getAllProjects().map((project) => ({
    slug: project.frontmatter.slug,
  }));
}

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const { frontmatter, dateRange } = project;

  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <header className="border-b border-line pb-10">
        <p className="font-mono text-hud uppercase text-signal-ink">
          {dateRange} · {frontmatter.status}
        </p>
        <h1 className="mt-5 text-balance font-display text-display-lg font-bold">
          {frontmatter.title}
        </h1>
        <p className="mt-5 text-pretty text-lg leading-relaxed text-muted">
          {frontmatter.summary}
        </p>
      </header>

      <MdxContent source={project.body} />
    </article>
  );
}
