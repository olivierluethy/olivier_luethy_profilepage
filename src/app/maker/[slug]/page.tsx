import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { FusionViewer } from "@/components/ui/fusion-viewer";
import { getFusionProject, getFusionProjects } from "@/lib/data/fusion";
import { buildMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return getFusionProjects().map((project) => ({ slug: project.slug }));
}

interface MakerPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: MakerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getFusionProject(slug);
  if (!project) return { title: "Project not found" };

  return buildMetadata({
    title: `${project.title} — Fusion 360`,
    description: project.tagline,
    path: `/maker/${project.slug}`,
    type: "article",
    tags: project.tools,
  });
}

export default async function MakerProjectPage({ params }: MakerPageProps) {
  const { slug } = await params;
  const project = getFusionProject(slug);
  if (!project) notFound();

  return (
    <article className="pb-24">
      <div className="mx-auto max-w-4xl px-5 pt-12 sm:px-8">
        <Link
          href="/#maker"
          className="inline-flex items-center gap-2 font-mono text-hud uppercase text-muted transition-colors hover:text-signal-ink"
        >
          <span aria-hidden="true">←</span> All builds
        </Link>
      </div>

      <header className="mx-auto max-w-4xl px-5 pt-10 sm:px-8">
        <p className="font-mono text-hud uppercase text-signal-ink">Fusion 360</p>
        <h1 className="mt-4 text-balance font-display text-display-lg font-bold">
          {project.title}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
          {project.tagline}
        </p>
        <p className="mt-5 max-w-2xl text-pretty leading-relaxed text-muted">
          {project.story}
        </p>
        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.tools.map((tool) => (
            <Badge key={tool}>{tool}</Badge>
          ))}
        </div>
      </header>

      <section
        aria-label="Interactive 3D model"
        className="mx-auto mt-12 max-w-4xl px-5 sm:px-8"
      >
        <FusionViewer versions={[...project.versions]} title={project.title} />
      </section>

      <section
        aria-labelledby="timeline-heading"
        className="mx-auto mt-16 max-w-4xl px-5 sm:px-8"
      >
        <h2
          id="timeline-heading"
          className="font-display text-display-sm font-bold"
        >
          How it evolved
        </h2>
        <ol className="mt-8 space-y-6 border-l border-line pl-6">
          {project.versions.map((version, index) => (
            <li key={version.file} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full border border-signal bg-ground"
              />
              <p className="flex items-baseline gap-3">
                <span className="font-mono text-hud uppercase text-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display font-semibold">{version.label}</span>
              </p>
              <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted">
                {version.note}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {project.photos.length > 0 ? (
        <section
          aria-labelledby="photos-heading"
          className="mx-auto mt-16 max-w-4xl px-5 sm:px-8"
        >
          <h2
            id="photos-heading"
            className="font-display text-display-sm font-bold"
          >
            From the workbench
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {project.photos.map((photo) => (
              <li
                key={photo}
                className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-panel"
              >
                <Image
                  src={photo}
                  alt={`${project.title} — build photo`}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
