import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { community } from "@/lib/data/community";

/** IT help for local clubs. Listed plainly — the work speaks for itself. */
export function Community() {
  return (
    <Section
      id="community"
      callsign="Vol"
      title="Unpaid work that keeps local clubs running"
      lede="Small Swiss Vereine run on volunteers. A few evenings of engineering goes a long way in a place where nobody else can do it."
    >
      <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {community.map((entry, index) => (
          <li key={entry.id} className="bg-panel">
            <Reveal delay={index * 0.06} className="h-full">
              <article className="flex h-full flex-col p-6">
                <p className="font-mono text-hud uppercase text-signal-ink">
                  {entry.period}
                </p>
                <h3 className="mt-3 text-balance font-display text-lg font-semibold">
                  {entry.organisation}
                </h3>
                <p className="mt-1 font-mono text-label uppercase text-faint">
                  {entry.role}
                </p>
                <p className="mt-4 text-pretty text-sm leading-relaxed text-muted">
                  {entry.description}
                </p>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
