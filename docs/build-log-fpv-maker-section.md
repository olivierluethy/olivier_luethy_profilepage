# Build Log & Blueprint — The FPV / Fusion 360 "Make" Section

**Project:** olivierluethy.* portfolio site
**Feature area:** the `#maker` ("Make") section + Fusion 360 process pages + hackathon photos
**Date built:** 2026-07-28 (one focused session)
**Wall-clock:** ~2 hours, first spec → final polish (17 commits, 83 files changed)

---

## What this document is

A blueprint of how one section of this portfolio went from an empty placeholder to
an interactive, animated showcase — every request, every decision, and the reason
behind it, in the order it happened.

Two audiences:

- **A colleague** picking up the code — so the *why* behind each choice is on record,
  not just the *what*.
- **A future client** — so the real shape of this kind of work is visible: how it
  starts vague, gets pinned down, and grows through rounds of feedback and asset
  hand-offs. The calendar cost is rarely the code; it's the decisions and the
  back-and-forth.

> Honest note on timing: this was an AI-assisted pair-building session, so the
> ~2-hour figure is elapsed session time, not a traditional person-day estimate.
> The transferable lesson isn't the raw hours — it's the **sequence of decisions**
> and how much of the work is discovery, asset curation, and iteration rather than
> typing code.

---

## TL;DR — what got built

| Deliverable | What it is |
|---|---|
| **4 Fusion 360 "process pages"** | `/maker/table-hook`, `/maker/lamp-ring`, `/maker/drone-mount`, `/maker/switchback-mount` — each with an interactive 3D model, a version switcher across every design iteration, an iteration timeline, and a process-photo gallery |
| **In-browser STL viewer** | Loads raw `.stl` exports directly (no format conversion), orbit controls, lazy-loaded |
| **Rewritten "Make" section** | Homepage cards that preview each print in 3D and link to its process page |
| **Three FPV drones** | Two freestyle quads + one racing quad, each a card with a hero photo and a thumbnail strip |
| **SwissHacks 2024 photos** | Real award-ceremony photos on the hackathon card (cover + thumbnail strip) |
| **Animated FPV flyover** | Amber side-profile drone silhouettes flying across the section, one held in a HUD targeting reticle — reduced-motion safe |

New tech introduced: **three.js** (STL rendering). Reused existing: **framer-motion**
(animation), **sharp** (image downsizing), the site's amber "signal" accent and
`Reticle` brand motif.

---

## How we worked (the method)

The first half followed a deliberate spec-first workflow; the second half was a
faster feedback loop as real photos and new ideas arrived.

```
Brainstorm  →  Spec (agreed & committed)  →  Plan (task-by-task)  →  Build  →  Ship
   │                                                                          │
   └──────────────  then: iterate as assets & feedback arrive  ◄──────────────┘
```

- **Brainstorm before building.** Every ambiguous choice was turned into a plain
  question with 2–3 options and a recommendation, answered before any code.
- **Spec, then plan, then execute.** The design was written to
  `docs/superpowers/specs/2026-07-28-fusion360-process-pages-design.md` and the
  step-by-step plan to
  `docs/superpowers/plans/2026-07-28-fusion360-process-pages.md`.
- **One quality gate, every commit.** This repo has no test runner, so the gate is
  `tsc --noEmit` + `eslint` + `next build` + a visual check. Nothing shipped red.
- **Ship straight to `master`.** Solo repo — work on a branch, verify, merge, push.

---

## Timeline (from the commit history)

| Time | Commit | Milestone |
|---|---|---|
| 11:50 | `docs: … design spec` | Fusion 360 process-pages **spec** written & agreed |
| 11:55 | `docs: clarify Switchback…` | Spec refined after a clarifying answer |
| 11:59 | `docs: … SwissHacks photos to spec` | Second request folded into the spec |
| 12:05 | `docs: … implementation plan` | Task-by-task **plan** written |
| 12:07 | `feat: Fusion 360 project data module` | Build begins — data model |
| 12:09 | `feat: three.js STL viewer component` | In-browser 3D viewer |
| 12:10 | `feat: Fusion version-switcher viewer` | Iteration switcher |
| 12:11 | `feat: /maker/[slug] process pages` | Detail routes live |
| 12:12 | `feat: rewrite Make section` | Homepage cards → process pages |
| 12:13 | `feat: SwissHacks 2024 ceremony photos` | Hackathon card upgrade |
| 12:31 | *merge to `master`* | First release shipped |
| 12:43 | `feat: real photos for the two FPV drones` | Drone photos curated & added |
| 12:49 | `feat: show the first FPV quad fully assembled` | Follow-up: finished-drone shots |
| 13:20 | `feat: add the third drone, a racing quad` | Third drone added |
| 13:31 | `feat: animated FPV drone flyover` | The showpiece animation |
| 13:41 | `feat: side-profile drones, facing travel` | Animation refined after feedback |

