# LinkedIn Project Sync + Tech-Wall Restructure — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sync every LinkedIn project onto the site (12 new cards, 12 enriched), make cover images optional with a logo/monogram fallback, and regroup the tech wall into five categories plus a curated OS/Environment row.

**Architecture:** Projects are MDX files in `content/projects/` with validated frontmatter; the tech wall is derived server-side from those files' `techStack` via `simple-icons`. We (1) relax the mandatory `coverImage` and add a shared `CoverArt` fallback used by cards and the detail-page preview, (2) add a `tech-categories.ts` map that groups the wall, plus an `Environment` OS row, (3) add/enrich content.

**Tech Stack:** Next.js 16.2.11 (App Router), React 19.2.4, TypeScript 5, Tailwind CSS v4, `gray-matter` + `next-mdx-remote`, `simple-icons` ^16.27.1. Package manager: **npm**. No test framework.

## Global Constraints

- **Follow existing repo patterns.** No new Next.js APIs are introduced; all edits mirror components already in `src/components/ui/`. Consult `node_modules/next/dist/docs/` only if an unfamiliar Next API becomes necessary (it should not).
- **Voice:** new/enriched write-ups are first-person, plain, understated — matching `content/projects/whatsapp-customizer.mdx`. No "End-to-End", "Data-Driven", "Key Achievements" headings. One `## How it works` (or similar) heading at most; end with links.
- **Facts only:** assert only what the LinkedIn source states (user counts, awards, tech, dates, links). Never invent. Ambiguities are flagged inline in the write-up's commit message, not guessed.
- **GitHub username:** `BaskLash`.
- **Logos/covers:** every new project uses `coverImage: ""` and relies on the fallback; logos (when supplied) go to `public/images/favicons/<slug>.png` and are auto-detected — never add a `favicon:` key to frontmatter.
- **Status rule:** still-installable/live → `active`, `endDate: ""`. One-off event / offline / finished engagement → `archived` with the end month.
- **Verification gate (every code/content task ends with):** `npx tsc --noEmit && npm run lint && npm run build` — all clean. Build also validates MDX frontmatter (the loader throws on missing required fields).
- **Branch:** all work on `feat/linkedin-project-sync`, never commit to `master`.

---

### Task 0: Create working branch

- [ ] **Step 1: Branch off master**

Run:
```bash
git checkout -b feat/linkedin-project-sync
```
Expected: `Switched to a new branch 'feat/linkedin-project-sync'`

- [ ] **Step 2: Commit the spec + plan already written**

```bash
git add docs/superpowers/specs/2026-07-28-linkedin-project-sync-design.md docs/superpowers/plans/2026-07-28-linkedin-project-sync.md
git commit -m "docs: spec + plan for LinkedIn project sync"
```

---

### Task 1: Cover images optional + shared `CoverArt` fallback

Removes the hard `coverImage` requirement and gives cards/preview a 2-level fallback (logo → monogram) so new projects look complete with no banner.

**Files:**
- Modify: `src/lib/content/projects.ts:57`
- Modify: `src/lib/content/types.ts` (doc comment on `coverImage`)
- Create: `src/components/ui/cover-art.tsx`
- Modify: `src/components/ui/project-card.tsx` (both media blocks)
- Modify: `src/components/ui/live-preview.tsx` (fallback branch + new `favicon` prop)
- Modify: `src/app/projects/[slug]/page.tsx:114` (pass `favicon`)
- Modify: `src/lib/schema.ts:44` (guard empty cover)

**Interfaces:**
- Produces: `CoverArt({ coverImage, favicon, title, sizes, priority? })` — a server-safe component rendering `<Image>` when `coverImage` is set, else logo-on-panel, else a monogram.

- [ ] **Step 1: Make `coverImage` optional in the loader**

In `src/lib/content/projects.ts`, line 57, change:
```ts
    coverImage: requireString(fm, "coverImage", fileName),
```
to:
```ts
    coverImage: optionalString(fm, "coverImage", fileName),
```
(`optionalString` is already imported at the top of the file.)

- [ ] **Step 2: Update the type doc comment**

In `src/lib/content/types.ts`, on the `ProjectFrontmatter.coverImage` field (line ~35), change the field to keep type `string` but add a comment:
```ts
  /** Banner image path, or "" — cards/preview fall back to the logo then a monogram. */
  coverImage: string;
```

- [ ] **Step 3: Create the `CoverArt` component**

