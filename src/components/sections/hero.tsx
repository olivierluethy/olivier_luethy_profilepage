import Image from "next/image";

import { HudBackdrop } from "@/components/hud-backdrop";
import { ActionLink } from "@/components/ui/action-link";
import { heroStats, site, socials } from "@/lib/site";

/**
 * Hero — the page's thesis.
 *
 * Framed as an FPV on-screen display: corner brackets pin the portrait, the
 * top and bottom rails carry status, and the name sits in the middle of the
 * frame where the subject would be. Everything in the rails is real
 * information, not decoration.
 *
 * Nothing here has an entrance animation. This is the LCP content and the
 * first thing a recruiter sees, so it paints complete from the server HTML
 * rather than waiting on JavaScript. The ambient sweep in HudBackdrop supplies
 * the movement; scroll reveals start below the fold.
 */
export function Hero() {
  const [github, linkedin] = socials;

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      <HudBackdrop />

      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24 lg:py-32">
        {/* Top rail */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-line pb-4 font-mono text-hud uppercase text-faint">
          <span className="flex items-center gap-2 text-signal-ink">
            <span className="size-1.5 animate-pulse rounded-full bg-signal" />
            Available
          </span>
          <span>{site.location}</span>
          <span className="hidden sm:inline">{site.jobTitle}</span>
        </div>

        <div className="grid gap-12 pt-12 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-16">
          <div className="min-w-0">
            <h1
              id="hero-heading"
              className="text-balance font-display text-display-xl font-bold"
            >
              {site.name}
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-xl leading-relaxed text-muted">
              {site.tagline}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <ActionLink href={site.resumeUrl} variant="primary" download>
                Resume
              </ActionLink>
              <ActionLink href="/contact">Contact</ActionLink>
              <ActionLink href={linkedin.href} external>
                LinkedIn
              </ActionLink>
              <ActionLink href={github.href} external>
                GitHub
              </ActionLink>
            </div>
          </div>

          {/* Portrait, framed like a locked-on target. */}
          <div className="lg:pt-2">
            <div className="relative w-44 sm:w-56 lg:w-64">
              <div className="relative aspect-square overflow-hidden rounded-lg border border-line bg-panel">
                <Image
                  src={site.profileImage}
                  alt={`Portrait of ${site.name}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 256px, (min-width: 640px) 224px, 176px"
                  className="object-cover"
                />
              </div>
              <span
                aria-hidden="true"
                className="absolute -left-2 -top-2 size-5 border-l-2 border-t-2 border-signal"
              />
              <span
                aria-hidden="true"
                className="absolute -bottom-2 -right-2 size-5 border-b-2 border-r-2 border-signal"
              />
            </div>
          </div>
        </div>

        {/* Bottom rail — telemetry, not a stat block. */}
        <dl className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
          {heroStats.map((stat) => (
            <div key={stat.label} className="bg-panel px-5 py-4">
              <dt className="font-mono text-hud uppercase text-faint">
                {stat.label}
              </dt>
              <dd className="mt-2 font-display text-display-sm font-bold text-signal-ink">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
