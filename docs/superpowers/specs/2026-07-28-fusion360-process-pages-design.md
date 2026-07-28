# Fusion 360 Process Pages — Design

**Date:** 2026-07-28
**Status:** Approved, ready for implementation plan

## Goal

Showcase Olivier's Fusion 360 / 3D-printing work on the portfolio site, with the
emphasis on **process**: how many design iterations it took before each part
worked. Visitors should be able to orbit the models in 3D and step through the
versions to see the design evolve.

This is the distinctive angle — most model showcases show only the finished
part. Here the iteration history *is* the story.

## Scope

### In scope (assets available now)

Four projects, each with its own process page:

1. **Table hook** — the headline project. Combines the `tischhacken` and
   `stehtisch` source folders into one design journey; the standing-desk hook is
   presented as a later branch/variant of the same idea. Includes the DJI-bag
   carrying variant.
2. **Lamp ring** — a circular mount made on request for Olivier's mother
   (`Momauftrag`). Has 3 process photos and drawio sketches.
3. **Drone upper mount** — protective top mount for a self-built FPV drone
   (`oberhalterung`). The richest process story: a written `Vorgehen.txt` log,
   ~10 STL iterations, a hole-sizing prototype trick, and a late antenna cutout.
4. **Switchback nano mount** — a camera holder for a self-built FPV drone that
   had no proper camera mount (`switchback-pro`). It clamps **between two
   rails/lines** and has **holes on the sides to bolt the camera in place**, so
   the camera can't shift or fly off mid-flight. 7 versions and 6 process photos.

### Deferred (design must leave room; filled when assets arrive)

- **Stethoscope hook** — mentioned but no source folder yet. Data model and
  homepage grid must accommodate adding it as a 5th project without rework.
- **Two FPV-drone photos** — homepage "Make" section reserves two image slots.
- **Creality printer note** — named in the Make-section intro and in project
  tool lists; a fuller callout can be added when photos arrive.

### Explicitly out of scope

- `.3mf` slicer files are not rendered in the browser (they are print-prep
  files). They may optionally be offered as downloads later, but not in this
  iteration.
- No STL→GLB conversion pipeline. STL is loaded directly (see below).

## Architecture

### Data module — `src/lib/data/fusion.ts`

A typed data module (not MDX — the version-switcher structure is richer than
prose and benefits from a typed shape). Proposed interfaces:

```ts
export interface FusionVersion {
  /** Path under /public to the .stl file. */
  file: string;
  /** Short label shown on the version switcher, e.g. "v1", "DJI bag", "Final". */
  label: string;
  /** One line: what changed in this version and why it mattered. */
  note: string;
}

export interface FusionProject {
  slug: string;              // route segment, e.g. "table-hook"
  title: string;
  tagline: string;           // one-line hook under the title
  /** Intro story, a short paragraph or two. May contain the "why". */
  story: string;
  tools: string[];           // e.g. ["Fusion 360", "Creality", "PETG"]
  versions: FusionVersion[]; // ordered oldest → final
  /** Process photos under /public; may be empty. */
  photos: string[];
  featured?: boolean;        // table hook = true
}

export const fusionProjects: readonly FusionProject[] = [ /* ... */ ];
```

The final/best version is the last entry in `versions` and is what the viewer
loads first on the detail page.

### Route — `src/app/maker/[slug]/page.tsx`

Mirrors the existing `src/app/projects/[slug]/page.tsx` pattern: static params
from `fusionProjects`, per-page metadata, 404 for unknown slugs. Follows Next
16 conventions (see Tech Notes — the docs must be read first, per `AGENTS.md`).

### STL viewer — `src/components/ui/stl-viewer.tsx`

New client component. Adds the `three` dependency (three.js `STLLoader` +
`OrbitControls`). Responsibilities:

