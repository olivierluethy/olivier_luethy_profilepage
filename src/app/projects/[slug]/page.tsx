import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { MdxContent } from "@/components/mdx/mdx-content";
import { ActionLink } from "@/components/ui/action-link";
import { LivePreview } from "@/components/ui/live-preview";
import { ProjectCard } from "@/components/ui/project-card";
import { ProjectMeta } from "@/components/ui/project-meta";
import { StatusPill } from "@/components/ui/status-pill";
import {
  getAllProjects,
  getProjectBySlug,
  getRelatedProjects,
} from "@/lib/content/projects";
import { canEmbed } from "@/lib/can-embed";
import { buildMetadata } from "@/lib/metadata";
import { projectSchema } from "@/lib/schema";

export function generateStaticParams() {
  return getAllProjects().map((project) => ({
    slug: project.frontmatter.slug,
  }));
}

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return { title: "Project not found" };

  const { frontmatter } = project;

  return buildMetadata({
    title: frontmatter.title,
    description: frontmatter.summary,
    path: `/projects/${frontmatter.slug}`,
    type: "article",
    tags: frontmatter.tags,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const { frontmatter, dateRange } = project;
  const related = getRelatedProjects(slug, 2);
  const embeddable = await canEmbed(frontmatter.liveUrl);

  return (
    <article className="pb-24">
      <JsonLd data={projectSchema(project)} />

      <div className="mx-auto max-w-6xl px-5 pt-12 sm:px-8">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 font-mono text-hud uppercase text-muted transition-colors hover:text-signal-ink"
        >
          <span aria-hidden="true">←</span> All projects
        </Link>
      </div>

      <header className="mx-auto max-w-6xl px-5 pt-10 sm:px-8">
        <div className="flex flex-wrap items-center gap-2.5">
          <StatusPill status={frontmatter.status} />
          <span className="font-mono text-hud uppercase text-faint">
            {dateRange}
          </span>
        </div>

        <h1 className="mt-5 max-w-4xl text-balance font-display text-display-lg font-bold">
          {frontmatter.title}
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-xl leading-relaxed text-muted">
          {frontmatter.summary}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {frontmatter.githubUrl ? (
            <ActionLink href={frontmatter.githubUrl} external>
              View on GitHub
            </ActionLink>
          ) : null}
          {frontmatter.linkedinPostUrl ? (
            <ActionLink href={frontmatter.linkedinPostUrl} external>
              See the LinkedIn post
            </ActionLink>
          ) : null}
        </div>
      </header>

      {frontmatter.liveUrl ? (
        <section
          aria-label="Live preview"
          className="mx-auto mt-14 max-w-6xl px-5 sm:px-8"
        >
          <LivePreview
            url={frontmatter.liveUrl}
            coverImage={frontmatter.coverImage}
            title={frontmatter.title}
            embeddable={embeddable}
          />
        </section>
      ) : null}

      <div className="mx-auto mt-16 grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-16">
        {/* Prose column is width-limited for readability, not by the grid alone. */}
        <div className="min-w-0 max-w-2xl">
          <MdxContent source={project.body} />
        </div>

        <ProjectMeta project={project} />
      </div>

      {related.length > 0 ? (
        <section
          aria-labelledby="related-heading"
          className="mx-auto mt-24 max-w-6xl border-t border-line px-5 pt-14 sm:px-8"
        >
          <h2
            id="related-heading"
            className="font-display text-display-sm font-bold"
          >
            Next, have a look at
          </h2>
          <div className="mt-8 space-y-4">
            {related.map((item) => (
              <ProjectCard
                key={item.frontmatter.slug}
                project={item}
                variant="compact"
              />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
