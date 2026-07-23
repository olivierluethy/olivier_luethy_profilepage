/**
 * Endurance results.
 *
 * `embedHtml` is the slot for a Strava or DataSport embed. Paste the provider's
 * iframe snippet there and it renders in place of the placeholder image.
 */

export interface RaceResult {
  id: string;
  event: string;
  distance: string;
  date: string;
  /** Finish time, e.g. "1:44:12". */
  time: string;
  /** Anything worth noting — a personal best, conditions, a first attempt. */
  note: string;
}

export const races: readonly RaceResult[] = [
  {
    id: "race-1",
    event: "[[Zurich Half Marathon]]",
    distance: "21.1 km",
    date: "[[April 2026]]",
    time: "[[1:44:12]]",
    note: "[[Personal best]]",
  },
  {
    id: "race-2",
    event: "[[Grand Prix von Bern]]",
    distance: "16.1 km",
    date: "[[May 2025]]",
    time: "[[1:18:40]]",
    note: "[[First time on this course]]",
  },
  {
    id: "race-3",
    event: "[[Winter half marathon]]",
    distance: "21.1 km",
    date: "[[November 2024]]",
    time: "[[1:51:05]]",
    note: "[[First half marathon]]",
  },
] as const;

export const sportsProfile = {
  /**
   * Paste a Strava or DataSport embed snippet here to replace the placeholder.
   * Leave as an empty string to keep showing the image instead.
   */
  embedHtml: "",
  /** Shown when `embedHtml` is empty. Swap for a real stats screenshot. */
  placeholderImage: "/images/sports/strava-stats.png",
  profileUrl: "[[https://strava.com/athletes/yourid]]",
  summary:
    "[[A sentence on why you run — what it gives you that sitting at a keyboard does not.]]",
} as const;
