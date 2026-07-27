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
    id: "swisshacks-2026",
    event: "SwissHacks 2026",
    // [[Add the project you built at SwissHacks 2026.]]
    project: "[[Project — to add]]",
    date: "2026",
    location: "Zurich",
    result: "Participant",
    won: false,
    // [[Add a sentence on what you built at SwissHacks 2026.]]
    description: "[[What you built at SwissHacks 2026 — to add.]]",
    image: "/images/hackathons/swiss-ai-hack.png",
    teamSize: 4, // [[confirm team size]]
    url: "",
  },
  {
    id: "swisshacks-2025",
    event: "SwissHacks 2025",
    project: "Corporate knowledge base",
    date: "2025",
    location: "Zurich",
    result: "Participant",
    won: false,
    description:
      "A corporate knowledge base with human-in-the-loop validation and a token-saving algorithm for cost-optimised LLM queries.",
    image: "/images/hackathons/mobility-jam.png",
    teamSize: 4, // [[confirm team size]]
    url: "",
  },
  {
    id: "nasa-space-apps-2024",
    event: "NASA Space Apps Challenge 2024",
    project: "Kepler's Horizon",
    date: "October 2024",
    location: "Remote",
    result: "Global Nominee",
    won: false,
    description:
      "\"Kepler's Horizon\" — an interactive educational platform built with Next.js and FastAPI, using AI-assisted content generation. Selected as a Global Nominee.",
    image: "/images/hackathons/health-hack.png",
    teamSize: 4, // [[confirm team size]]
    url: "",
  },
  {
    id: "swisshacks-2024",
    event: "SwissHacks 2024",
    project: "Document chat (RAG pipeline)",
    date: "2024",
    location: "Zurich",
    result: "1st place — overall winner",
    won: true,
    description:
      "A document-chat system built on a production RAG pipeline — FastAPI backend, OpenAI embeddings + GPT-4, and a Pinecone vector database, with a chunking-and-retrieval strategy tuned for accuracy. Overall winner against 20+ teams, built with my team.",
    image: "/images/hackathons/swiss-ai-hack.png",
    teamSize: 4, // [[confirm team size]]
    url: "",
  },
  {
    id: "young-talents-2024",
    event: "Young Talents Hackathon 2024",
    // [[Add the project you built at the Young Talents Hackathon.]]
    project: "[[Project — to add]]",
    date: "2024",
    // [[Add the location.]]
    location: "",
    result: "2nd place",
    won: false,
    // [[Add a sentence on what you built.]]
    description: "[[What you built at the Young Talents Hackathon 2024 — to add.]]",
    image: "/images/hackathons/mobility-jam.png",
    teamSize: 4, // [[confirm team size]]
    url: "",
  },
] as const;
