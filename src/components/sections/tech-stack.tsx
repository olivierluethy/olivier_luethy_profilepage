import { Environment } from "@/components/ui/environment";
import { Section } from "@/components/ui/section";
import { TechGrid } from "@/components/ui/tech-grid";
import { getProjectFilters } from "@/lib/content/projects";
import { categoryFor, TECH_CATEGORY_ORDER } from "@/lib/tech-categories";
import { techIcon } from "@/lib/tech-icons";

/**
 * The stack as a clickable map, grouped by category, plus a curated row of the
 * operating systems I work on. Every logo resolves to its brand mark on the
 * server; tapping one filters the project list below.
 */
export function TechStack() {
  const { tech } = getProjectFilters();
  const icons = tech.map(techIcon).filter((icon) => icon.branded);

  const groups = TECH_CATEGORY_ORDER.map((category) => ({
    category,
    icons: icons.filter((icon) => categoryFor(icon.name) === category),
  })).filter((group) => group.icons.length > 0);

  if (groups.length === 0) return null;

  return (
    <Section
      id="stack"
      callsign="Stack"
      title="Tech I build with"
      lede="Every logo here is something I've shipped a real project with. Tap one to see which."
    >
      <div className="flex flex-col gap-8">
        {groups.map((group) => (
          <TechGrid key={group.category} heading={group.category} tech={group.icons} />
        ))}
      </div>
      <Environment />
    </Section>
  );
}
