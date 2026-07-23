import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { TIMELINE_KIND_LABEL, timeline } from "@/lib/data/timeline";

/**
 * Experience and education.
 *
 * A single hairline runs the length of the list with a marker per entry —
 * the order genuinely is a sequence, so the vertical rule carries real
 * information rather than decorating the section.
 */
export function Experience() {
  return (
    <Section
      id="path"
      callsign="Path"
      title="How I actually learned this"
      lede="No computer science degree. A Swiss apprenticeship, four years of shipping software inside a real team, and a lot of evenings."
    >
      <ol className="relative border-l border-line pl-6 sm:pl-10">
        {timeline.map((entry, index) => (
          <li key={entry.id} className="relative pb-12 last:pb-0">
            <Reveal delay={index * 0.06}>
              {/* Marker sits on the rule itself. */}
              <span
                aria-hidden="true"
                className="absolute -left-[1.4375rem] top-1.5 size-2 rotate-45 border border-signal bg-ground sm:-left-[2.6875rem]"
              />

              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-hud uppercase text-signal-ink">
                  {entry.period}
                </span>
                <Badge tone="outline">{TIMELINE_KIND_LABEL[entry.kind]}</Badge>
              </div>

              <h3 className="mt-3 text-balance font-display text-xl font-semibold">
                {entry.role}
              </h3>
              <p className="mt-1 font-mono text-label uppercase text-muted">
                {entry.organisation}
              </p>

              <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted">
                {entry.description}
              </p>

              <ul className="mt-4 max-w-2xl space-y-2">
                {entry.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="relative pl-5 text-sm leading-relaxed text-muted before:absolute before:left-0 before:top-[0.55em] before:size-1.5 before:bg-signal"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
