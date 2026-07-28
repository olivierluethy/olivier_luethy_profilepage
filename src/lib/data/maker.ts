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
  /** Hero photo under /public. */
  image: string;
  /** Supporting photos shown as a thumbnail strip. */
  gallery: string[];
  tools: string[];
}

export const droneBuilds: readonly DroneBuild[] = [
  {
    id: "freestyle-build",
    title: "5-inch freestyle quad",
    description:
      "One of my FPV freestyle quads, built by hand and shown here finished — a RunCam camera in my own purple 3D-printed mount, a Mamba F405 stack and TBS Crossfire on a carbon frame, with a glimpse of the bench build.",
    image: "/images/maker/drones/drone-build-full-1.jpg",
    gallery: [
      "/images/maker/drones/drone-build-full-2.jpg",
      "/images/maker/drones/drone-build-1.jpg",
      "/images/maker/drones/drone-build-full-3.jpg",
    ],
    tools: ["Betaflight", "Soldering", "Fusion 360"],
  },
  {
    id: "freestyle-finished",
    title: "5-inch freestyle quad",
    description:
      "A different freestyle quad, finished and ready to fly — Velox 2207 motors, tri-blade props and green printed soft-mounts on a carbon frame. When an off-the-shelf part keeps breaking, I design a replacement in Fusion 360 and print it on my Creality.",
    image: "/images/maker/drones/drone-flight-1.jpg",
    gallery: [
      "/images/maker/drones/drone-flight-2.jpg",
      "/images/maker/drones/drone-flight-3.jpg",
      "/images/maker/drones/drone-flight-4.jpg",
    ],
    tools: ["Creality", "Carbon fibre", "FPV"],
  },
] as const;