Roughly: **~40 min** of spec + plan, **~25 min** to build and ship the first
release, then **~70 min** of asset-driven iteration and the animation.

---

## The story, phase by phase

### Phase 1 — Fusion 360 process pages (the core ask)

**The request, in the user's words:** show the 3D-printing work — not just the finished
part, but *the whole process*, the many iterations it took to get a design right, with
models people can rotate and inspect themselves.

**What we pinned down (brainstorm):**

- **Depth:** rich per-project process pages (not just cards). → distinctive, matches the
  "show the journey" intent.
- **Iterations:** a version switcher that reloads *any* version in live 3D (not just the
  final). → the standout feature.
- **Grouping:** combine the desk-hook and standing-desk-hook source folders into one
  "Table hook" story.
- **Narrative:** drafted from the filenames + a German process log (`Vorgehen.txt`) +
  the user's spoken description, for the user to refine.

**Key technical decision — STL, not GLB.** The site already had a GLB/GLTF viewer
(`@google/model-viewer`), but the source files were `.stl`. Rather than build a
conversion pipeline, we loaded STL **directly** in the browser with three.js. Payoff:
no conversion step, and the rendered model doubles as the thumbnail — so projects with
no photos still look complete.

**Built:** a typed data module (`src/lib/data/fusion.ts`), an `StlViewer` (three.js,
lazy-loaded, reduced-motion aware), a `FusionViewer` (viewer + version switcher), and
the `/maker/[slug]` route with story → 3D → "how it evolved" timeline → photos.

### Phase 2 — SwissHacks 2024 photos (a bolt-on request)

Mid-stream, the user added award-ceremony photos and wanted them on the SwissHacks 2024
hackathon card (which was reusing a generic image). Decision: **cover + thumbnail
strip** — swap in a real ceremony photo as the cover, add both shots as a small strip.
Implemented as an optional `photos?` field so every other card was untouched.

### Phase 3 — The three drones (asset-driven iteration)

This phase shows how real projects actually move: in rounds, as material arrives.

1. **Two drones.** The user dropped ~18 photos into the folder. We identified them as
   *two different quads* — a bench build and a finished quad — curated a hero + three
   supporting shots each, and built two cards with a hero + thumbnail strip.
2. **"Show the whole drone."** Feedback: the first card only showed construction, not
   the finished aircraft. The user added assembled shots; we re-led that card with the
   complete quad and kept one bench shot as a build glimpse.
3. **A third drone.** The user added a racing build (different frame, self-printed grey
   top mount tied to the Fusion "upper mount" model). Added as a third card; grid went
   to three columns; copy called out which printed parts were self-designed.

**Repo-hygiene decision:** the originals were huge (5–8 MB DSLR files). We **downsized
the curated picks to web size** with `sharp` (~2000px, ~300 KB each), committed only
those, and left the full-res originals untracked so the repo stayed lean.

### Phase 4 — The animated FPV flyover (the showpiece)

**The request:** as a visitor scrolls into the FPV section, show drones flying around —
"oh wow, this guy builds FPV drones" — realistic, matching the site's orange vibe, not
a jarring foreign element.

**Why it fit the brand:** the site is *already* an "FPV telemetry HUD" theme built on a
single amber accent, with existing `hud-backdrop` and `Reticle` (targeting bracket)
components. So the signature became **amber drone silhouettes tracked by the site's own
HUD reticle** — native, not bolted on. Boldness spent on the lock-on; everything else
kept quiet, behind the content, non-interactive, and reduced-motion safe.

**One round of feedback changed the drawing.** The first pass drew the drone **top-down**
(X-frame from above), which read as flying "flat/upside-down." The user wanted the
**natural side view** — how you actually watch a drone rip past, matching the photos.
We redrew the glyph in side profile (body, battery on top, camera at the front,
edge-on spinning prop discs, immortal-T antenna) and mirrored it so the nose leads the
direction of travel.

---

## Decision log (the *why*)

