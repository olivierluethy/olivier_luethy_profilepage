import Image from "next/image";

import { ActionLink } from "@/components/ui/action-link";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { races, sportsProfile } from "@/lib/data/sports";

/**
 * Endurance results. The stats panel is a slot: paste a Strava or DataSport
 * embed into `sportsProfile.embedHtml` and it replaces the placeholder image.
 */
export function Sports() {
  return (
    <Section
      id="sports"
      callsign="Run"
      title="Long distances, slowly earned"
      lede={sportsProfile.summary}
      className="bg-panel/40"
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <Reveal>
          <div className="overflow-hidden rounded-xl border border-line">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Race results</caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="border-b border-line bg-panel px-4 py-3 font-mono text-hud uppercase text-muted"
                  >
                    Event
                  </th>
                  <th
                    scope="col"
                    className="border-b border-line bg-panel px-4 py-3 font-mono text-hud uppercase text-muted"
                  >
                    Distance
                  </th>
                  <th
                    scope="col"
                    className="border-b border-line bg-panel px-4 py-3 text-right font-mono text-hud uppercase text-muted"
                  >
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {races.map((race) => (
                  <tr key={race.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-4 align-top">
                      <span className="block font-medium">{race.event}</span>
                      <span className="mt-1 block font-mono text-hud uppercase text-faint">
                        {race.date} · {race.note}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top font-mono text-sm text-muted">
                      {race.distance}
                    </td>
                    <td className="px-4 py-4 text-right align-top font-mono text-sm text-signal-ink">
                      {race.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex h-full flex-col">
            <div className="relative flex-1 overflow-hidden rounded-xl border border-line bg-panel">
              {sportsProfile.embedHtml ? (
                /* Strava / DataSport embed, pasted into sportsProfile.embedHtml. */
                <div
                  className="size-full"
                  dangerouslySetInnerHTML={{ __html: sportsProfile.embedHtml }}
                />
              ) : (
                <div className="relative aspect-[14/9]">
                  <Image
                    src={sportsProfile.placeholderImage}
                    alt="Placeholder for a Strava or DataSport statistics embed"
                    fill
                    sizes="(min-width: 1024px) 520px, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div className="mt-4">
              <ActionLink href={sportsProfile.profileUrl} external>
                Strava profile
              </ActionLink>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
