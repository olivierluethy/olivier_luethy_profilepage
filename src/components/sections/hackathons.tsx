import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { hackathons } from "@/lib/data/hackathons";

function TrophyGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3">
      <path
        d="M4 2h8v3a4 4 0 0 1-8 0V2Zm-2 1h2v2a2 2 0 0 1-2-2V3Zm10 0h2v0a2 2 0 0 1-2 2V3ZM7 9.8h2V12h2v2H5v-2h2V9.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Hackathon results, with a winner badge on the ones that placed first. */
export function Hackathons() {
  return (
    <Section
      id="hackathons"
      callsign="Hack"
      title="48 hours, a team, and something that works by Sunday"
      lede="Hackathons are the closest thing to a stress test for how I work with people I have never met."
      className="bg-panel/40"
    >
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hackathons.map((event, index) => (
          <li key={event.id}>
            <Reveal delay={index * 0.08} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-panel transition-colors duration-300 hover:border-signal/50">
                <div className="relative aspect-[14/9] overflow-hidden border-b border-line">
                  <Image
                    src={event.image}
                    alt={`${event.event} — ${event.project}`}
                    fill
                    sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  {event.won ? (
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-signal bg-signal px-2.5 py-1 font-mono text-hud uppercase text-[#0B0F14]">
                      <TrophyGlyph />
                      Winner
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-hud uppercase text-faint">
                    <span>{event.date}</span>
                    <span>{event.location}</span>
                    <span>Team of {event.teamSize}</span>
                  </div>

                  <h3 className="mt-3 text-balance font-display text-lg font-semibold">
                    {event.event}
                  </h3>
                  <p className="mt-1.5">
                    <Badge tone={event.won ? "signal" : "default"}>
                      {event.result}
                    </Badge>
                  </p>

                  <p className="mt-4 text-pretty text-sm leading-relaxed text-muted">
                    {event.description}
                  </p>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