- Lazy-load the three.js bundle only when scrolled near the viewport (mirror the
  existing `model-viewer.tsx` IntersectionObserver approach so the page stays
  cheap for visitors who don't reach it).
- Fetch and render a single STL from a `src` prop; orbit controls for
  drag-to-rotate; sensible auto-frame/centering and a neutral material.
- Reload cleanly when `src` changes (version switch) — dispose old geometry.
- Respect `prefers-reduced-motion` (no auto-spin when set).
- Graceful failure state ("3D unavailable") like the current viewer.

Loading STL directly means **no poster image is required** — the rendered model
is its own thumbnail, which solves the missing-photo problem for the table hook
and standing-desk files.

### Version switcher

Part of the detail page (can live in a small client wrapper alongside
`StlViewer`). Renders a button per version; clicking sets the active `src` and
shows that version's `note`. Keyboard accessible; the active version is visually
marked.

### Homepage "Make" section — `src/components/sections/maker.tsx` + `maker.ts`

Replace the current placeholder `makerBuilds` data with reality:

- Intro/lede names the **Creality** printer and the **FPV freestyle** focus.
- Two reserved slots for the drone photos (placeholder until assets arrive).
- A grid of the 4 Fusion project cards. Each card shows the model (via the STL
  viewer thumbnail or a photo) + title + tagline + tools, and **links to its
  `/maker/[slug]` process page.**

The existing `MakerBuild` shape may be folded into / replaced by the new
`fusion.ts` model where appropriate; the FPV-drone photo entries remain simple
image cards with no detail page.

## Detail page layout

```
Table hook                          ← title + tagline + story intro
┌──────────────────────────────┐
│      interactive 3D orbit      │   ← StlViewer, loads selected version
└──────────────────────────────┘
[v1][DJI Tasche][Standard]…[Final]  ← version switcher (click = reload in 3D)
"Standard version: widened the arm so a DJI bag clears the edge"
── Iteration timeline ───────────    ← each version: label · what changed · why
── Process photos ───────────────    ← gallery, shown only where photos exist
Tools: Fusion 360 · Creality · PETG
```

## Content plan

Olivier writes the final "why" copy; Claude drafts English first drafts from the
filenames, version names, the `Vorgehen.txt` log, and the spoken description.
Source material per project:

- **Table hook:** `tischhacken` (Standard, v1, DJI Tasche, DJI Bag Version) +
  `stehtisch` (v1, v3). No photos — model-as-thumbnail.
- **Lamp ring:** `Momauftrag` — "Prototyp Klein Zu Klein" (prototype too small),
  RingProject, V3 KreisLampe, UftagFertig (finished). 3 photos, 2 drawio sketches.
- **Drone upper mount:** `oberhalterung` — the "Loch" series (flat surface →
  hole-size prototype → corrected holes → side walls → antenna cutout). Draft
  directly from `Vorgehen.txt`. 2 photos.
- **Switchback nano mount:** `switchback-pro` — Nano Mount v1–v7 + Custom. A
  camera holder clamping between two rails with side holes to bolt the camera
  down so it stays fixed in flight. 6 photos.

All narrative is in **English** (site language), even though source filenames
and `Vorgehen.txt` are German.

## Tech notes

- **Next 16 (16.2.11):** Per `AGENTS.md` / `CLAUDE.md`, this is not stock
  Next.js. Read `node_modules/next/dist/docs/` for routing, dynamic params,
  metadata, and `next/image` conventions **before** writing route/metadata code.
- **New dependency:** `three` (for STL loading + orbit controls). Loaded lazily,
  client-side only, consistent with the existing `@google/model-viewer` pattern.
- **Assets stay in place** under `/public/images/fushion360-projects/` (the
  folder name misspelling is cosmetic and left as-is to avoid churn). STL files
  are fetched on demand per version, so page load stays cheap.
- **Accessibility:** viewer has an `alt`/description; version switcher is
  keyboard-navigable; reduced-motion respected.

## Success criteria

- Each of the 4 projects has a working `/maker/[slug]` page.
- The 3D viewer loads STL directly and lets a visitor orbit any version, with a
  version switcher that reloads the model and shows that version's note.
- The homepage Make section links into the process pages and names the Creality
  printer + FPV freestyle focus, with room reserved for drone photos and a
  future stethoscope-hook project.
- Adding the deferred assets later requires only data edits, not structural
  changes.
