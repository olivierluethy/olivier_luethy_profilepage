import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/ui/status-pill";
import type { Project } from "@/lib/content/types";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line py-4 first:border-t-0 first:pt-0">
      <dt className="font-mono text-hud uppercase text-faint">{label}</dt>
      <dd className="mt-2.5">{children}</dd>
    </div>
  );
}

function BadgeRow({ items }: { items: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <Badge key={item}>{item}</Badge>
      ))}
    </div>
  );
}

export interface ProjectMetaProps {
  project: Project;
}

/**
 * Metadata panel for a project.
 *
 * Rows are omitted rather than shown empty — a project with no AI models
 * should not display an "AI models: none" row.
 */
export function ProjectMeta({ project }: ProjectMetaProps) {
  const { frontmatter, dateRange } = project;

  return (
    <aside
      aria-label="Project details"
      className="rounded-xl border border-line bg-panel p-6 lg:sticky lg:top-24"
    >
      <dl>
        <Row label="Status">
          <div className="flex flex-wrap items-center gap-2.5">
            <StatusPill status={frontmatter.status} />
            <span className="font-mono text-hud uppercase text-faint">
              {dateRange}
            </span>
          </div>
        </Row>

        <Row label="My role">
          <p className="text-sm leading-relaxed text-muted">{frontmatter.role}</p>
        </Row>

        {frontmatter.techStack.length > 0 ? (
          <Row label="Tech stack">
            <BadgeRow items={frontmatter.techStack} />
          </Row>
        ) : null}

        {frontmatter.interfaces.length > 0 ? (
          <Row label="Interfaces & APIs">
            <BadgeRow items={frontmatter.interfaces} />
          </Row>
        ) : null}

        {frontmatter.aiModels.length > 0 ? (
          <Row label="AI models">
            <BadgeRow items={frontmatter.aiModels} />
          </Row>
        ) : null}

        {frontmatter.tags.length > 0 ? (
          <Row label="Tags">
            <BadgeRow items={frontmatter.tags} />
          </Row>
        ) : null}
      </dl>
    </aside>
  );
}
