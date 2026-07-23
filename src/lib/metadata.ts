import type { Metadata } from "next";

import { site } from "@/lib/site";

/** Absolute URL for a site-relative path. Used for canonicals and OG tags. */
export function absoluteUrl(path: string): string {
  const base = site.url.replace(/\/$/, "");
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}

export interface PageMetadataInput {
  title: string;
  description: string;
  /** Site-relative path, e.g. `/projects/flickclean`. */
  path: string;
  /** Overrides the route's generated OG image. */
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  tags?: readonly string[];
  /**
   * Bypasses the root layout's "%s — Name" title template. Use on pages whose
   * title already contains the site name, so it is not repeated twice.
   */
  absoluteTitle?: boolean;
}

/**
 * Builds a page's metadata with a canonical URL plus matching Open Graph and
 * Twitter cards, so every page is unique and self-describing to a crawler.
 *
 * `image` is normally omitted: Next picks up the route's opengraph-image file
 * automatically and that is preferred, because it is generated per page.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  tags,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type,
      ...(image ? { images: [{ url: absoluteUrl(image) }] } : {}),
      ...(publishedTime ? { publishedTime } : {}),
      ...(tags ? { tags: [...tags] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [absoluteUrl(image)] } : {}),
    },
  };
}