| Decision | Chosen | Why |
|---|---|---|
| Show iterations | Version switcher in live 3D | The iteration story *is* the differentiator; static images would undersell it |
| 3D format | Load STL directly (three.js) | Avoids a conversion pipeline; the model becomes its own thumbnail |
| Page depth | Dedicated `/maker/[slug]` pages | Room for the full story; homepage stays scannable |
| Narrative sourcing | Draft from evidence, user refines | Fastest path to something real to react to |
| SwissHacks photos | Cover + thumbnail strip | Shows both shots without a new lightbox dependency |
| Big source photos | Downsize picks, leave originals untracked | Keeps the repo lean and the site fast |
| Animation identity | Reuse amber accent + `Reticle` motif | Feels part of the site, not a foreign widget |
| Animation restraint | Behind content, low opacity, reduced-motion still | "Wow" without hurting readability or accessibility |
| Drone drawing | Side profile facing travel | Matches how drones are actually seen (and the photos) |

---

## Technical inventory

**New files**

- `src/lib/data/fusion.ts` — the four projects, their versions, notes, photos
- `src/components/ui/stl-viewer.tsx` — three.js STL renderer (lazy, orbit, reduced-motion)
- `src/components/ui/fusion-viewer.tsx` — viewer + version switcher
- `src/app/maker/[slug]/page.tsx` — the process-page route
- `src/components/ui/drone-quad.tsx` — the side-profile drone SVG glyph
- `src/components/ui/drone-flyover.tsx` — the animated flyover
- `docs/superpowers/specs/2026-07-28-fusion360-process-pages-design.md` — the spec
- `docs/superpowers/plans/2026-07-28-fusion360-process-pages.md` — the plan

**Modified files**

- `src/components/sections/maker.tsx` — rewritten around Fusion cards + drones + flyover
- `src/lib/data/maker.ts` — real FPV-drone data
- `src/lib/data/hackathons.ts` + `src/components/sections/hackathons.tsx` — photo strip
- `src/components/ui/section.tsx` — added an optional `backdrop` slot (behind-content layer)
- `src/app/sitemap.ts` — the new `/maker/*` routes
- `src/app/globals.css` — the prop-blur keyframe

**Dependencies:** added `three` + `@types/three` (aligned to `^0.183` to match
`@google/model-viewer`'s peer). Reused `framer-motion`, `sharp`, `next/image`.

---

## Guardrails held throughout

- **Accessibility:** decorative layers are `aria-hidden` and `pointer-events-none`;
  the 3D viewers carry text alternatives; the version switcher is keyboard-navigable;
  **reduced-motion** is respected everywhere (the flyover falls back to a static still,
  props stop, auto-rotate stops).
- **Performance:** the three.js bundle and each STL load lazily, only when scrolled
  near; source photos are downsized to web size; animations run on compositor-friendly
  transforms.
- **Quality gate:** `tsc --noEmit` + `eslint` + `next build` green before every commit.

---

## Deferred / backlog

- **Stethoscope hook** — a fifth Fusion project; a pure data addition to `fusion.ts`
  when assets arrive (no structural work).
- **Draft copy** — the per-version notes and project stories are first drafts in
  `fusion.ts`, to be refined by the user.
- **Full-res originals** — the untracked `DSC*` / `PXL*` / social-media photos remain in
  `public/images/maker/` (kept out of git); if the repo ever needs them, Git LFS is the
  path.
- **Old placeholder art** — four unused PNGs (`freestyle-build.png`, `camera-mount.png`,
  `print-farm.png`, `tinywhoop.png`) can be removed.

---

## What it takes — takeaways for a future build

- **The vague part is the expensive part.** "Show my 3D-printing process" became a
  version-switching 3D viewer, four detail pages, and a data model — only after a few
  targeted questions. Budget for discovery, not just implementation.
- **Assets arrive in rounds, and each round is a design decision.** Half this session
  was reacting to photos as they landed: which to feature, how to crop, how big, how to
  keep the repo lean. That is normal, not overrun.
- **Feedback loops are short but real.** "It's top-down, I want side-on" is one sentence
  that meant redrawing the whole glyph. Plan for a revision pass on anything visual.
- **Constraints become features.** STL-instead-of-GLB removed a whole pipeline *and*
  solved the missing-thumbnail problem. The best decisions often subtract work.
- **A distinctive result comes from the subject's own world.** The animation lands
  because it reuses the site's existing FPV-HUD language (amber, targeting reticle),
  not a generic effect. Identity beats novelty.
