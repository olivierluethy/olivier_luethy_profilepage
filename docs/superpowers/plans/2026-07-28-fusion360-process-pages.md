# Fusion 360 Process Pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add interactive Fusion 360 / 3D-printing "process pages" to the portfolio site — each project shows its design iterations in a live 3D viewer with a version switcher — plus surface real SwissHacks 2024 ceremony photos.

**Architecture:** A typed data module (`src/lib/data/fusion.ts`) describes four projects, each with an ordered list of STL versions. A client `StlViewer` (three.js, lazy-loaded) renders any STL on demand; a `FusionViewer` wraps it with a version switcher. A dynamic route `/maker/[slug]` renders the full process page, mirroring the existing `/projects/[slug]` pattern. The homepage "Make" section links into these pages. The SwissHacks work is an isolated tweak to the existing Hackathons data + card.

**Tech Stack:** Next.js 16.2.11 (App Router), React 19, TypeScript, Tailwind v4, three.js (new dependency).

## Global Constraints

- **Next.js is non-standard here.** Per `AGENTS.md`/`CLAUDE.md`, this version has breaking changes. Read the relevant guide under `node_modules/next/dist/docs/` before writing routing/metadata/image code. Dynamic route params are a `Promise` and must be `await`ed (confirmed in `src/app/projects/[slug]/page.tsx`).
- **No test runner exists.** The project's quality gate is `npx tsc --noEmit`, `npm run lint`, and `npm run build`. Do NOT add Jest/Vitest. "Verify" steps in this plan mean running those three commands plus a manual `npm run dev` visual check where noted. All three must pass clean before each commit.
- **All user-facing copy is English**, even though source filenames and `Vorgehen.txt` are German.
- **Narrative is a first draft.** Story/version notes are drafts for Olivier to refine later; write them plausibly from the evidence, don't block on perfect wording.
- **Assets stay in place** under `public/images/fushion360-projects/` (folder-name misspelling is intentional/left as-is). STL paths contain spaces, parentheses and umlauts — always `encodeURI()` before fetching.
- **Design tokens** already exist (used across the codebase): `border-line`, `bg-panel`, `bg-ground`, `text-muted`, `text-faint`, `text-signal-ink`, `signal`, `font-mono`, `text-hud`, `font-display`. Reuse them; do not invent new colors.
- **Lazy-load pattern:** heavy client bundles load only when scrolled near the viewport via `IntersectionObserver` with `rootMargin: "200px"` (see `src/components/ui/model-viewer.tsx`). `StlViewer` must follow it.
- **Commit cadence:** one commit per task. End every commit message with the two-line trailer:
  ```
  
  Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
  ```

---

### Task 1: Fusion project data module

**Files:**
- Create: `src/lib/data/fusion.ts`

**Interfaces:**
- Produces:
  - `interface FusionVersion { file: string; label: string; note: string }`
  - `interface FusionProject { slug: string; title: string; tagline: string; story: string; tools: string[]; versions: FusionVersion[]; photos: string[]; featured?: boolean }`
  - `const fusionProjects: readonly FusionProject[]`
  - `function getFusionProjects(): readonly FusionProject[]`
  - `function getFusionProject(slug: string): FusionProject | undefined`

- [ ] **Step 1: Create the data module with types, four projects, and getters**

Create `src/lib/data/fusion.ts` with exactly this content:

```ts
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
```

- [ ] **Step 2: Verify the STL/photo paths in the data actually exist on disk**

Run this guard (it decodes nothing — the data stores raw paths that map 1:1 to files under `public/`):

```bash
node -e '
const { fusionProjects } = require("esbuild-register/dist/node") ? null : null;
' 2>/dev/null; \
grep -oE '/images/fushion360-projects/[^`"]+\.(stl|jpg)' src/lib/data/fusion.ts | sort -u | while read p; do
  [ -f "public$p" ] || echo "MISSING: public$p";
