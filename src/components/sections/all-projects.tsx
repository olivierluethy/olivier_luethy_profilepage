import { ProjectExplorer } from "@/components/ui/project-explorer";
import { Section } from "@/components/ui/section";
import {
  getAllProjects,
  getProjectFilters,
  toSummary,
} from "@/lib/content/projects";
import { techIcon } from "@/lib/tech-icons";

/** Every project, filterable by tag or tech and sortable by recency or status. */
export function AllProjects() {
  const projects = getAllProjects().map(toSummary);
  const { tags, tech } = getProjectFilters();
  // Resolve brand-logo paths on the server so simple-icons never reaches the client.
  const techWithIcons = tech.map(techIcon);

  if (projects.length === 0) return null;

  return (
    <Section
      id="projects"
      callsign="All"
      title="Everything else"
      lede="Including the ones that are finished, archived or did not work out. Those tend to be the more interesting write-ups."
      className="bg-panel/40"
    >
      <ProjectExplorer projects={projects} tags={tags} tech={techWithIcons} />
    </Section>
  );
}
