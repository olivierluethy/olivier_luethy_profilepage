/** Volunteering and IT help for local clubs (Vereine). */

export interface CommunityEntry {
  id: string;
  organisation: string;
  role: string;
  period: string;
  /** What was actually done, in plain terms. */
  description: string;
}

export const community: readonly CommunityEntry[] = [
  {
    id: "sports-club",
    organisation: "[[Local sports club]]",
    role: "IT and website",
    period: "[[2023]] — Present",
    description:
      "[[Run the club's website and member mailing. Rebuilt it so the committee can update it without me — that was the point.]]",
  },
  {
    id: "treasury",
    organisation: "[[Local club]]",
    role: "Treasury tooling",
    period: "[[2024]] — [[2025]]",
    description:
      "Built and ran Kassenwart, the tool that replaced the committee's shared spreadsheet, then handed the data over cleanly when the club merged.",
  },
  {
    id: "repair-cafe",
    organisation: "[[Repair café]]",
    role: "Volunteer",
    period: "[[2022]] — Present",
    description:
      "[[A Saturday a month fixing laptops and phones for people who would otherwise replace them. Most of it is patience rather than skill.]]",
  },
] as const;
