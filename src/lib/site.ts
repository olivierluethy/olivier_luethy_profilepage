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

/**
 * Reusable profile links. Kept as named constants so the same values can be
 * imported anywhere — the hero, the footer, JSON-LD, or an external portal —
 * and changed in exactly one place.
 */
export const GITHUB_URL = "https://github.com/olivierluethy";
export const LINKEDIN_URL = "https://www.linkedin.com/in/olivier-luethy";
/** The CV/resume file in /public. Reference this from other portals too. */
export const RESUME_URL = "/olivier_luethy_cv.pdf";

export const site = {
  name: "Olivier Lüthy",
  /** Shown under the name in the hero. */
  tagline:
    "Software developer with an AI-first focus — production AI tools, from RAG pipelines to Chrome extensions used by thousands.",
  /** Used as the default meta description and in the footer. */
  description:
    "Software developer with an AI-first mindset and a passion for building things. Overall winner of SwissHacks 2024 with a production RAG pipeline, and developer of AI-integrated Chrome extensions used by thousands. Based in Lucerne, Switzerland.",
  /** No trailing slash. Drives canonical URLs, sitemap and OG images. */
  // [[Set this to the deployed portfolio domain once it is live.]]
  url: "https://example.com",
  locale: "en_US",
  email: "olivier.luethy@gmx.net",
  /**
   * Asset paths resolve to real files so nothing renders broken.
   * Overwrite the files in /public rather than changing these paths:
   *   /public/olivier_luethy_cv.pdf — your CV (see RESUME_URL)
   *   /public/images/profile.jpg    — your photo
   */
  resumeUrl: RESUME_URL,
  profileImage: "/images/profile.jpg",
  /** Falls back to the site name if you would rather not show a location. */
  location: "Lucerne, Switzerland",
  jobTitle: "Software Developer",
} as const;

export const socials: readonly SocialLink[] = [
  { label: "GitHub", href: GITHUB_URL, external: true },
  { label: "LinkedIn", href: LINKEDIN_URL, external: true },
] as const;

/**
 * The three readouts in the hero's bottom rail. Keep them to things a
 * recruiter can verify elsewhere on the page — they are evidence, not slogans.
 */
export const heroStats: readonly { value: string; label: string }[] = [
  { value: "6", label: "Apps shipped" },
  { value: "1st", label: "SwissHacks 2024" },
  { value: "3,000+", label: "Weekly extension users" },
] as const;

/** Top-level routes in the nav. In-page section links are added in Phase 2. */
export const navLinks: readonly NavLink[] = [
  { label: "Work", href: "/#work" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;
