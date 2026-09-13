/**
 * The homepage sections, in scroll order.
 *
 * Each carries a plain-language `short` label (shown in the jump-nav, paired
 * with an icon in `section-nav`) and a fuller `label` used for accessible
 * names. The list is the single source of truth for both the rail and the
 * scroll-spy, so adding a section here wires it into the navigation
 * automatically. Section ids double as the icon keys in `section-icons`.
 */

export interface HomeSection {
  /** DOM id of the section element; also the jump-link target and icon key. */
  id: string;
  /** Plain-language label shown in the nav (with an icon beside it). */
  short: string;
  /** Full label, used for accessible names. */
  label: string;
}

export const homeSections: readonly HomeSection[] = [
  { id: "top", short: "Home", label: "Home" },
  { id: "work", short: "Work", label: "Featured work" },
  { id: "stack", short: "Stack", label: "Tech stack" },
  { id: "projects", short: "Projects", label: "All projects" },
  { id: "path", short: "Experience", label: "Experience" },
  { id: "hackathons", short: "Hackathons", label: "Hackathons" },
  { id: "maker", short: "Maker", label: "Maker & hardware" },
  { id: "photography", short: "Photos", label: "Photography" },
  { id: "sports", short: "Sports", label: "Sports" },
  { id: "community", short: "Community", label: "Community" },
  { id: "writing", short: "Writing", label: "Writing" },
  { id: "contact", short: "Contact", label: "Contact" },
] as const;
