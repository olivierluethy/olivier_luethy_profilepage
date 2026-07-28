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
  // Filters open collapsed so 31 projects are the first thing on screen, not a
  // wall of pills. Expanded on demand.
  const [filtersOpen, setFiltersOpen] = useState(false);

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

  const hasFilters = tags.length > 0 || tech.length > 0;

  return (
    <div>
      {/* Light control strip: one Filter disclosure, active filter, sort, count. */}
      <div className="flex flex-col gap-3 border-y border-line py-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {hasFilters ? (
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
              aria-controls="project-filters"
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-hud uppercase transition-colors ${
                filtersOpen || filter
                  ? "border-signal/50 text-signal-ink"
                  : "border-line bg-panel text-muted hover:border-signal/50 hover:text-signal-ink"
              }`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5">
                <path
                  d="M3 5h18M6 12h12M10 19h4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              Filter
              <span
                aria-hidden="true"
                className={`transition-transform duration-200 ${filtersOpen ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>
          ) : null}

          {/* Active filter stays visible even while the panel is collapsed. */}
          {filter ? (
            <button
              type="button"
              onClick={() => setFilter(null)}
              className="inline-flex items-center gap-1.5 rounded-full border border-signal bg-signal px-3 py-1.5 font-mono text-hud uppercase text-[#0B0F14]"
            >
              {filter}
              <span aria-hidden="true" className="text-sm leading-none">
                ×
              </span>
            </button>
          ) : null}

          <div className="ml-auto flex items-center gap-2.5">
            <div
              role="group"
              aria-label="Sort projects"
              className="flex gap-1 rounded-full border border-line p-0.5"
            >
              {SORTS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setSort(option.key)}
                  aria-pressed={sort === option.key}
                  className={`rounded-full px-2.5 py-1 font-mono text-hud uppercase transition-colors ${
                    sort === option.key
                      ? "bg-signal-wash text-signal-ink"
                      : "text-faint hover:text-signal-ink"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <span className="font-mono text-hud uppercase text-faint">
              {visible.length}/{projects.length}
            </span>
          </div>
        </div>

        {/* Expanded filter panel — collapsed by default. */}
        {filtersOpen && hasFilters ? (
          <div id="project-filters" className="flex flex-col gap-3 pt-1">
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
        ) : null}
      </div>

      <div
        aria-live="polite"
        className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((project) => (
          <ProjectCard
            key={project.frontmatter.slug}
            project={project}
            variant="grid"
          />
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-line px-5 py-10 text-center text-muted">
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
  );
}