Create `src/components/ui/cover-art.tsx`:
```tsx
import Image from "next/image";

/** First 1–2 letters, used when a project has neither cover nor logo. */
function initials(title: string): string {
  const words = title
    .replace(/[^\p{L}\p{N} ]/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return title.replace(/[^\p{L}\p{N}]/gu, "").slice(0, 2).toUpperCase();
}

export interface CoverArtProps {
  coverImage: string;
  favicon: string;
  title: string;
  /** next/image sizes hint for the real-cover case. */
  sizes: string;
  priority?: boolean;
}

/**
 * The image at the top of a project card / the preview fallback. When there is
 * no cover banner it shows the project logo on a panel, and when there is not
 * even a logo it shows a monogram — so a card never renders an empty rectangle.
 */
export function CoverArt({
  coverImage,
  favicon,
  title,
  sizes,
  priority = false,
}: CoverArtProps) {
  if (coverImage) {
    return (
      <Image
        src={coverImage}
        alt={`Cover image for ${title}`}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
    );
  }

  return (
    <div className="flex size-full items-center justify-center bg-panel">
      {favicon ? (
        <Image
          src={favicon}
          alt={`Logo for ${title}`}
          width={96}
          height={96}
          unoptimized
          className="size-[38%] max-h-24 max-w-24 rounded-xl object-contain transition-transform duration-700 group-hover:scale-[1.06]"
        />
      ) : (
        <span className="font-display text-5xl font-bold text-faint transition-colors group-hover:text-signal-ink">
          {initials(title)}
        </span>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Use `CoverArt` in both card variants**

In `src/components/ui/project-card.tsx`, add the import:
```tsx
import { CoverArt } from "@/components/ui/cover-art";
```
Replace the **compact** media `<Image>` (lines ~36–42) with:
```tsx
          <CoverArt
            coverImage={frontmatter.coverImage}
            favicon={frontmatter.favicon}
            title={frontmatter.title}
            sizes="(min-width: 640px) 176px, 100vw"
          />
```
Replace the **featured** media `<Image>` (lines ~91–98, keep the sibling `<Reticle>`) with:
```tsx
        <CoverArt
          coverImage={frontmatter.coverImage}
          favicon={frontmatter.favicon}
          title={frontmatter.title}
          priority={priority}
          sizes="(min-width: 1024px) 560px, (min-width: 640px) 50vw, 100vw"
        />
```
Remove the now-unused `import Image from "next/image";` **only if** no other `Image` usage remains in the file (the favicon-next-to-title `<Image>` at lines ~55 and ~113 still uses it — so keep the import).

- [ ] **Step 5: Add a `favicon` prop to `LivePreview` and use `CoverArt` in its fallback**

In `src/components/ui/live-preview.tsx`:
- Add to `LivePreviewProps`:
```tsx
  /** Project logo, for the fallback when the frame cannot be shown. */
  favicon: string;
```
- Add `favicon` to the destructured params of `LivePreview({ ... })`.
- Add the import:
```tsx
import { CoverArt } from "@/components/ui/cover-art";
```
- Replace the `else` `<Image src={coverImage} …>` block (lines ~100–108) with:
```tsx
          <CoverArt
            coverImage={coverImage}
            favicon={favicon}
            title={title}
            sizes="(min-width: 1024px) 900px, 100vw"
          />
```
- If `Image` is now unused in this file, remove `import Image from "next/image";`.

- [ ] **Step 6: Pass `favicon` from the detail page**

In `src/app/projects/[slug]/page.tsx`, at the `<LivePreview …>` usage (line ~114), add:
```tsx
            favicon={frontmatter.favicon}
```

- [ ] **Step 7: Guard the JSON-LD image**

In `src/lib/schema.ts`, remove line 44 (`image: absoluteUrl(frontmatter.coverImage),`) from the always-on object, and add a conditional spread alongside the others near the end of `projectSchema` (mirroring the blog version):
```ts
    ...(frontmatter.coverImage
      ? { image: absoluteUrl(frontmatter.coverImage) }
      : {}),
```

- [ ] **Step 8: Verify + commit**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all clean; build succeeds (all 19 existing covers unaffected).
```bash
git add src/lib/content/projects.ts src/lib/content/types.ts src/components/ui/cover-art.tsx src/components/ui/project-card.tsx src/components/ui/live-preview.tsx src/app/projects/[slug]/page.tsx src/lib/schema.ts
git commit -m "feat: optional cover images with logo/monogram fallback"
```

---

### Task 2: Tech-icon additions + `tech-categories.ts`

Add brand marks for tech introduced by the new projects, a hand-drawn Windows path (missing from `simple-icons` v16), and the category map.

**Files:**
- Modify: `src/lib/tech-icons.ts`
- Create: `src/lib/tech-categories.ts`

**Interfaces:**
- Produces: `categoryFor(name: string): TechCategory`, `TECH_CATEGORY_ORDER: readonly TechCategory[]`, `OS_ICON_PATHS: Record<"Windows"|"Ubuntu"|"macOS", string>`.

- [ ] **Step 1: Add tech mappings + OS icon paths in `tech-icons.ts`**

Add these entries inside the `TECH_TO_ICON` object:
```ts
  Tauri: "siTauri",
  npm: "siNpm",
  Knex: "siKnexdotjs",
  "discord.py": "siDiscord",
  Tampermonkey: "siTampermonkey",
  "Kali Linux": "siKalilinux",
