"use client";

import { useEffect, useMemo, useState } from "react";

import { ProjectCard } from "@/components/ui/project-card";
import type { ProjectSummary } from "@/lib/content/types";
import type { TechIcon } from "@/lib/tech-icons";

type SortKey = "newest" | "active";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "active", label: "Currently active" },
];

export interface ProjectExplorerProps {
  projects: ProjectSummary[];
  tags: string[];
  tech: TechIcon[];
}

/**
 * Filterable, sortable project list.
 *
 * Filtering is single-select on purpose: one click to narrow, one click on the
 * same chip to clear. A multi-select matrix would be more powerful and much
 * slower to use for someone scanning the page for the first time.
 */
export function ProjectExplorer({ projects, tags, tech }: ProjectExplorerProps) {
  const [sort, setSort] = useState<SortKey>("newest");
  const [filter, setFilter] = useState<string | null>(null);

  // The tech grid higher up the page filters this list by dispatching an event,
  // then we scroll the list into view so the result is visible immediately.
  useEffect(() => {
    const onSelect = (event: Event) => {
      const name = (event as CustomEvent<string>).detail;
      if (!name) return;
      setFilter(name);
      document
        .getElementById("projects")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("select-tech", onSelect);
    return () => window.removeEventListener("select-tech", onSelect);
  }, []);

  const visible = useMemo(() => {
    const matches = filter
      ? projects.filter(
          (project) =>
            project.frontmatter.tags.includes(filter) ||
            project.frontmatter.techStack.includes(filter),
        )
      : projects;

    return [...matches].sort((a, b) => {
      if (sort === "active") {
        // Ongoing work first, then most recently started.
        if (a.isOngoing !== b.isOngoing) return a.isOngoing ? -1 : 1;
      }
      return b.startedAt - a.startedAt;
    });
  }, [projects, filter, sort]);

  const toggle = (value: string) =>
    setFilter((current) => (current === value ? null : value));

  const chipClass = (active: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-hud uppercase transition-colors ${
      active
        ? "border-signal bg-signal text-[#0B0F14]"
        : "border-line bg-panel text-muted hover:border-signal/50 hover:text-signal-ink"
    }`;

  const chip = (value: string) => {
    const active = filter === value;
    return (
      <button
        key={value}
        type="button"
        onClick={() => toggle(value)}
        aria-pressed={active}
        className={chipClass(active)}
      >
        {value}
      </button>
    );
  };

  const techChip = (icon: TechIcon) => {
    const active = filter === icon.name;
    return (
      <button
        key={icon.name}
        type="button"
        onClick={() => toggle(icon.name)}
        aria-pressed={active}
        title={`Show projects using ${icon.name}`}
        className={chipClass(active)}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`size-3.5 shrink-0 ${icon.branded ? "" : "opacity-60"}`}
        >
          <path d={icon.path} fill="currentColor" />
        </svg>
        {icon.name}
      </button>
    );
  };

  return (
    <div>
      <div className="flex flex-col gap-6 border-y border-line py-6">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="font-mono text-hud uppercase text-faint"
            id="sort-label"
          >
            Sort
          </span>
          <div
            role="group"
            aria-labelledby="sort-label"
            className="flex gap-1 rounded-full border border-line bg-panel p-1"
          >
            {SORTS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setSort(option.key)}
                aria-pressed={sort === option.key}
                className={`rounded-full px-3 py-1.5 font-mono text-hud uppercase transition-colors ${
                  sort === option.key
                    ? "bg-signal text-[#0B0F14]"
                    : "text-muted hover:text-signal-ink"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <span className="ml-auto font-mono text-hud uppercase text-faint">
            {visible.length} of {projects.length}
          </span>
        </div>

        {tags.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 font-mono text-hud uppercase text-faint">
              Tags
            </span>
            {tags.map(chip)}
          </div>
        ) : null}

        {tech.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 font-mono text-hud uppercase text-faint">
              Tech
            </span>
            {tech.map(techChip)}
          </div>
        ) : null}
      </div>

      <div aria-live="polite" className="mt-8 space-y-4">
        {visible.map((project) => (
          <ProjectCard
            key={project.frontmatter.slug}
            project={project}
            variant="compact"
          />
        ))}

        {visible.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line px-5 py-10 text-center text-muted">
            Nothing tagged &ldquo;{filter}&rdquo; yet.{" "}
            <button
              type="button"
              onClick={() => setFilter(null)}
              className="text-signal-ink underline underline-offset-4"
            >
              Show all projects
            </button>
          </p>
        ) : null}
      </div>
    </div>
  );
}
