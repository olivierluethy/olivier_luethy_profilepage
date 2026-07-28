/**
 * Fusion 360 / 3D-printing projects, each shown as a "process page" with an
 * interactive STL viewer and a switcher across the design iterations.
 *
 * `versions` is ordered oldest → final; the last entry is the finished design
 * and is what the viewer loads first. `file` paths point at raw STL exports
 * under /public and may contain spaces — the viewer encodes them before fetch.
 *
 * Narrative here is a first draft to be refined; it is written from the source
 * filenames, the German `Vorgehen.txt` log, and Olivier's description.
 */

export interface FusionVersion {
  /** Path under /public to a .stl file. May contain spaces/parentheses. */
  file: string;
  /** Short label for the version switcher, e.g. "v1", "DJI bag", "Final". */
  label: string;
  /** One line: what changed in this version and why it mattered. */
  note: string;
}

export interface FusionProject {
  /** Route segment under /maker. */
  slug: string;
  title: string;
  /** One-line hook shown under the title. */
  tagline: string;
  /** Intro story — a short paragraph or two. */
  story: string;
  /** Tools and materials worth naming. */
  tools: string[];
  /** Ordered oldest → final. Last entry is the finished design. */
  versions: FusionVersion[];
  /** Process photos under /public; may be empty. */
  photos: string[];
  featured?: boolean;
}

const DIR = "/images/fushion360-projects";

