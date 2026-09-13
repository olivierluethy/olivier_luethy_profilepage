import Image from "next/image";

import { ActionLink } from "@/components/ui/action-link";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import {
  eclipseFeature,
  gallery,
  photographyProfile,
} from "@/lib/data/photography";

/**
 * Photography. The headline is the eclipse frame SRF ran as the lead preview
 * image for their feature; a gallery grid renders below only when non-empty.
 */
export function Photography() {
  return (
    <Section
      id="photography"
      callsign="Lens"
      title="A patient eye, away from the keyboard"
      lede={photographyProfile.summary}
    >
      <div className="grid gap-8 [&>*]:min-w-0 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
        <Reveal>
          <figure className="relative overflow-hidden rounded-xl border border-line bg-ground">
            <div className="relative aspect-[16/9]">
              <Image
                src={eclipseFeature.image}
                alt={eclipseFeature.alt}
                fill
                sizes="(min-width: 1024px) 720px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute left-4 top-4">
              <Badge tone="signal">Featured by {eclipseFeature.outlet}</Badge>
            </div>
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent p-4 pt-12 font-mono text-hud uppercase text-white/90">
              {eclipseFeature.caption}
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex h-full flex-col justify-center">
            <p className="flex items-center gap-2 font-mono text-hud uppercase text-signal-ink">
              Published · {eclipseFeature.outlet}
            </p>
            <h3 className="mt-4 text-balance font-display text-display-sm font-bold">
              The frame that fronts SRF&rsquo;s eclipse feature
            </h3>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted">
              On 12 August 2026 I set up for the partial solar eclipse at sunset
              and waited for the one instant the crescent sun sat low and burning
              red over the ridge &mdash; a composition that existed for only a few
              seconds and, shot this way, nowhere else. SRF chose that photograph
              as the lead preview image for their nationwide feature{" "}
              <em>&ldquo;{eclipseFeature.articleTitle}&rdquo;</em> &mdash; the frame
              that represents the whole article whenever it is shared.
            </p>
            <p className="mt-3 text-pretty text-base leading-relaxed text-muted">
              It is the kind of shot I build the rest of my photography around:
              technical when it has to be, but really about being in the right
              place, ready, at the only moment that counts.
            </p>
            <div className="mt-6">
              <ActionLink href={eclipseFeature.articleUrl} external>
                See it on SRF
              </ActionLink>
            </div>
          </div>
        </Reveal>
      </div>

      {gallery.length > 0 ? (
        <ul className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {gallery.map((photo, index) => (
            <li key={photo.id}>
              <Reveal delay={index * 0.06} className="h-full">
                <figure className="relative overflow-hidden rounded-xl border border-line bg-ground">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8 font-mono text-hud uppercase text-white/90">
                    {photo.caption}
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      ) : null}
    </Section>
  );
}