done; echo "path check done"
```

Expected: prints only `path check done` with **no `MISSING:` lines**. If any line is missing, fix the path in `fusion.ts` to match the real filename exactly (watch for umlauts like `für` and spacing like `V6`).

- [ ] **Step 3: Typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/data/fusion.ts
git commit -m "feat: add Fusion 360 project data module

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: StlViewer component (three.js)

**Files:**
- Create: `src/components/ui/stl-viewer.tsx`
- Modify: `package.json` (adds `three` + `@types/three`)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `function StlViewer(props: { src: string; alt: string; interactive?: boolean; className?: string }): JSX.Element`
  - `interactive` defaults to `true` (drag-to-orbit). When `false`, the model only auto-rotates and does not capture pointer events — used for homepage card previews wrapped in a link.

- [ ] **Step 1: Install three.js**

Run:
```bash
npm install three@^0.170.0 && npm install -D @types/three@^0.170.0
```
Expected: both install cleanly and appear in `package.json`. (If `^0.170.0` is unavailable, install the current latest `three` + matching `@types/three`; the API used below — `WebGLRenderer`, `Scene`, `PerspectiveCamera`, `OrbitControls`, `STLLoader` — is stable across recent versions.)

- [ ] **Step 2: Create the component**

Create `src/components/ui/stl-viewer.tsx` with exactly this content:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";

export interface StlViewerProps {
  /** Path under /public to a .stl file. Encoded before fetch. */
  src: string;
  /** Screen-reader description of the model. */
  alt: string;
  /** Drag-to-orbit when true (default); auto-rotate-only preview when false. */
  interactive?: boolean;
  className?: string;
}

type Status = "loading" | "ready" | "failed";

/**
 * Interactive viewer for raw Fusion 360 STL exports.
 *
 * three.js is a large bundle, so it is imported only once the element scrolls
 * near the viewport (mirrors model-viewer.tsx). Changing `src` reloads the
 * geometry and disposes the previous mesh. All GPU resources are released on
 * unmount so a page full of viewers doesn't leak WebGL contexts.
 */
export function StlViewer({
  src,
  alt,
  interactive = true,
  className = "",
}: StlViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");

  // Latest src, read inside the async setup closure without re-running it.
  const srcRef = useRef(src);
  srcRef.current = src;

  // Imperative handle onto the live three.js scene, set once ready.
  const apiRef = useRef<{ load: (path: string) => void; dispose: () => void } | null>(
    null,
  );

  // Set up renderer/scene once the element nears the viewport.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    let cancelled = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();

        Promise.all([
          import("three"),
          import("three/examples/jsm/controls/OrbitControls.js"),
          import("three/examples/jsm/loaders/STLLoader.js"),
        ])
          .then(([three, { OrbitControls }, { STLLoader }]) => {
            if (cancelled || !containerRef.current) return;
            const T = three as typeof THREE;

            const width = node.clientWidth || 1;
            const height = node.clientHeight || 1;

            const scene = new T.Scene();
            const camera = new T.PerspectiveCamera(40, width / height, 0.1, 5000);
            const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(width, height);
            if (!interactive) renderer.domElement.style.pointerEvents = "none";
            node.appendChild(renderer.domElement);

            scene.add(new T.HemisphereLight(0xffffff, 0x2a3442, 1.1));
            const key = new T.DirectionalLight(0xffffff, 1.5);
            key.position.set(1, 1, 1);
            scene.add(key);

            const prefersReducedMotion = window.matchMedia(
              "(prefers-reduced-motion: reduce)",
            ).matches;

            let controls: InstanceType<typeof OrbitControls> | null = null;
            if (interactive) {
              controls = new OrbitControls(camera, renderer.domElement);
              controls.enableDamping = true;
              controls.enablePan = false;
              controls.autoRotate = !prefersReducedMotion;
              controls.autoRotateSpeed = 1.1;
            }
            const autoSpin = !interactive && !prefersReducedMotion;

            const material = new T.MeshStandardMaterial({
              color: 0x9fb2c8,
              metalness: 0.1,
              roughness: 0.65,
            });

            let mesh: THREE.Mesh | null = null;
            const loader = new STLLoader();

            const load = (path: string) => {
              setStatus("loading");
              loader.load(
                encodeURI(path),
                (geometry) => {
                  if (cancelled) return;
                  if (mesh) {
                    scene.remove(mesh);
                    mesh.geometry.dispose();
                  }
                  geometry.center();
                  geometry.computeBoundingSphere();
                  const radius = geometry.boundingSphere?.radius ?? 1;
                  mesh = new T.Mesh(geometry, material);
                  scene.add(mesh);
                  camera.position.set(radius * 0.8, radius * 0.6, radius * 2.4);
                  camera.near = radius / 100;
                  camera.far = radius * 100;
                  camera.updateProjectionMatrix();
                  camera.lookAt(0, 0, 0);
                  controls?.update();
                  setStatus("ready");
                },
                undefined,
                () => {
                  if (!cancelled) setStatus("failed");
                },
              );
            };

            const resize = () => {
              const w = node.clientWidth || 1;
              const h = node.clientHeight || 1;
              renderer.setSize(w, h);
              camera.aspect = w / h;
              camera.updateProjectionMatrix();
            };
            window.addEventListener("resize", resize);

            let raf = 0;
            const animate = () => {
              raf = requestAnimationFrame(animate);
              if (autoSpin && mesh) mesh.rotation.y += 0.006;
              controls?.update();
              renderer.render(scene, camera);
            };
            animate();

            apiRef.current = {
              load,
              dispose: () => {
                cancelAnimationFrame(raf);
                window.removeEventListener("resize", resize);
                controls?.dispose();
                material.dispose();
                if (mesh) mesh.geometry.dispose();
                renderer.dispose();
                renderer.domElement.remove();
              },
            };

            load(srcRef.current);
          })
          .catch(() => {
            if (!cancelled) setStatus("failed");
          });
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);
    return () => {
      cancelled = true;
      observer.disconnect();
      apiRef.current?.dispose();
      apiRef.current = null;
    };
  }, [interactive]);

  // Reload geometry when the selected version changes.
  useEffect(() => {
    apiRef.current?.load(src);
  }, [src]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={alt}
      className={`relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-panel ${className}`}
    >
      <span className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-line bg-ground/85 px-2.5 py-1 font-mono text-hud uppercase text-muted backdrop-blur-sm">
        {status === "failed"
          ? "3D unavailable"
          : status === "ready"
            ? interactive
              ? "Drag to orbit"
              : "3D model"
            : "Loading 3D…"}
      </span>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors. (If lint flags the `three` dynamic-import type cast, confirm `@types/three` installed; the `as typeof THREE` cast is intentional and should satisfy it.)

- [ ] **Step 4: Manual smoke test in isolation**

Temporarily add to `src/app/page.tsx` imports and JSX (revert before commit): render `<StlViewer src="/images/fushion360-projects/switchback-pro/Switchback_Nano_Mount V7.stl" alt="test" className="max-w-md" />`.
Run: `npm run dev`, open `http://localhost:3000`, scroll to it.
Expected: a grey 3D model appears and can be dragged to orbit; badge reads "Drag to orbit". Then **revert the temporary edit**.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/components/ui/stl-viewer.tsx
git commit -m "feat: add three.js STL viewer component

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: FusionViewer — viewer + version switcher

