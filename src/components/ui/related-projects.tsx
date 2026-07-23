import { ProjectCard } from "@/components/ui/project-card";
import { getProjectBySlug } from "@/lib/content/projects";

export interface RelatedProjectsProps {
  /** Project slugs from a post's `relatedProjects` frontmatter. */
  slugs: readonly string[];
  heading?: string;
}

/**
 * Renders the projects a post refers to as linked cards.
 *
 * Slugs that do not match a project are skipped rather than throwing, so a
 * renamed project never breaks an existing post.
 */
export function RelatedProjects({
  slugs,
  heading = "Projects in this post",
}: RelatedProjectsProps) {
  const projects = slugs
    .map((slug) => getProjectBySlug(slug))
    .filter((project) => project !== null);

  if (projects.length === 0) return null;

  return (
    <section
      aria-labelledby="related-projects-heading"
      className="mt-16 border-t border-line pt-10"
    >
      <h2
        id="related-projects-heading"
        className="font-mono text-hud uppercase text-faint"
      >
        {heading}
      </h2>
      <div className="mt-6 space-y-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.frontmatter.slug}
            project={project}
            variant="compact"
          />
        ))}
      </div>
    </section>
  );
}
