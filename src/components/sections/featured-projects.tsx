import { ActionLink } from "@/components/ui/action-link";
import { ProjectCard } from "@/components/ui/project-card";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { getFeaturedProjects } from "@/lib/content/projects";

/**
 * The centrepiece. Featured projects get the largest cards on the page,
 * because shipped work is the whole argument this site is making.
 */
export function FeaturedProjects() {
  const projects = getFeaturedProjects();

  if (projects.length === 0) return null;

  return (
    <Section
      id="work"
      callsign="Feat"
      title="Things I built that people actually use"
      lede="Each one shipped, with the write-up on what broke, what it cost and what I would do differently."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal key={project.frontmatter.slug} delay={index * 0.08}>
            <ProjectCard project={project} priority={index === 0} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-10">
          <ActionLink href="/#projects">See every project</ActionLink>
        </div>
      </Reveal>
    </Section>
  );
}