**Files:**
- Create: `src/components/ui/fusion-viewer.tsx`

**Interfaces:**
- Consumes: `StlViewer` from Task 2; `FusionVersion` type from Task 1.
- Produces: `function FusionViewer(props: { versions: FusionVersion[]; title: string }): JSX.Element` — a client component holding the active-version state, rendering the 3D viewer, a row of version buttons, and the active version's note.

- [ ] **Step 1: Create the component**

Create `src/components/ui/fusion-viewer.tsx` with exactly this content:

```tsx
"use client";

import { useState } from "react";

import { StlViewer } from "@/components/ui/stl-viewer";
import type { FusionVersion } from "@/lib/data/fusion";

export interface FusionViewerProps {
  /** Ordered oldest → final. */
  versions: FusionVersion[];
  /** Project title, used in the viewer's accessible label. */
  title: string;
}

/**
 * The interactive centrepiece of a process page: one STL viewer plus a switcher
 * across every design iteration. Defaults to the final (last) version.
 */
export function FusionViewer({ versions, title }: FusionViewerProps) {
  const [active, setActive] = useState(versions.length - 1);
  const current = versions[active];

  return (
    <div>
      <StlViewer
        src={current.file}
        alt={`Interactive 3D model — ${title}, ${current.label}`}
        className="aspect-[16/10] w-full"
      />

      <div
        role="group"
        aria-label="Design versions"
        className="mt-4 flex flex-wrap gap-2"
      >
        {versions.map((version, index) => {
          const isActive = index === active;
          return (
            <button
              key={version.file}
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={isActive}
              className={`rounded-full border px-3 py-1.5 font-mono text-hud uppercase transition-colors ${
                isActive
                  ? "border-signal bg-signal text-[#0B0F14]"
                  : "border-line bg-panel text-muted hover:border-signal/50 hover:text-signal-ink"
              }`}
            >
              {version.label}
            </button>
          );
        })}
      </div>

      <p
        aria-live="polite"
        className="mt-4 text-pretty text-sm leading-relaxed text-muted"
      >
        <span className="font-mono text-hud uppercase text-signal-ink">
          {current.label}
        </span>{" "}
        — {current.note}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/fusion-viewer.tsx
git commit -m "feat: add Fusion version-switcher viewer

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: /maker/[slug] process page + sitemap

**Files:**
- Create: `src/app/maker/[slug]/page.tsx`
- Modify: `src/app/sitemap.ts`

**Interfaces:**
- Consumes: `getFusionProjects`, `getFusionProject`, `FusionProject` from Task 1; `FusionViewer` from Task 3.
- Produces: the `/maker/<slug>` routes (one per project) and their sitemap entries.

- [ ] **Step 1: Read the Next 16 routing/metadata docs**

Before writing, skim the dynamic-route + metadata guide under `node_modules/next/dist/docs/` (per Global Constraints). Confirm the `params: Promise<{ slug: string }>` + `await params` shape — it matches `src/app/projects/[slug]/page.tsx`, which is the reference implementation.

- [ ] **Step 2: Create the page**

Create `src/app/maker/[slug]/page.tsx` with exactly this content:

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { FusionViewer } from "@/components/ui/fusion-viewer";
import { getFusionProject, getFusionProjects } from "@/lib/data/fusion";
import { buildMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return getFusionProjects().map((project) => ({ slug: project.slug }));
}

interface MakerPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: MakerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getFusionProject(slug);
  if (!project) return { title: "Project not found" };

  return buildMetadata({
    title: `${project.title} — Fusion 360`,
    description: project.tagline,
    path: `/maker/${project.slug}`,
    type: "article",
    tags: project.tools,
  });
}

export default async function MakerProjectPage({ params }: MakerPageProps) {
  const { slug } = await params;
  const project = getFusionProject(slug);
  if (!project) notFound();

  return (
    <article className="pb-24">
      <div className="mx-auto max-w-4xl px-5 pt-12 sm:px-8">
        <Link
          href="/#maker"
          className="inline-flex items-center gap-2 font-mono text-hud uppercase text-muted transition-colors hover:text-signal-ink"
        >
          <span aria-hidden="true">←</span> All builds
        </Link>
      </div>

      <header className="mx-auto max-w-4xl px-5 pt-10 sm:px-8">
        <p className="font-mono text-hud uppercase text-signal-ink">Fusion 360</p>
        <h1 className="mt-4 text-balance font-display text-display-lg font-bold">
          {project.title}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
          {project.tagline}
        </p>
        <p className="mt-5 max-w-2xl text-pretty leading-relaxed text-muted">
          {project.story}
        </p>
        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.tools.map((tool) => (
            <Badge key={tool}>{tool}</Badge>
          ))}
        </div>
      </header>

      <section
        aria-label="Interactive 3D model"
        className="mx-auto mt-12 max-w-4xl px-5 sm:px-8"
      >
        <FusionViewer versions={[...project.versions]} title={project.title} />
      </section>

      <section
        aria-labelledby="timeline-heading"
        className="mx-auto mt-16 max-w-4xl px-5 sm:px-8"
      >
        <h2
          id="timeline-heading"
          className="font-display text-display-sm font-bold"
        >
          How it evolved
        </h2>
        <ol className="mt-8 space-y-6 border-l border-line pl-6">
          {project.versions.map((version, index) => (
            <li key={version.file} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full border border-signal bg-ground"
              />
              <p className="flex items-baseline gap-3">
                <span className="font-mono text-hud uppercase text-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display font-semibold">{version.label}</span>
              </p>
              <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted">
                {version.note}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {project.photos.length > 0 ? (
        <section
          aria-labelledby="photos-heading"
          className="mx-auto mt-16 max-w-4xl px-5 sm:px-8"
        >
          <h2
            id="photos-heading"
            className="font-display text-display-sm font-bold"
          >
            From the workbench
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {project.photos.map((photo) => (
              <li
                key={photo}
                className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-panel"
              >
                <Image
                  src={photo}
                  alt={`${project.title} — build photo`}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
```

