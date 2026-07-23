import { Reticle } from "@/components/reticle";
import { ActionLink } from "@/components/ui/action-link";
import { Reveal } from "@/components/ui/reveal";
import { site, socials } from "@/lib/site";

/**
 * Closing call to action. The page's one loud moment, and the only place the
 * signal colour fills a whole panel — everything above it stays quiet so this
 * reads as the end of an argument rather than another section.
 */
export function ContactCta() {
  const [github, linkedin] = socials;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-nav border-t border-line py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-signal/40 bg-signal-wash px-6 py-14 text-center sm:px-12 sm:py-20">
            {/* Corner brackets — the same lock-on frame as the hero, closing the loop. */}
            <span
              aria-hidden="true"
              className="absolute left-5 top-5 size-6 border-l-2 border-t-2 border-signal"
            />
            <span
              aria-hidden="true"
              className="absolute right-5 top-5 size-6 border-r-2 border-t-2 border-signal"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-5 left-5 size-6 border-b-2 border-l-2 border-signal"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-5 right-5 size-6 border-b-2 border-r-2 border-signal"
            />

            <Reticle className="mx-auto size-6 text-signal" />

            <h2
              id="contact-heading"
              className="mx-auto mt-6 max-w-2xl text-balance font-display text-display font-bold"
            >
              If any of this is useful to you, get in touch
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted">
              I read everything and reply to everything, including the messages
              that turn out not to be a fit.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <ActionLink href="/contact" variant="primary">
                Contact me
              </ActionLink>
              <ActionLink href={`mailto:${site.email}`}>{site.email}</ActionLink>
              <ActionLink href={linkedin.href} external>
                LinkedIn
              </ActionLink>
              <ActionLink href={github.href} external>
                GitHub
              </ActionLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
