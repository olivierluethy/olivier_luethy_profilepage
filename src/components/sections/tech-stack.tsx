import { Section } from "@/components/ui/section";
import { TechGrid } from "@/components/ui/tech-grid";
import { getProjectFilters } from "@/lib/content/projects";
import { techIcon } from "@/lib/tech-icons";

/**
 * The stack as a clickable map. Every logo is a technology that appears in a
 * real project on this page, resolved to its brand mark on the server; tapping
 * one filters the project list below to it.
 */
export function TechStack() {
  const { tech } = getProjectFilters();
  if (tech.length === 0) return null;

  // The grid is a logo wall, so it shows only tech with a real brand mark; the
  // full list (including tools with no logo) stays clickable in the filter below.
  const icons = tech.map(techIcon).filter((icon) => icon.branded);
  if (icons.length === 0) return null;

  return (
    <Section
      id="stack"
      callsign="Stack"
      title="Tech I build with"
      lede="Every logo here is something I've shipped a real project with. Tap one to see which."
    >
      <TechGrid tech={icons} />
    </Section>
  );
}
