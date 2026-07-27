/**
 * The homepage sections, in scroll order.
 *
 * Each carries a short callsign used by the jump-nav rail — an OSD channel
 * label rather than a decorative number. The list is the single source of
 * truth for both the rail and the scroll-spy, so adding a section here wires
 * it into the navigation automatically.
 */

export interface HomeSection {
  /** DOM id of the section element; also the jump-link target. */
  id: string;
  /** Short uppercase label shown in the nav rail. */
  callsign: string;
  /** Full label, used for accessible names and the mobile strip. */
  label: string;
}

export const homeSections: readonly HomeSection[] = [
  { id: "top", callsign: "Home", label: "Home" },
  { id: "work", callsign: "Feat", label: "Featured work" },
  { id: "stack", callsign: "Stack", label: "Tech stack" },
  { id: "projects", callsign: "All", label: "All projects" },
  { id: "path", callsign: "Path", label: "Experience" },
  { id: "hackathons", callsign: "Hack", label: "Hackathons" },
  { id: "maker", callsign: "Make", label: "Maker & hardware" },
  { id: "sports", callsign: "Run", label: "Sports" },
  { id: "community", callsign: "Vol", label: "Community" },
  { id: "writing", callsign: "Log", label: "Writing" },
  { id: "contact", callsign: "Link", label: "Contact" },
] as const;
