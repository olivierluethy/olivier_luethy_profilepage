/**
 * Physical builds: FPV drones, 3D printing and CAD.
 *
 * An entry with a `model` renders an interactive <model-viewer> instead of a
 * photo. Export from Fusion 360 as .glb or .gltf into /public/models.
 */

export interface MakerBuild {
  id: string;
  title: string;
  description: string;
  /** Photo of the build. Always present — the 3D model is additive. */
  image: string;
  /** Optional path under /public to a .glb or .gltf file. */
  model?: string;
  /** Tools and parts worth naming. */
  tools: string[];
}

export const makerBuilds: readonly MakerBuild[] = [
  {
    id: "freestyle",
    title: "Self-built FPV freestyle quads",
    description:
      "FPV drones I build and configure myself, with a focus on freestyle flying. Tuning them is where the real learning happens.",
    image: "/images/maker/freestyle-build.png",
    tools: ["Betaflight", "Soldering", "Carbon fibre", "Fusion 360"],
  },
  {
    id: "fusion-parts",
    title: "FPV parts, designed in Fusion 360",
    description:
      "Custom drone components I design in Autodesk Fusion 360 when the off-the-shelf part keeps breaking, then print and iterate on until they survive the crash.",
    image: "/images/maker/camera-mount.png",
    // [[Replace with a real Fusion 360 export (.glb/.gltf) in /public/models.]]
    model: "/models/placeholder-part.gltf",
    tools: ["Fusion 360", "Cura", "PETG"],
  },
  {
    id: "bird-feeder",
    title: "3D-printed bird-feeder bowl",
    description:
      "An ongoing print: a self-designed bird-feeder bowl in transparent biodegradable PLA, finished with a food-safe epoxy resin coating — designed and manufactured independently.",
    image: "/images/maker/tinywhoop.png",
    tools: ["Fusion 360", "PLA", "Epoxy resin"],
  },
  {
    id: "print-workflow",
    title: "3D-printing workflow",
    description:
      "My printing setup: slicing in Ultimaker Cura and running prints remotely through OctoPrint on a Raspberry Pi.",
    image: "/images/maker/print-farm.png",
    tools: ["Ultimaker Cura", "OctoPrint", "Raspberry Pi", "PLA"],
  },
] as const;