- [ ] **Step 3: Add the routes to the sitemap**

In `src/app/sitemap.ts`, add the import and a `maker` array, then include it in the returned array.

Add after the existing imports (line 5 area):
```ts
import { getFusionProjects } from "@/lib/data/fusion";
```

Add after the `projects` block (before `posts`):
```ts
  const maker: MetadataRoute.Sitemap = getFusionProjects().map((project) => ({
    url: absoluteUrl(`/maker/${project.slug}`),
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.7,
  }));
```

Change the final return to include it:
```ts
  return [...staticRoutes, ...projects, ...maker, ...posts];
```

- [ ] **Step 4: Verify build and view each page**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: build succeeds; output shows the 4 `/maker/[slug]` routes prerendered.

Then run `npm run dev` and visit `http://localhost:3000/maker/drone-mount`.
Expected: story text, a working 3D viewer defaulting to "Final", clicking a version reloads the model and updates the note, the "How it evolved" timeline lists all 11 steps, and two build photos render.

- [ ] **Step 5: Commit**

```bash
git add src/app/maker/[slug]/page.tsx src/app/sitemap.ts
git commit -m "feat: add /maker/[slug] Fusion 360 process pages

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: Rewrite the homepage "Make" section

**Files:**
- Modify: `src/lib/data/maker.ts` (replace placeholder builds with real FPV/printer content)
- Modify: `src/components/sections/maker.tsx` (render Fusion cards linking to detail pages + reserved drone photos)

**Interfaces:**
- Consumes: `getFusionProjects` from Task 1; `StlViewer` from Task 2.
- Produces: an updated `Maker` section; a `droneBuilds` export from `maker.ts`.

- [ ] **Step 1: Replace the maker data**

Replace the entire contents of `src/lib/data/maker.ts` with:

```ts
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
```

- [ ] **Step 2: Rewrite the Maker section component**

Replace the entire contents of `src/components/sections/maker.tsx` with:

```tsx
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { StlViewer } from "@/components/ui/stl-viewer";
import { droneBuilds } from "@/lib/data/maker";
import { getFusionProjects } from "@/lib/data/fusion";