```
Then, after the `techIcon` function, append:
```ts
/** Windows has no simple-icons mark (trademark removal); hand-drawn 24×24 flag. */
const WINDOWS_PATH =
  "M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801";

/** OS marks for the curated Environment row. Ubuntu/Apple come from simple-icons. */
export const OS_ICON_PATHS: Record<"Windows" | "Ubuntu" | "macOS", string> = {
  Windows: WINDOWS_PATH,
  Ubuntu: (si as Record<string, { path?: string }>).siUbuntu?.path ?? FALLBACK_TECH_PATH,
  macOS: (si as Record<string, { path?: string }>).siApple?.path ?? FALLBACK_TECH_PATH,
};
```
(`si` and `FALLBACK_TECH_PATH` already exist in this file.)

- [ ] **Step 2: Create `tech-categories.ts`**

Create `src/lib/tech-categories.ts`:
```ts
/** Ordered tech-wall categories. */
export const TECH_CATEGORY_ORDER = [
  "Languages",
  "Frameworks & Libraries",
  "Package Managers",
  "Databases",
  "Tools & Platforms",
] as const;

export type TechCategory = (typeof TECH_CATEGORY_ORDER)[number];

/** Tech name (exact frontmatter string) → category. */
const TECH_TO_CATEGORY: Record<string, TechCategory> = {
  // Languages
  Python: "Languages",
  TypeScript: "Languages",
  JavaScript: "Languages",
  Rust: "Languages",
  PHP: "Languages",
  Swift: "Languages",
  Java: "Languages",
  "Java 21": "Languages",
  // Frameworks & Libraries
  "Next.js": "Frameworks & Libraries",
  React: "Frameworks & Libraries",
  Svelte: "Frameworks & Libraries",
  SvelteKit: "Frameworks & Libraries",
  Angular: "Frameworks & Libraries",
  Flutter: "Frameworks & Libraries",
  FastAPI: "Frameworks & Libraries",
  Quarkus: "Frameworks & Libraries",
  ".NET": "Frameworks & Libraries",
  "ASP.NET Core 8": "Frameworks & Libraries",
  "Entity Framework Core": "Frameworks & Libraries",
  SwiftUI: "Frameworks & Libraries",
  Ionic: "Frameworks & Libraries",
  Xamarin: "Frameworks & Libraries",
  "Tailwind CSS": "Frameworks & Libraries",
  "Framer Motion": "Frameworks & Libraries",
  "Socket.io": "Frameworks & Libraries",
  OpenCV: "Frameworks & Libraries",
  WebAssembly: "Frameworks & Libraries",
  ActivityPub: "Frameworks & Libraries",
  "discord.py": "Frameworks & Libraries",
  Tauri: "Frameworks & Libraries",
  // Package Managers
  pnpm: "Package Managers",
  "pnpm monorepo": "Package Managers",
  npm: "Package Managers",
  // Databases
  PostgreSQL: "Databases",
  SQLite: "Databases",
  MySQL: "Databases",
  Prisma: "Databases",
  Knex: "Databases",
  Flyway: "Databases",
  // Tools & Platforms
  "Node.js": "Tools & Platforms",
  Docker: "Tools & Platforms",
  Vercel: "Tools & Platforms",
  Vite: "Tools & Platforms",
  Git: "Tools & Platforms",
  "Chrome Extension APIs": "Tools & Platforms",
  "Canvas API": "Tools & Platforms",
  Zod: "Tools & Platforms",
  Tampermonkey: "Tools & Platforms",
  "Kali Linux": "Tools & Platforms",
  WPScan: "Tools & Platforms",
};

/** Category for a tech name; unmapped tech falls into Tools & Platforms. */
export function categoryFor(name: string): TechCategory {
  return TECH_TO_CATEGORY[name] ?? "Tools & Platforms";
}
```

- [ ] **Step 3: Verify + commit**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: clean.
```bash
git add src/lib/tech-icons.ts src/lib/tech-categories.ts
git commit -m "feat: tech categories + OS icon paths"
```

---

### Task 3: Grouped tech wall + Environment row

**Files:**
- Modify: `src/components/sections/tech-stack.tsx`
- Modify: `src/components/ui/tech-grid.tsx`
- Create: `src/components/ui/environment.tsx`

**Interfaces:**
- Consumes: `categoryFor`, `TECH_CATEGORY_ORDER` (Task 2); `OS_ICON_PATHS` (Task 2); `techIcon` (existing).
- Produces: `Environment()` component; `TechGrid` now takes `{ heading, tech }`.

- [ ] **Step 1: Add a heading to `TechGrid`**

Replace the body of `src/components/ui/tech-grid.tsx` with:
```tsx
"use client";

