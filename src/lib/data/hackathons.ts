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
  /** Extra photos (e.g. award ceremony). Renders a thumbnail strip when set. */
  photos?: string[];
  /** Team size including you. */
  teamSize: number;
  url: string;
  /** Slug of the full project write-up on this site, if there is one. */
  projectSlug?: string;
}

export const hackathons: readonly Hackathon[] = [
  {
    id: "swisshacks-2026",
    event: "SwissHacks 2026",
    project: "Sentinel — KYC-drift monitor",
    date: "June 2026",
    location: "Zurich",
    result: "MVP — Most Valuable Player",
    won: true,
    description:
      "Sentinel — a dynamic KYC-drift monitor for AMINA Bank's RegTech challenge, watching a bank's customer book for the slow structural changes that invalidate an onboarding risk profile. I was named MVP of the entire event, out of hundreds of participants.",
    image: "/images/hackathons/swiss-ai-hack.png",
    teamSize: 4, // [[confirm team size]]
    url: "https://sentinel.viktorsharha.com/",
    projectSlug: "sentinel",
  },
  {
    id: "swisshacks-2025",
    event: "SwissHacks 2025",
    project: "Enterprise Knowledge Synthesizer",
    date: "April 2025",
    location: "Zurich",
    result: "Finalist",
    won: false,
    description:
      "A decision engine that turns a company's scattered documents into correlated, actionable insights — with a human-in-the-loop that steers the AI in real time, and a backend built to slash the token cost of every query.",
    image: "/images/hackathons/mobility-jam.png",
    teamSize: 4, // [[confirm team size]]
    url: "",
    projectSlug: "knowledge-synthesizer",
  },
  {
    id: "nasa-space-apps-2024",
    event: "NASA Space Apps Challenge 2024",
    project: "Kepler's Horizon",
    date: "October 2024",
    location: "Lucerne / Remote",
    result: "CH Winner — Global Nominee",
    won: true,
    description:
      "\"Kepler's Horizon\" — an inclusive space-education platform that uses AI to break dense astronomy down into learning bites for people with cognitive or visual impairments. Swiss winner, nominated to represent Switzerland globally.",
    image: "/images/hackathons/health-hack.png",
    teamSize: 4,
    url: "",
    projectSlug: "keplers-horizon",
  },
  {
    id: "swisshacks-2024",
    event: "SwissHacks 2024",
    project: "AI Document Intelligence Platform",
    date: "April 2024",
    location: "Zurich",
    result: "1st place — Double Winner (Unique Challenge & Overall)",
    won: true,
    description:
      "A zero-latency document-intelligence platform on a RAG architecture — Pinecone vector search, OpenAI generation, and a three-column KPI/document/chat dashboard. Won both the Unique Challenge and the Overall Hackathon.",
    image: "/images/swisshack-2024/SN_08698_1.jpg",
    photos: [
      "/images/swisshack-2024/SN_08698_1.jpg",
      "/images/swisshack-2024/SN_08616_1.jpg",
    ],
    teamSize: 4, // [[confirm team size]]
    url: "",
    projectSlug: "document-intelligence",
  },
  {
    id: "young-talents-2024",
    event: "Young Talents Hackathon 2024",
    project: "AI ID-Scanner & Automated Onboarding",
    date: "October 2024",
    location: "Lucerne",
    result: "2nd place",
    won: false,
    description:
      "Photograph an ID card and auto-fill a registration form, built on a zero-cost open-source vision pipeline — OpenCV pre-processing into Tesseract OCR, with parsing logic mapping the text to the right fields.",
    image: "/images/hackathons/mobility-jam.png",
    teamSize: 4, // [[confirm team size]]
    url: "",
    projectSlug: "id-scanner",
  },
] as const;
