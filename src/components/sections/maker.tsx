import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { StlViewer } from "@/components/ui/stl-viewer";
import { droneBuilds } from "@/lib/data/maker";
import { getFusionProjects } from "@/lib/data/fusion";

/**
 * Physical builds. Fusion 360 projects render an auto-rotating STL preview and
 * link to their process page; the FPV drones are photo cards.
 */
export function Maker() {
  const fusion = getFusionProjects();

  return (
    <Section
      id="maker"
      callsign="Make"
      title="Things that fly, and the parts that hold them together"
      lede="FPV freestyle quads I build and tune myself, and the parts I design in Fusion 360 and print on my Creality when the off-the-shelf version keeps breaking. Each print below went through several iterations — open one to orbit every version."
    >
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {fusion.map((project, index) => {
          const final = project.versions[project.versions.length - 1];
          return (
            <li key={project.slug}>
              <Reveal delay={index * 0.06} className="h-full">
                <Link
                  href={`/maker/${project.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-panel transition-colors hover:border-signal/50"
                >
                  <StlViewer
                    src={final.file}
                    alt={`3D model of ${project.title}`}
                    interactive={false}
                    className="rounded-none border-0 border-b border-line"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-balance font-display text-lg font-semibold">
                      {project.title}
                    </h3>
                    <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-muted">
                      {project.tagline}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tools.map((tool) => (
                        <Badge key={tool}>{tool}</Badge>
                      ))}
                    </div>
                    <span className="mt-5 inline-flex items-center gap-2 font-mono text-hud uppercase text-signal-ink transition-colors group-hover:text-signal">
                      See the process
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          );
        })}
      </ul>

      <h3 className="mt-14 font-display text-display-sm font-bold">
        The drones themselves
      </h3>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2">
        {droneBuilds.map((build, index) => (
          <li key={build.id}>
            <Reveal delay={index * 0.08} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-panel">
                <div className="relative aspect-[4/3] border-b border-line bg-ground">
                  <Image
                    src={build.image}
                    alt={build.title}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h4 className="text-balance font-display text-lg font-semibold">
                    {build.title}
                  </h4>
                  <p className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-muted">
                    {build.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {build.tools.map((tool) => (
                      <Badge key={tool}>{tool}</Badge>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
