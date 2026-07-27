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
    id: "swisscitymarathon-2025",
    event: "SwissCityMarathon",
    distance: "42.195 km",
    date: "2025",
    // [[Add your finish time.]]
    time: "[[--:--:--]]",
    // [[Add a note, e.g. a personal best or the conditions.]]
    note: "[[Note — to add]]",
  },
  // The CV names no other specific races, so the two rows below are left as
  // clearly-marked placeholders — fill them only with real results.
  {
    id: "race-2",
    event: "[[Half marathon]]",
    distance: "21.1 km",
    date: "[[Year]]",
    time: "[[--:--:--]]",
    note: "[[Note]]",
  },
  {
    id: "race-3",
    event: "[[Half marathon]]",
    distance: "21.1 km",
    date: "[[Year]]",
    time: "[[--:--:--]]",
    note: "[[Note]]",
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
  // [[Paste your Strava profile URL here.]]
  profileUrl: "[[https://strava.com/athletes/yourid]]",
  summary:
    "I run long distances — several half-marathons and marathons, and currently training toward the SwissCityMarathon. It is the counterweight to sitting at a keyboard.",
} as const;