import type { TechIcon } from "@/lib/tech-icons";

/**
 * One labelled block of the tech wall. Tapping a logo asks the project explorer
 * (further down the page) to filter to it, via a window event.
 */
export function TechGrid({ heading, tech }: { heading: string; tech: TechIcon[] }) {
  const select = (name: string) => {
    window.dispatchEvent(new CustomEvent("select-tech", { detail: name }));
  };

  return (
    <div>
      <h3 className="mb-3 font-mono text-hud uppercase text-faint">{heading}</h3>
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {tech.map((item) => (
          <li key={item.name}>
            <button
              type="button"
              onClick={() => select(item.name)}
              title={`Show projects using ${item.name}`}
              className="group flex w-full flex-col items-center gap-2.5 rounded-lg border border-line bg-panel px-2 py-4 text-muted transition-colors hover:border-signal/50 hover:text-signal-ink"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className={`size-7 ${item.branded ? "" : "opacity-50"}`}
              >
                <path d={item.path} fill="currentColor" />
              </svg>
              <span className="text-center font-mono text-hud uppercase leading-tight">
                {item.name}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Create the `Environment` component**

Create `src/components/ui/environment.tsx`:
```tsx
import { OS_ICON_PATHS } from "@/lib/tech-icons";

/** Which OSes I work on, and how much — informational, so not clickable. */
const OS = [
  { name: "Windows", label: "Primary · years" },
  { name: "Ubuntu", label: "Daily driver · 1+ year" },
  { name: "macOS", label: "Recent · 3 months" },
] as const;

export function Environment() {
  return (
    <div className="mt-10">
      <h3 className="mb-3 font-mono text-hud uppercase text-faint">Environment</h3>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {OS.map((os) => (
          <li
            key={os.name}
            className="flex items-center gap-3 rounded-lg border border-line bg-panel px-4 py-3 text-muted"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7 shrink-0">
              <path d={OS_ICON_PATHS[os.name]} fill="currentColor" />
            </svg>
            <span className="min-w-0">
              <span className="block font-display text-base font-semibold text-signal-ink">
                {os.name}
              </span>
              <span className="block font-mono text-hud uppercase text-faint">
                {os.label}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Group the wall in `TechStack`**

Replace `src/components/sections/tech-stack.tsx` with:
```tsx
import { Environment } from "@/components/ui/environment";
import { Section } from "@/components/ui/section";
import { TechGrid } from "@/components/ui/tech-grid";
import { getProjectFilters } from "@/lib/content/projects";
import { categoryFor, TECH_CATEGORY_ORDER } from "@/lib/tech-categories";
import { techIcon } from "@/lib/tech-icons";

/**
 * The stack as a clickable map, grouped by category, plus a curated row of the
 * operating systems I work on. Every logo resolves to its brand mark on the
 * server; tapping one filters the project list below.
 */
export function TechStack() {
  const { tech } = getProjectFilters();
  const icons = tech.map(techIcon).filter((icon) => icon.branded);

  const groups = TECH_CATEGORY_ORDER.map((category) => ({
    category,
    icons: icons.filter((icon) => categoryFor(icon.name) === category),
  })).filter((group) => group.icons.length > 0);

  if (groups.length === 0) return null;

  return (
    <Section
      id="stack"
      callsign="Stack"
      title="Tech I build with"
      lede="Every logo here is something I've shipped a real project with. Tap one to see which."
    >
      <div className="flex flex-col gap-8">
        {groups.map((group) => (
          <TechGrid key={group.category} heading={group.category} tech={group.icons} />
        ))}
      </div>
      <Environment />
    </Section>
  );
}
```

- [ ] **Step 4: Verify + visual check + commit**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Then start `npm run dev` and confirm at `/#stack`: five category headings (only non-empty ones), logos under each, and an Environment row with Windows/Ubuntu/macOS + labels; tapping a logo still filters the projects list.
```bash
git add src/components/sections/tech-stack.tsx src/components/ui/tech-grid.tsx src/components/ui/environment.tsx
git commit -m "feat: group tech wall by category + OS environment row"
```

---

### Task 4: Profile image swap

**Files:**
- Move: `public/profile.jpeg` → `public/images/profile.jpg` (overwrites the old photo; `src/lib/site.ts:49` already points at `/images/profile.jpg`).

- [ ] **Step 1: Confirm the source is a valid image**

Run: `file public/profile.jpeg`
Expected: `JPEG image data …`. (Confirmed 200×200 during planning.)

- [ ] **Step 2: Replace the referenced file**

```bash
cp public/profile.jpeg public/images/profile.jpg && rm public/profile.jpeg
```

- [ ] **Step 3: Verify + commit**

Run: `npm run build`
Expected: clean; homepage/`about` still resolves `/images/profile.jpg`.
```bash
git add public/images/profile.jpg
git rm --cached public/profile.jpeg 2>/dev/null || true
git commit -m "chore: update profile photo"
```

---

### Task 5: New extension cards (5)

Create five MDX files in `content/projects/`. Bodies follow the `whatsapp-customizer.mdx` template + the Voice/Facts constraints. Each: `coverImage: ""`.

**Files:** Create `deepl-ultimate.mdx`, `linkedin-downvote.mdx`, `linkedout.mdx`, `youtube-time-manager.mdx`, `x-feed-cleaner.mdx`.

- [ ] **Step 1: `deepl-ultimate.mdx`**

Frontmatter:
```yaml
---
title: "DeepL Ultimate"
slug: "deepl-ultimate"
summary: "Chrome extension that automates DeepL translations and batches large volumes of text into a single pass."
role: "Solo developer — build, Chrome Web Store publishing"
status: "active"
startDate: "2026-01"
endDate: ""
techStack: ["JavaScript", "Chrome Extension APIs"]
interfaces: ["DeepL"]
aiModels: []
liveUrl: ""
githubUrl: ""
linkedinPostUrl: ""
coverImage: ""
featured: false
tags: ["Chrome Extension", "Productivity"]
---
```
Body facts (~120 words): automates DeepL translations and text improvements; batches many translations at once so large volumes go through in a single operation. Published on the Chrome Web Store ("DeepL Pro Unlimited – Long Texts Without Limits"). *Flag in commit: exact store URL unknown; add later.*

- [ ] **Step 2: `linkedin-downvote.mdx`**

Frontmatter (differs: has githubUrl):
```yaml
---
title: "LinkedIn Downvote Engine"
slug: "linkedin-downvote"
summary: "Chrome extension that adds a native downvote button to LinkedIn, letting you grey out or hide posts you don't want in your feed."
role: "Solo developer — build, Chrome Web Store publishing"
status: "active"
startDate: "2025-11"
endDate: ""
techStack: ["JavaScript", "Chrome Extension APIs"]
interfaces: ["LinkedIn"]
aiModels: []
liveUrl: ""
githubUrl: "https://github.com/BaskLash/LinkedIn-Downvote"
linkedinPostUrl: ""
coverImage: ""
featured: false
tags: ["Chrome Extension", "Productivity"]
---
```
Body facts: injects a downvote button into LinkedIn's async-loading feed; downvoted posts greyed out or hidden in real time per local preference; uses `MutationObserver` so buttons appear through infinite scroll; serverless, settings persisted locally via Chrome Storage; open-source. 10+ weekly users. Link to the GitHub repo.

- [ ] **Step 3: `linkedout.mdx`**

```yaml
---
title: "LinkedOut"
slug: "linkedout"
summary: "Chromium extension that strips LinkedIn down to the essentials — no feed, no recommendations, no notification dots — for distraction-free use."
role: "Solo developer — build, Chrome Web Store publishing"
status: "active"
startDate: "2024-09"
endDate: ""
techStack: ["JavaScript", "Chrome Extension APIs"]
interfaces: ["LinkedIn"]
aiModels: []
liveUrl: "https://linkedin-distraction-blocker.carrd.co/"
githubUrl: "https://github.com/BaskLash/LinkedOut"
linkedinPostUrl: ""
coverImage: ""
featured: false
tags: ["Chrome Extension", "Productivity"]
---
```
Body facts: removes the home feed, network recommendations and notification red-dot polling; intercepts attempts to open distracting pages by URL and redirects; deliberate no-toggle design — runs in the background with no popup, keeping it lightweight; fully local, no telemetry. 40+ weekly users. Links to the carrd landing page + GitHub.

- [ ] **Step 4: `youtube-time-manager.mdx`**

```yaml
---
title: "YouTube Time Manager"
slug: "youtube-time-manager"
summary: "Open-source Chrome extension that tracks and categorises your time on YouTube, all stored locally."
role: "Solo developer — build, Chrome Web Store publishing"
status: "active"
startDate: "2024-09"
endDate: ""
techStack: ["JavaScript", "Chrome Extension APIs"]
interfaces: ["YouTube"]
aiModels: []
liveUrl: ""
githubUrl: "https://github.com/BaskLash/YouTube-Time-Manager"
linkedinPostUrl: ""
coverImage: ""
featured: false
tags: ["Chrome Extension", "Productivity"]
---
```
Body facts: background scripts track time per video and channel, accounting for tab switches and pauses; group channels into categories (Education, Productivity, Entertainment) and aggregate on the fly; local dashboard of daily/weekly stats and category breakdowns; Manifest V3; local-first via Chrome Storage/IndexedDB; open-source. 20+ weekly users. Link the GitHub repo.

- [ ] **Step 5: `x-feed-cleaner.mdx`**

```yaml
---
title: "X Feed Cleaner"
slug: "x-feed-cleaner"
summary: "Lightweight extension that hides the algorithmic feed, trends and live content on X.com to stop doom-scrolling. 200+ weekly users."
role: "Solo developer — build, Chrome Web Store publishing"
status: "active"
startDate: "2024-09"
endDate: ""
techStack: ["JavaScript", "Chrome Extension APIs"]
interfaces: ["X (Twitter)"]
aiModels: []
liveUrl: "https://x-feed-cleaner.carrd.co/"
githubUrl: "https://github.com/BaskLash/X-Feed-Cleaner"
linkedinPostUrl: ""
coverImage: ""
featured: false
tags: ["Chrome Extension", "Productivity"]
---
```
Body facts: `MutationObserver`-driven DOM hiding of timeline, trends and live content, holding up through infinite scroll and live updates; pure vanilla JavaScript for a minimal memory footprint; popup with per-filter toggles persisted via Chrome Storage; privacy-first — ad-free, local, zero-tracking; open-source. 200+ weekly users. Links to carrd + GitHub + the "X (Twitter) Cleaner" store listing.

- [ ] **Step 6: Verify + commit**

Run: `npm run build` (loader validates all five) then `npm run lint`.
Expected: build lists 24 projects, no throw.
```bash
git add content/projects/deepl-ultimate.mdx content/projects/linkedin-downvote.mdx content/projects/linkedout.mdx content/projects/youtube-time-manager.mdx content/projects/x-feed-cleaner.mdx
git commit -m "feat: add five browser-extension project cards"
```

---

### Task 6: New app/tool cards (3)

**Files:** Create `clipvault.mdx`, `prio.mdx`, `hangyman.mdx`.

- [ ] **Step 1: `clipvault.mdx`**

```yaml
---
title: "ClipVault"
slug: "clipvault"
summary: "Native clipboard manager for Linux, built in Rust and Tauri — captures text, links, colours and images locally and stays out of the way at ~10–20 MB idle."
role: "Solo developer — systems architecture, Rust core, React UI"
status: "active"
startDate: "2026-07"
endDate: ""
techStack: ["Rust", "Tauri", "React", "TypeScript", "SQLite", "Vite", "Tailwind CSS"]
interfaces: ["X11 / XFIXES"]
aiModels: []
liveUrl: ""
githubUrl: ""
linkedinPostUrl: ""
coverImage: ""
featured: false
tags: ["Desktop", "Rust", "Linux", "Open Source"]
---
```
Body facts (~150 words, one `## How it works`): event-based X11 clipboard monitoring (XFIXES over thread channels), auto-reconstructs on X server restart and suppresses self-copy loops; SQLite persistence in WAL mode with SHA-256 content hashing for real-time dedup, WebP thumbnails for images, timezone-grouped history; typed IPC between the Rust core and a React 19 frontend, with system tray, global hotkey (Ctrl+Alt+V), autostart daemon and single-instance guard; keyboard-first dark dashboard using `@tanstack/react-virtual` for huge histories; ~10–20 MB idle RAM, 0% idle CPU. *Flag: `active` vs finished one-month build — confirm with Olivier.*

- [ ] **Step 2: `prio.mdx`**

```yaml
---
title: "Prio"
slug: "prio"
summary: "Encrypted priority and time-tracking web app — create tasks, log time against them, and write rich notes, all end-to-end encrypted."
role: "Solo developer — full build"
status: "archived"
startDate: "2023-02"
endDate: "2025-03"
techStack: ["PHP", "MySQL"]
interfaces: []
aiModels: []
liveUrl: ""
githubUrl: ""
linkedinPostUrl: ""
coverImage: ""
featured: false
tags: ["Web", "Productivity"]
---
```
Body facts: PHP + MySQL web app; create tasks, log time against each one and see it roll up to a total; rich notes via CKEditor; hashed logins and encrypted data throughout.

- [ ] **Step 3: `hangyman.mdx`**

```yaml
---
title: "Hangyman"
slug: "hangyman"
summary: "A Discord bot that turns the classic Hangman word game into a multiplayer experience on a server. Built during my apprenticeship."
role: "Solo developer — creator & backend"
status: "archived"
startDate: "2022-01"
endDate: "2022-01"
techStack: ["Python", "discord.py"]
interfaces: ["Discord"]
aiModels: []
liveUrl: ""
githubUrl: ""
linkedinPostUrl: ""
coverImage: ""
featured: false
tags: ["Bot", "Games"]
---
```
Body facts: full game logic in Python (letter-by-letter input, error scoring, word lists, win/loss); refactored a local CLI script into an event-driven `discord.py` bot; async handling for several players at once; self-directed debugging of state-transition and invalid-input edge cases. Built on my own initiative during my apprenticeship.

- [ ] **Step 4: Verify + commit**

Run: `npm run build && npm run lint`
```bash
git add content/projects/clipvault.mdx content/projects/prio.mdx content/projects/hangyman.mdx
git commit -m "feat: add ClipVault, Prio and Hangyman project cards"
```

---

### Task 7: Security-audit cards (2)

**Files:** Create `febel-security-audit.mdx`, `wordpress-security-audit.mdx`. Framed as **authorised** white-hat work.

- [ ] **Step 1: `febel-security-audit.mdx`**

```yaml
---
title: "Web Security Audit — febel.ch"
slug: "febel-security-audit"
summary: "An authorised white-hat audit of febel.ch's comment and form endpoints — found a reCAPTCHA v3 bypass and a DoS vector, then helped harden them."
role: "White-hat penetration tester"
status: "archived"
startDate: "2025-12"
endDate: "2025-12"
techStack: ["JavaScript", "Tampermonkey", "PHP", "Chromedriver"]
interfaces: []
aiModels: []
liveUrl: ""
githubUrl: ""
linkedinPostUrl: ""
coverImage: ""
featured: false
tags: ["Security", "Pentest"]
---
```
Body facts: authorised audit of febel.ch's comment/form interfaces. Analysed client/server traffic and reverse-engineered the flow between `getcomments.js` and the `save.php` endpoint. Proved incomplete server-side validation of the Google reCAPTCHA v3 token and demonstrated it with a Tampermonkey script simulating bot spam. Used Chrome for Testing (Chromedriver) to probe rate limits, and showed a denial-of-service vector via payload injection into the file-based `data.json` store. Documented everything and helped implement the fixes: secret-key verification, input sanitisation and hardened storage.

- [ ] **Step 2: `wordpress-security-audit.mdx`**

```yaml
---
title: "WordPress Security Audit"
slug: "wordpress-security-audit"
summary: "A full authorised vulnerability assessment of a live WordPress site — identified critical third-party plugin flaws and verified the fixes afterwards."
role: "White-hat security auditor"
status: "archived"
startDate: "2025-03"
endDate: "2025-03"
techStack: ["Kali Linux", "WPScan"]
interfaces: []
aiModels: []
liveUrl: ""
githubUrl: ""
linkedinPostUrl: ""
coverImage: ""
featured: false
tags: ["Security", "Pentest"]
---
```
Body facts: authorised vulnerability assessment of a production WordPress site. Reconnaissance with Kali Linux and WPScan/enumeration to find outdated core and plugin components; analysed and verified known CVEs, including a potential remote code execution and an admin authentication bypass; delivered a detailed report with risk ratings and remediation guidance; ran a re-audit after patching to confirm the hardened state.

- [ ] **Step 3: Verify + commit**

Run: `npm run build && npm run lint`
```bash
git add content/projects/febel-security-audit.mdx content/projects/wordpress-security-audit.mdx
git commit -m "feat: add two white-hat security-audit cards"
```

---

### Task 8: Media cards (2)

**Files:** Create `drone-commercial.mdx`, `green-owl-video.mdx`. Empty `techStack` — same card shape as `swissquad`.

- [ ] **Step 1: `drone-commercial.mdx`**

```yaml
---
title: "Drone Commercial Video"
slug: "drone-commercial"
summary: "A commercial video shoot — flying and editing the footage myself."
role: "Creator — filming & edit"
status: "archived"
startDate: "2023-08"
endDate: "2023-08"
techStack: []
interfaces: []
aiModels: []
liveUrl: ""
githubUrl: ""
linkedinPostUrl: ""
coverImage: ""
featured: false
tags: ["Media", "FPV"]
---
```
Body: 1–2 honest sentences only. *Flag in commit: the LinkedIn entry's description line reads "Online Shop für Trikots" under a drone-video title — Olivier to clarify what this project actually is; keep body minimal until then.*

- [ ] **Step 2: `green-owl-video.mdx`**

```yaml
---
title: "Green Owl Animated Video"
slug: "green-owl-video"
summary: "A fancy animated YouTube video produced for the Green Owl channel."
role: "Creator — animation"
status: "archived"
startDate: "2022-06"
endDate: "2022-06"
techStack: []
interfaces: []
aiModels: []
liveUrl: ""
githubUrl: ""
linkedinPostUrl: ""
coverImage: ""
featured: false
tags: ["Media", "Animation"]
---
```
Body: 1–2 sentences — commissioned a fancy-looking animated YouTube video for the Green Owl channel.

- [ ] **Step 3: Verify + commit**

Run: `npm run build && npm run lint`
```bash
git add content/projects/drone-commercial.mdx content/projects/green-owl-video.mdx
git commit -m "feat: add two media project cards"
```

---

### Task 9: Enrich existing cards (12)

Add links + light detail; **keep each file's current title/slug/dates** except where noted. Edit frontmatter only where a value is listed; otherwise add one or two sentences of body detail in the existing voice.

**Files (modify):** `promptin.mdx`, `whatsapp-customizer.mdx`, `tunevote.mdx`, `trip-xchange.mdx`, `flickclean.mdx`, `sentinel.mdx`, `grammar-mentor.mdx`, `knowledge-synthesizer.mdx`, `document-intelligence.mdx`, `keplers-horizon.mdx`, `id-scanner.mdx`, `swissquad.mdx`.

- [ ] **Step 1: Frontmatter link additions**

- `promptin.mdx`: set `liveUrl: "https://prompt-in.com"` (currently `""`); set `githubUrl: "https://github.com/BaskLash/PromptIn"`.
- `whatsapp-customizer.mdx`: set `githubUrl: "https://github.com/BaskLash/WhatsApp-Web-Customizer"`.

- [ ] **Step 2: Body detail additions (facts only, in-voice)**

- `promptin.mdx`: note the 5/5 Chrome Web Store rating; link prompt-in.com.
- `tunevote.mdx`: mention it's open-source with a Discord community; ~30 active users.
- `trip-xchange.mdx`: co-founder / product-owner framing; ~40 active users; validated demand with a short Google Ads test.
- `flickclean.mdx`: ~30,000 users; link the App Store listing.
- `sentinel.mdx`: awarded MVP of the whole event (out of hundreds of participants); challenge run with Tenity.
- `grammar-mentor.mdx`: ~20 active users. *Flag: LinkedIn dates (Feb–Apr 2026) differ from the site's 2025-09 — left as-is pending Olivier.*
- `knowledge-synthesizer.mdx`: this is the **Finetic** build for the Arch/Re challenge at SwissHacks 2025.
- `document-intelligence.mdx`: this is **Catalyst**, the SwissHacks 2024 Double Winner (Unique/Microsoft challenge + overall).
- `keplers-horizon.mdx`: also presented as **CosmicClassroom / Chronicles of Exoplanet Exploration** — tailored lesson plans and NASA-backed resources for underserved classrooms.
- `id-scanner.mdx`: reconcile the hackathon name to **Young Talents Hackathon 2024 (xappido AG / UMB)**; keep the "2nd place" if accurate. *Flag: site previously said "HSLU hackathon" — confirm which name is correct.*
- `swissquad.mdx`: light enrichment only. *Flag: LinkedIn dates (Jul 2023 – Oct 2024) differ from the site's 2024-01 – 2025-12 — left as-is pending Olivier.*

- [ ] **Step 3: Verify + commit**

Run: `npm run build && npm run lint`
```bash
git add content/projects/promptin.mdx content/projects/whatsapp-customizer.mdx content/projects/tunevote.mdx content/projects/trip-xchange.mdx content/projects/flickclean.mdx content/projects/sentinel.mdx content/projects/grammar-mentor.mdx content/projects/knowledge-synthesizer.mdx content/projects/document-intelligence.mdx content/projects/keplers-horizon.mdx content/projects/id-scanner.mdx content/projects/swissquad.mdx
git commit -m "feat: enrich existing project cards with LinkedIn detail and links"
```

---

### Task 10: Full-site verification

- [ ] **Step 1: Clean build + lint + types**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all clean; build reports 31 projects (19 existing + 12 new).

- [ ] **Step 2: Visual smoke test**

Start `npm run dev` and check:
- Homepage `#stack`: five category headings (non-empty only), OS Environment row with three labelled entries; tapping a logo filters the projects list.
- `#projects`: all new cards render with the logo/monogram fallback (no broken images); new tech appears in the filter chips.
- A new card's detail page (e.g. `/projects/linkedout`): the live-preview fallback shows the logo/monogram, not a broken image.
- Profile photo shows the new image.

- [ ] **Step 3: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: verification adjustments for project sync"
```

---

## Notes for the implementer

- **Logo files** (`public/images/favicons/<slug>.png`) are supplied by Olivier later; until then every new card shows its monogram. Filenames must exactly match each `slug` above.
- **Open questions** (§9 of the spec) are surfaced as *Flag in commit* notes on the relevant tasks. Implement the proposed default and note the flag; do not block.
- Do not touch the 7 site-only projects (AutoCropper, Blackbox Lab, DroneLog, EasyFormsPaste, FitPub, Kassenwart, PolicyFlow) or the hackathons/maker/sports/community sections.
