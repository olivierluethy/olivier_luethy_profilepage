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
    period: "[[2025]] — Present",
    role: "[[Software Engineer]]",
    organisation: "[[Company name]]",
    kind: "work",
    description:
      "[[One or two sentences on what this team builds and what you own within it. Lead with the system you are responsible for, not your job title.]]",
    highlights: [
      "[[Shipped a feature that measurably moved a number you can name]]",
      "[[Owned a service end to end, including its on-call and its failures]]",
      "[[Something you introduced that outlived the ticket that prompted it]]",
    ],
  },
  {
    id: "apprenticeship",
    period: "[[2021]] — [[2025]]",
    role: "Applikationsentwickler EFZ",
    organisation: "[[Training company]]",
    kind: "education",
    description:
      "Four-year Swiss vocational apprenticeship: four days a week building production software inside a real engineering team, one day a week in vocational school. The work was never theoretical — everything I wrote had users.",
    highlights: [
      "[[Rotated across backend, frontend and operations teams]]",
      "[[Delivered your IPA final project — name it and say what it did]]",
      "[[Graduated with a grade worth mentioning, if it is]]",
    ],
  },
  {
    id: "english",
    period: "[[2023]] — [[2024]]",
    role: "English, [[C1 Advanced]]",
    organisation: "[[Language school]]",
    kind: "education",
    description:
      "Evening courses taken alongside the apprenticeship, so that documentation, code review and technical writing in English are not a bottleneck.",
    highlights: [
      "[[Cambridge C1 Advanced, passed [[year]]]]",
      "Write and review in English daily",
    ],
  },
  {
    id: "self-taught",
    period: "[[2019]] — [[2021]]",
    role: "Self-taught, then apprenticed",
    organisation: "On my own time",
    kind: "self-directed",
    description:
      "Started with [[what actually got you started — a game mod, a script to automate something annoying, a friend's website]]. No course, no curriculum, just problems that would not leave me alone.",
    highlights: [
      "[[The first thing you built that someone else actually used]]",
      "[[How you got from there into the apprenticeship]]",
    ],
  },
] as const;
