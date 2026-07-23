import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { ModelViewer } from "@/components/ui/model-viewer";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { makerBuilds } from "@/lib/data/maker";

/**
 * Physical builds. Entries with a CAD export render an interactive
 * <model-viewer> in place of the photo; everything else is a gallery image.
 */
export function Maker() {
  return (
    <Section
      id="maker"
      callsign="Make"
      title="Things that fly, and the parts that hold them together"
      lede="FPV quads I built and tune myself, and the printed parts I design when the off-the-shelf version keeps breaking."
    >
      <ul className="grid gap-6 sm:grid-cols-2">
        {makerBuilds.map((build, index) => (
          <li key={build.id}>
            <Reveal delay={index * 0.08} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-panel">
                {build.model ? (
                  <ModelViewer
                    src={build.model}
                    alt={`Interactive 3D model of ${build.title}`}
                    poster={build.image}
                    className="rounded-none border-0 border-b border-line"
                  />
                ) : (
                  <div className="relative aspect-[4/3] border-b border-line">
                    <Image
                      src={build.image}
                      alt={build.title}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-balance font-display text-lg font-semibold">
                    {build.title}
                  </h3>
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
