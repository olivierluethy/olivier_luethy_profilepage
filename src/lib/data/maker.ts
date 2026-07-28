/**
 * Physical builds shown in the homepage "Make" section.
 *
 * Fusion 360 CAD projects come from `@/lib/data/fusion` (each links to its own
 * process page). This file holds only the non-CAD builds: the FPV freestyle
 * drones. Photo slots are reserved even before the photo exists so the layout
 * is stable — drop the images in at these paths to fill them.
 */

export interface DroneBuild {
  id: string;
  title: string;
  description: string;
  /** Photo under /public. May not exist yet; layout reserves the slot. */
  image: string;
  tools: string[];
}

export const droneBuilds: readonly DroneBuild[] = [
  {
    id: "freestyle-1",
    title: "FPV freestyle quad",
    description:
      "One of the FPV freestyle drones I build and tune myself — soldered, configured in Betaflight, and flown until something teaches me the next fix.",
    image: "/images/maker/fpv-freestyle-1.jpg",
    tools: ["Betaflight", "Soldering", "FPV"],
  },
  {
    id: "freestyle-2",
    title: "FPV freestyle quad",
    description:
      "Another freestyle build. When an off-the-shelf part keeps breaking, I design a replacement in Fusion 360 and print it on my Creality.",
    image: "/images/maker/fpv-freestyle-2.jpg",
    tools: ["Fusion 360", "Creality", "FPV"],
  },
] as const;