/**
 * Physical builds. Fusion 360 projects render an auto-rotating STL preview and
 * link to their process page; the FPV drones are photo cards.
 */
export function Maker() {
  const fusion = getFusionProjects();

  return (
    <Section
      id="maker"
      callsign="Make"
      title="Things that fly, and the parts that hold them together"
      lede="FPV freestyle quads I build and tune myself, and the parts I design in Fusion 360 and print on my Creality when the off-the-shelf version keeps breaking. Each print below went through several iterations — open one to orbit every version."
    >
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {fusion.map((project, index) => {
          const final = project.versions[project.versions.length - 1];
          return (
            <li key={project.slug}>
              <Reveal delay={index * 0.06} className="h-full">
                <Link
                  href={`/maker/${project.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-panel transition-colors hover:border-signal/50"
                >
                  <StlViewer
                    src={final.file}
                    alt={`3D model of ${project.title}`}
                    interactive={false}
                    className="rounded-none border-0 border-b border-line"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-balance font-display text-lg font-semibold">
                      {project.title}
                    </h3>
                    <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-muted">
                      {project.tagline}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tools.map((tool) => (
                        <Badge key={tool}>{tool}</Badge>
                      ))}
                    </div>
                    <span className="mt-5 inline-flex items-center gap-2 font-mono text-hud uppercase text-signal-ink transition-colors group-hover:text-signal">
                      See the process
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          );
        })}
      </ul>

      <h3 className="mt-14 font-display text-display-sm font-bold">
        The drones themselves
      </h3>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2">
        {droneBuilds.map((build, index) => (
          <li key={build.id}>
            <Reveal delay={index * 0.08} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-panel">
                <div className="relative aspect-[4/3] border-b border-line bg-ground">
                  <Image
                    src={build.image}
                    alt={build.title}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h4 className="text-balance font-display text-lg font-semibold">
                    {build.title}
                  </h4>
                  <p className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-muted">
                    {build.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {build.tools.map((tool) => (
                      <Badge key={tool}>{tool}</Badge>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
```

- [ ] **Step 3: Add placeholder drone images so the build doesn't 404**

The two FPV photos don't exist yet. Create lightweight placeholders so `next/image` has a file (Olivier replaces them later at the same paths):

```bash
mkdir -p public/images/maker
# 1x1 transparent PNG placeholders at the reserved paths
printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82' > "public/images/maker/fpv-freestyle-1.jpg"
cp "public/images/maker/fpv-freestyle-1.jpg" "public/images/maker/fpv-freestyle-2.jpg"
```

> Note in the commit body that these two files are placeholders to be swapped for real FPV photos.

- [ ] **Step 4: Verify the old placeholder data is fully gone**

Run: `grep -rn "makerBuilds\|placeholder-part\|bird-feeder\|print-farm\|camera-mount\|tinywhoop" src/`
Expected: **no matches** (the old `makerBuilds` export and its placeholder image references are gone). If anything matches, remove the reference.

- [ ] **Step 5: Verify build and view the section**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: succeeds.

Then `npm run dev`, open `http://localhost:3000/#maker`.
Expected: three Fusion cards with slowly auto-rotating 3D previews (no drag), each a link to its process page; below them, "The drones themselves" with two placeholder photo cards. Clicking a Fusion card opens `/maker/<slug>`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/data/maker.ts src/components/sections/maker.tsx public/images/maker
git commit -m "feat: rewrite Make section with Fusion cards and FPV drones

Homepage cards preview each print in 3D and link to the process page.
FPV drone photos are reserved placeholders to be swapped for real images.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 6: SwissHacks 2024 ceremony photos

**Files:**
- Modify: `src/lib/data/hackathons.ts` (add `photos?` field; populate the 2024 entry)
- Modify: `src/components/sections/hackathons.tsx` (swap cover source; render a thumbnail strip)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: an optional `photos?: string[]` on the `Hackathon` interface; a thumbnail strip rendered only when `photos` is present.

- [ ] **Step 1: Extend the data**

In `src/lib/data/hackathons.ts`, add a field to the `Hackathon` interface (after `image: string;`, line 15):
```ts
  /** Extra photos (e.g. award ceremony). Renders a thumbnail strip when set. */
  photos?: string[];
```

Then update the `swisshacks-2024` entry: change its `image` to the first ceremony photo and add the `photos` array. Replace its current `image` line:
```ts
    image: "/images/hackathons/swiss-ai-hack.png",
```
within the `swisshacks-2024` object with:
```ts
    image: "/images/swisshack-2024/SN_08698_1.jpg",
    photos: [
      "/images/swisshack-2024/SN_08698_1.jpg",
      "/images/swisshack-2024/SN_08616_1.jpg",
    ],
```

> Leave the other four hackathon entries untouched — only `swisshacks-2024` gets `photos`.

- [ ] **Step 2: Render the thumbnail strip**

In `src/components/sections/hackathons.tsx`, add the strip directly after the closing `</div>` of the cover-image block (the `<div className="relative aspect-[14/9] …">…</div>`, which ends at line 49), i.e. between that `</div>` and the `<div className="flex flex-1 flex-col p-5">`:

```tsx
                {event.photos ? (
                  <ul className="flex gap-2 border-b border-line p-3">
                    {event.photos.map((photo) => (
                      <li
                        key={photo}
                        className="relative aspect-[4/3] w-1/2 overflow-hidden rounded-md border border-line"
                      >
                        <Image
                          src={photo}
                          alt={`${event.event} — ceremony photo`}
                          fill
                          sizes="(min-width: 1024px) 190px, 40vw"
                          className="object-cover"
                        />
                      </li>
                    ))}
                  </ul>
                ) : null}
```

- [ ] **Step 3: Verify build and view the card**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: succeeds.

Then `npm run dev`, open `http://localhost:3000/#hackathons`.
Expected: the SwissHacks 2024 card shows a real ceremony photo as its cover, a "Winner" badge, and a two-thumbnail strip of both ceremony photos below the cover. All other hackathon cards look unchanged (no strip).

- [ ] **Step 4: Commit**

```bash
git add src/lib/data/hackathons.ts src/components/sections/hackathons.tsx
git commit -m "feat: show SwissHacks 2024 ceremony photos on the hackathon card

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 7: Track assets and final full-site verification

**Files:**
- Adds the untracked asset folders to git; final build gate.

- [ ] **Step 1: Confirm assets aren't gitignored, then stage them**

Run:
```bash
git check-ignore public/images/fushion360-projects public/images/swisshack-2024 || echo "not ignored — ok to add"
git add public/images/fushion360-projects public/images/swisshack-2024
git status --short
```
Expected: "not ignored — ok to add", then the STL/photo files appear staged. (If `.gitignore` blocks them, use `git add -f` and note it.)

- [ ] **Step 2: Final full build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: clean typecheck, no lint errors, successful build listing the 4 `/maker/[slug]` routes.

- [ ] **Step 3: Manual full-flow check**

Run `npm run dev` and verify end to end:
- Homepage `#maker`: 3 rotating Fusion previews + 2 drone placeholder cards.
- Click each Fusion card → its `/maker/<slug>` page loads; version switcher reloads the model and note; timeline + photos (where present) render.
- `#hackathons`: SwissHacks 2024 shows ceremony cover + thumbnail strip.
- Toggle OS "reduce motion" and reload a process page: the model does not auto-spin.

- [ ] **Step 4: Commit the assets**

```bash
git commit -m "chore: track Fusion 360 and SwissHacks 2024 assets

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- Rich process pages per project → Task 4. ✓
- Version switcher with live 3D orbit → Tasks 2 + 3. ✓
- Load STL directly, no conversion, no poster needed → Task 2 (three.js STLLoader). ✓
- Combine tischhacken + stehtisch into one "Table hook" → Task 1 data. ✓
- Four projects (table hook, lamp ring, drone mount, switchback) → Task 1. ✓
- Draft narrative, English → Task 1 stories/notes. ✓
- Homepage Make section links into pages, names Creality + FPV freestyle, reserves 2 drone photo slots, room for a 5th (stethoscope) project → Task 5 (adding a stethoscope entry to `fusion.ts` later needs no structural change). ✓
- `.3mf` ignored for viewing → data references only `.stl`. ✓
- Assets stay in place; special characters encoded → Task 1 paths + Task 2 `encodeURI`. ✓
- Next 16 docs read before routing code → Task 4 Step 1. ✓
- SwissHacks 2024 cover + photo strip → Task 6. ✓
- Deferred assets (stethoscope, drone photos) require only data edits → Task 5 reserved slots; stethoscope is a pure `fusionProjects` append. ✓

**Placeholder scan:** No "TBD/TODO" left in code. The two drone JPGs are intentional runtime placeholders (documented in Task 5 commit) — a spec requirement, not a plan gap.

**Type consistency:** `FusionProject`/`FusionVersion` field names (`file`, `label`, `note`, `versions`, `photos`, `tagline`, `story`, `tools`, `slug`) are used identically in Tasks 1, 3, 4, 5. `getFusionProjects`/`getFusionProject` names match across Tasks 1, 4, 5. `StlViewer` prop names (`src`, `alt`, `interactive`, `className`) match across Tasks 2, 3, 5. `DroneBuild`/`droneBuilds` match across Task 5.
