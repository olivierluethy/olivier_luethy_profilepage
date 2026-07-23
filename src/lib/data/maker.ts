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
    title: "[[5\" freestyle quad]]",
    description:
      "[[What you built and why this particular setup. Mention what you learned tuning it — PID work, filtering, or the crash that taught you something.]]",
    image: "/images/maker/freestyle-build.png",
    tools: ["Betaflight", "Soldering", "Carbon fibre"],
  },
  {
    id: "camera-mount",
    title: "[[Printed camera mount]]",
    description:
      "[[Designed in Fusion 360 after breaking the third off-the-shelf mount. Say what the design constraint was — impact absorption, weight, print orientation.]]",
    image: "/images/maker/camera-mount.png",
    model: "/models/placeholder-part.gltf",
    tools: ["Fusion 360", "Cura", "PETG"],
  },
  {
    id: "tinywhoop",
    title: "[[Tinywhoop build]]",
    description:
      "[[The indoor build. What made it different from the freestyle quad, and what you had to give up to hit the weight.]]",
    image: "/images/maker/tinywhoop.png",
    tools: ["Betaflight", "Micro soldering"],
  },
  {
    id: "print-farm",
    title: "[[Printer and workflow]]",
    description:
      "[[Your printer, your slicer profiles, and the thing you print most often. Recruiters read this as evidence you iterate on physical constraints too.]]",
    image: "/images/maker/print-farm.png",
    tools: ["Cura", "PLA", "PETG"],
  },
] as const;
