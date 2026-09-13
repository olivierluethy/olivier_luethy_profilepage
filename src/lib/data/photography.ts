/**
 * Photography shown in the homepage "Lens" section.
 *
 * The headline item is the eclipse frame SRF used as the lead preview image
 * for their feature on the 2026 partial solar eclipse. Replace the file at
 * `image` with the full-resolution original when you have it — the version in
 * the repo is the compressed copy pulled from the article preview.
 *
 * `gallery` is empty by default so nothing renders broken. To grow the
 * section, drop images into `/public/images/photography` and add entries.
 */

export interface Photograph {
  id: string;
  /** Image path under /public. */
  src: string;
  /** Descriptive alt text. */
  alt: string;
  /** Short caption shown on the frame. */
  caption: string;
}

/**
 * The SRF-featured shot.
 *
 * Verifiable claim: this photograph is the preview/lead image that fronts the
 * SRF article — the frame shown whenever the article link is shared. The copy
 * in the section is written to match exactly that fact.
 */
export const eclipseFeature = {
  image: "/images/photography/eclipse-2026-srf.jpg",
  alt: "Partial solar eclipse at sunset — a crescent sun glowing deep red-orange low over a dark ridgeline, a small silhouette crossing the sun's face.",
  caption: "Partial solar eclipse at sunset · 12 August 2026",
  outlet: "SRF",
  articleTitle: "Die schönsten Bilder der Sonnenfinsternis",
  articleUrl:
    "https://www.srf.ch/news/schweiz/partielle-sonnenfinsternis-die-besten-bilder-der-sonnenfinsternis",
} as const;

export const photographyProfile = {
  summary:
    "Photography is not a side note for me — it is where I practise the same patience good engineering needs: waiting, framing, and pressing the shutter on the one instant most people miss. I chase the frames that only exist for a few seconds — the right light, the exact moment, the composition that will not come again.",
} as const;

// Add more published or favourite frames here — the section renders this grid
// only when it is non-empty, so leaving it empty keeps the layout clean.
export const gallery: readonly Photograph[] = [] as const;
