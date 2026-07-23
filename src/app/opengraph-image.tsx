import { ImageResponse } from "next/og";

import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/components/og-card";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.jobTitle}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Site-wide fallback card, used for the homepage and any route without its own. */
export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow={site.jobTitle}
        title={site.name}
        subtitle={site.tagline}
        footer={site.location}
      />
    ),
    size,
  );
}