export const fusionProjects: readonly FusionProject[] = [
  {
    slug: "table-hook",
    title: "Table hook",
    tagline: "A desk-edge hook to hang bags and gear — iterated until it held.",
    story:
      "My biggest print project. I wanted a hook that clamps onto the edge of my desk so I can hang bags and everyday items you can't find a good model for. It went through several shapes before the proportions felt right, then branched into a wider DJI-bag carrying version and, later, a variant sized for a standing desk.",
    tools: ["Fusion 360", "Creality", "PLA"],
    versions: [
      {
        file: `${DIR}/tischhacken/Tischhacken v1.stl`,
        label: "v1",
        note: "First shape — proved the clamp idea but the arm was too thin to trust with weight.",
      },
      {
        file: `${DIR}/tischhacken/Tischhacken.stl`,
        label: "v2",
        note: "Thicker body and a deeper throat so it sits flush on the desk edge.",
      },
      {
        file: `${DIR}/tischhacken/Tischhacken Standart Version.stl`,
        label: "Standard",
        note: "The settled everyday version — the one I actually use.",
      },
      {
        file: `${DIR}/tischhacken/Tischhacken DJI Bag Version.stl`,
        label: "DJI bag",
        note: "Widened the arm so a DJI bag clears the edge and hangs without tipping.",
      },
      {
        file: `${DIR}/stehtisch/StehTischHacken v1.stl`,
        label: "Standing-desk v1",
        note: "First attempt at a taller variant for the thicker top of a standing desk.",
      },
      {
        file: `${DIR}/stehtisch/StehTischHacken v3.stl`,
        label: "Standing-desk final",
        note: "Re-tuned depth and wall thickness so it grips the standing-desk edge cleanly.",
      },
    ],
    photos: [],
    featured: true,
  },
  {
    slug: "lamp-ring",
    title: "Lamp ring",
    tagline: "A circular mount I made on request for my mum's lamp.",
    story:
      "My mum asked for a ring to attach to a lamp. The tricky part was the diameter: my first prototype came out too small, so I printed small test rings to dial in the fit before committing to the full part.",
    tools: ["Fusion 360", "Creality", "PLA"],
    versions: [
      {
        file: `${DIR}/Momauftrag/Prototyp Klein Zu Klein.stl`,
        label: "Prototype (too small)",
        note: "First ring — came out too small, which told me exactly how much to grow the diameter.",
      },
      {
        file: `${DIR}/Momauftrag/RingProject.stl`,
        label: "Ring v2",
        note: "Corrected diameter and cleaned up the ring profile.",
      },
      {
        file: `${DIR}/Momauftrag/V3 KreisLampe.stl`,
        label: "v3",
        note: "Refined the fit against the lamp so it seats without forcing.",
      },
      {
        file: `${DIR}/Momauftrag/UftagFertig.stl`,
        label: "Final",
        note: "The finished ring — request delivered.",
      },
    ],
    photos: [
      `${DIR}/Momauftrag/20241125_204004.jpg`,
      `${DIR}/Momauftrag/20241201_224435.jpg`,
      `${DIR}/Momauftrag/20241201_224506.jpg`,
    ],
  },
  {
    slug: "drone-mount",
    title: "Drone upper mount",
    tagline: "A protective top mount for a self-built FPV drone — the deepest iteration story.",
    story:
      "One of my FPV drones had no top protection, so I designed my own. The hard part was the mounting holes: their real-world size was difficult to measure, so I had to guess and test. Instead of reprinting the whole surface each time, I printed a tiny prototype with just one hole to home in on the right diameter fast, then carried that measurement back to the full part. The side walls and the antenna cutout came last.",
    tools: ["Fusion 360", "Creality", "PETG"],
    versions: [
      {
        file: `${DIR}/oberhalterung/Unbenannt - Aller erstes Hereintasten in das Projekt mit Seitenwoelbung.stl`,
        label: "First feel-out",
        note: "Very first attempt — just getting into the project and the side curvature.",
      },
      {
        file: `${DIR}/oberhalterung/Loch (Erster Prototyp für Loech, erstes Mass Proble fuer korrekte Duchmessung).stl`,
        label: "Hole prototype",
        note: "First hole prototype — where the measuring problem for the correct diameter showed up.",
      },
      {
        file: `${DIR}/oberhalterung/Loch2 (Vergroessertes Loch).stl`,
        label: "Enlarged hole",
        note: "Grew the hole to test a larger diameter guess.",
      },
      {
        file: `${DIR}/oberhalterung/Loch3 (Flaeche mit ersten Loechern).stl`,
        label: "Surface, first holes",
        note: "Moved the tested hole onto the real surface with the first hole pair.",
      },
      {
        file: `${DIR}/oberhalterung/Loch5 (Flaechen mit vergroesserten Loechern).stl`,
        label: "Corrected sizes",
        note: "Applied the diameter I'd found on the tiny prototype to the full surface.",
      },
      {
        file: `${DIR}/oberhalterung/Loch6 (Flaeche mit unpositionierung der Loechern).stl`,
        label: "Repositioned holes",
        note: "Nudged the hole positions; the left-to-right spacing was right from the start thanks to a caliper reading.",
      },
      {
        file: `${DIR}/oberhalterung/Loch7 (Flaeche mit Loechern und ersten mit ersten grossen Loch in Mitte).stl`,
        label: "Centre hole",
        note: "Added the first large hole in the middle of the surface.",
      },
      {
        file: `${DIR}/oberhalterung/Loch8 (Flaeche mit allem und den ersten winzigen Seitenwaende Testweise).stl`,
        label: "First side walls",
        note: "First tentative side walls, kept tiny to test the idea.",
      },
      {
        file: `${DIR}/oberhalterung/Loch9 (Flaeche mit allem und den originalen Seiten sowie Innenwaende aber ohne Antenneneinschnitt).stl`,
        label: "Walls complete",
        note: "Full side and inner walls in place — still no antenna cutout.",
      },
      {
        file: `${DIR}/oberhalterung/Loch91 - Schnitt mit Antennenanpassung.stl`,
        label: "Antenna cutout",
        note: "Cut the bay for the antenna — done deliberately as the very last step.",
      },
      {
        file: `${DIR}/oberhalterung/Loch92 - Schnitt mit Antennenanpassung vergroessern.stl`,
        label: "Final",
        note: "Widened the antenna cutout to its final size.",
      },
    ],
    photos: [
      `${DIR}/oberhalterung/20241221_162923.jpg`,
      `${DIR}/oberhalterung/20241221_162928.jpg`,
    ],
  },
  {
    slug: "switchback-mount",
    title: "Switchback nano mount",
    tagline: "A camera holder that locks between two rails so it can't fly off mid-flight.",
    story:
      "This FPV drone had no proper camera holder. I built a mount that clamps between two rails, with holes on the sides to bolt the camera down so it stays put during flight instead of shifting or dropping. It took seven versions to get the clamp and the bolt holes solid.",
    tools: ["Fusion 360", "Creality", "PETG"],
    versions: [
      {
        file: `${DIR}/switchback-pro/Switchback_Nano_Mount V1.stl`,
        label: "v1",
        note: "First clamp between the two rails — proof of concept.",
      },
      {
        file: `${DIR}/switchback-pro/Switchback_Nano_Mount V3.stl`,
        label: "v3",
        note: "Reworked the rail grip so it seats without wobble.",
      },
      {
        file: `${DIR}/switchback-pro/Switchback_Nano_Mount V4.stl`,
        label: "v4",
        note: "Added and aligned the side holes for bolting the camera.",
      },
      {
        file: `${DIR}/switchback-pro/Switchback_Nano_Mount V5.stl`,
        label: "v5",
        note: "Tightened tolerances around the bolt holes.",
      },
      {
        file: `${DIR}/switchback-pro/Switchback_Nano_Mount V6.stl`,
        label: "v6",
        note: "Reinforced the body so flight vibration doesn't crack it.",
      },
      {
        file: `${DIR}/switchback-pro/Switchback_Nano_Mount V7.stl`,
        label: "Final",
        note: "The version that finally held the camera rock-solid in the air.",
      },
    ],
    photos: [
      `${DIR}/switchback-pro/20241223_103355.jpg`,
      `${DIR}/switchback-pro/20241223_103403.jpg`,
      `${DIR}/switchback-pro/20241223_214738.jpg`,
      `${DIR}/switchback-pro/20241223_214748.jpg`,
      `${DIR}/switchback-pro/20241223_214822.jpg`,
      `${DIR}/switchback-pro/20241223_214825.jpg`,
    ],
  },
] as const;

export function getFusionProjects(): readonly FusionProject[] {
  return fusionProjects;
}

export function getFusionProject(slug: string): FusionProject | undefined {
  return fusionProjects.find((project) => project.slug === slug);
}
