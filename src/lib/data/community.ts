/** Volunteering and IT help for local clubs (Vereine). */

export interface CommunityEntry {
  id: string;
  organisation: string;
  role: string;
  period: string;
  /** What was actually done, in plain terms. */
  description: string;
  /** Optional external link; the organisation name links out when present. */
  url?: string;
}

export const community: readonly CommunityEntry[] = [
  {
    id: "kulturverein-meggen",
    organisation: "Kulturverein Meggen",
    role: "IT, communication & visual media",
    period: "2022 — Present",
    description:
      "Design and deliver the annual General Assembly presentations, handle event photography and image editing for the club website, and built an Outlook-based automation for mass member mailing without external tools.",
    url: "https://www.kulturvereinmeggen.ch/",
  },
  {
    id: "treasury",
    // [[Add the club's name — the sports club Kassenwart was built for.]]
    organisation: "[[Local sports club]]",
    role: "Treasury tooling",
    period: "2024 — 2025",
    description:
      "Built and ran Kassenwart, the tool that replaced the committee's shared spreadsheet, then handed the data over cleanly when the club merged.",
  },
  {
    id: "corp-ch",
    organisation: "Corp.ch",
    role: "Founder & maintainer",
    // [[Add the period, e.g. 2023 — Present.]]
    period: "[[Period — to add]]",
    description:
      "A project I built and run on a voluntary basis, for charitable purposes.",
  },
] as const;
