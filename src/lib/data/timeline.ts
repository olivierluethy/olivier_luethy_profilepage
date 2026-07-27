/**
 * Experience and education, newest first.
 *
 * Framed around what was built and learned by doing. Each entry leads with
 * outcomes rather than responsibilities — the timeline should read as evidence,
 * not as a job description.
 */

export type TimelineKind = "work" | "education" | "self-directed";

export interface TimelineEntry {
  id: string;
  /** Human range, e.g. "2025 — Present". */
  period: string;
  role: string;
  organisation: string;
  kind: TimelineKind;
  /** One or two sentences of context. */
  description: string;
  /** Concrete, verifiable things that came out of it. */
  highlights: string[];
}

export const TIMELINE_KIND_LABEL: Record<TimelineKind, string> = {
  work: "Work",
  education: "Education",
  "self-directed": "Self-directed",
};

export const timeline: readonly TimelineEntry[] = [
  {
    id: "current-role",
    period: "Aug. 2024 — Present",
    role: "ICT Application Specialist / Customer Care Analyst",
    organisation: "Delta Logic AG, Sursee",
    kind: "work",
    description:
      "The interface between customers and development at a Swiss software company: first- and second-level support in German and French, alongside IT security and infrastructure work.",
    highlights: [
      "Contributed to the #1 Cybersecurity Score across the entire Volaris Group in 2024 — recognised with an internal company award.",
      "Ran vulnerability assessments (Rapid7), phishing simulations (KnowBe4), SSL/TLS certificate management and VM administration.",
      "Designed and built the bilingual (DE/FR) release-notes platform on deltalogic.ch.",
    ],
  },
  {
    id: "hackathons-oss",
    period: "2023 — Present",
    role: "Hackathons & open source",
    organisation: "SwissHacks · NASA Space Apps · Hackergarten (CSS)",
    kind: "self-directed",
    description:
      "Where the AI-first work happens in the open: weekend hackathons and monthly open-source sessions, building production-grade prototypes with people I have never met.",
    highlights: [
      "SwissHacks 2024 overall winner — a document-chat RAG pipeline (FastAPI, OpenAI + Pinecone) that beat 20+ teams.",
      "NASA Space Apps 2024 Global Nominee with \"Kepler's Horizon\", an interactive educational platform.",
      "Monthly open-source contributor at the CSS Hackergarten incubator since April 2024.",
    ],
  },
  {
    id: "english",
    period: "2022 — 2023",
    role: "English — Cambridge First (B2)",
    organisation: "FREI'S Schools, Lucerne · International House Manchester",
    kind: "education",
    description:
      "Courses taken alongside the apprenticeship, so that documentation, code review and technical writing in English are not a bottleneck.",
    highlights: [
      "Cambridge First (B2); French is a second mother tongue (DELF B2).",
      "Write and review in German, French and English daily in production.",
    ],
  },
  {
    id: "apprenticeship",
    period: "Aug. 2019 — July 2023",
    role: "Applikationsentwickler EFZ",
    organisation: "Kauz Informatik Medien AG, Ballwil",
    kind: "education",
    description:
      "Four-year Swiss software-development apprenticeship: building production web and mobile applications inside a real engineering team with C#, ASP.NET Core and MSSQL. The work was never theoretical — everything I wrote had users.",
    highlights: [
      "Built production web apps (club management, contact-tracing, HR) in C#/ASP.NET Core following the MVC pattern.",
      "Shipped mobile apps (Xamarin barcode scanner, Ionic project management) and a C# WPF security toolkit.",
      "\"Creative, conceptually well thought-out and consistently of outstanding quality\" — final employment reference, 2023.",
    ],
  },
] as const;
