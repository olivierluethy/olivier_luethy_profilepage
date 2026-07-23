/** Hackathons and competitions, newest first. */

export interface Hackathon {
  id: string;
  event: string;
  /** What was built, as a name rather than a description. */
  project: string;
  date: string;
  location: string;
  /** Placing or outcome, e.g. "1st place, overall". */
  result: string;
  /** Drives the winner badge. */
  won: boolean;
  description: string;
  image: string;
  /** Team size including you. */
  teamSize: number;
  url: string;
}

export const hackathons: readonly Hackathon[] = [
  {
    id: "swiss-ai-hack",
    event: "[[Swiss AI Hackathon]]",
    project: "[[Project name]]",
    date: "[[March 2026]]",
    location: "[[Zurich]]",
    result: "1st place, overall",
    won: true,
    description:
      "[[What you built in 48 hours, and the one thing that made the judges pick it. Be specific about your part if it was a team.]]",
    image: "/images/hackathons/swiss-ai-hack.png",
    teamSize: 4,
    url: "[[https://example.com/hackathon]]",
  },
  {
    id: "mobility-jam",
    event: "[[Mobility Hack]]",
    project: "[[Project name]]",
    date: "[[September 2025]]",
    location: "[[Bern]]",
    result: "2nd place, public transport track",
    won: false,
    description:
      "[[What the problem was, what you shipped, and what you would keep from it.]]",
    image: "/images/hackathons/mobility-jam.png",
    teamSize: 3,
    url: "[[https://example.com/hackathon]]",
  },
  {
    id: "health-hack",
    event: "[[Health Hack]]",
    project: "[[Project name]]",
    date: "[[November 2024]]",
    location: "[[Basel]]",
    result: "Best technical execution",
    won: true,
    description:
      "[[The first hackathon where you owned the architecture rather than following someone else's. Say what that changed.]]",
    image: "/images/hackathons/health-hack.png",
    teamSize: 5,
    url: "[[https://example.com/hackathon]]",
  },
] as const;
