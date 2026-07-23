/**
 * Central site configuration.
 *
 * Everything wrapped in [[double brackets]] is a placeholder meant to be
 * replaced with real values. Search the repo for "[[" to find them all.
 */

export type NavLink = {
  /** Label shown in the nav. */
  label: string;
  /** Href — in-page anchors start with "/#", routes start with "/". */
  href: string;
};

export type SocialLink = NavLink & {
  /** Used for the `sameAs` array in the Person JSON-LD (Phase 6). */
  external: boolean;
};

export const site = {
  name: "[[Your name]]",
  /** Shown under the name in the hero. */
  tagline: "[[one-line positioning statement]]",
  /** Used as the default meta description and in the footer. */
  description:
    "[[Short paragraph about what you build and who you build it for. Used as the site-wide meta description.]]",
  /** No trailing slash. Drives canonical URLs, sitemap and OG images. */
  url: "https://example.com",
  locale: "en_US",
  email: "[[you@example.com]]",
  /** Place the file at /public/[[resume.pdf]] and update this path. */
  resumeUrl: "/[[resume.pdf]]",
  profileImage: "[[/images/profile.jpg]]",
  /** Falls back to the site name if you would rather not show a location. */
  location: "[[Switzerland]]",
  jobTitle: "[[Software Engineer]]",
} as const;

export const socials: readonly SocialLink[] = [
  { label: "GitHub", href: "[[https://github.com/yourhandle]]", external: true },
  { label: "LinkedIn", href: "[[https://linkedin.com/in/yourhandle]]", external: true },
] as const;

/** Top-level routes in the nav. In-page section links are added in Phase 2. */
export const navLinks: readonly NavLink[] = [
  { label: "Work", href: "/#work" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;
