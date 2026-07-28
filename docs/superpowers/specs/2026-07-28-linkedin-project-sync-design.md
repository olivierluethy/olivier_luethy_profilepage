# LinkedIn Project Sync + Tech-Wall Restructure — Design

**Date:** 2026-07-28
**Author:** Olivier Luethy (with Claude)
**Status:** Draft for review

## 1. Goal

Bring the portfolio's project set into line with Olivier's full LinkedIn project
list, and make the "Tech I build with" section communicate *what kind* of tool
each technology is (language vs. framework vs. package manager vs. database vs.
tool) plus which operating systems he works on and how much.

Three outcomes:

1. Every project on LinkedIn is represented on the site — enriched where it
   already exists, added where it's missing.
2. New projects are unblocked from needing hand-made cover banners: a square
   logo (or nothing) is enough for a complete-looking card.
3. The tech wall is grouped into categories, with a curated OS/Environment row.

## 2. Decisions locked in review

| Question | Decision |
| --- | --- |
| Security audits (febel.ch, WordPress) as cards? | **Yes** |
| Two video projects as cards? | **Yes** |
| What are the uploaded logos? | Small **title-slot icons** → `public/images/favicons/<slug>.png` |
| Tech-wall grouping | **5 buckets**: Languages · Frameworks & Libraries · Package Managers · Databases · Tools & Platforms, + separate OS row |
| OS display | **Three logos with experience labels** |
| Covers for the 12 new cards | **Logo-fallback** (no hand-made banners required) |
| ID-Scanner vs Young Talents/xappido | **Same project** — enrich the one existing card |
| Voice for new/enriched copy | **Rewrite** into the site's understated first-person English, not the LinkedIn buzzword copy |

## 3. Voice & fidelity rules

- New and enriched write-ups match the existing MDX bodies: first-person,
  plain, understated. No "End-to-End", "Data-Driven Product Market Fit",
  "Key Achievements" headings.
- **Only facts stated in the LinkedIn source** get asserted: user counts,
  awards, tech stacks, platforms, dates, links. Nothing invented.
- Anything ambiguous is listed in §9 (Open questions) for Olivier to resolve,
  not guessed.

## 4. Workstream A — Cover images become optional (code)

**Problem:** `parseProject` requires `coverImage` (`src/lib/content/projects.ts:57`)
and both card variants render `<Image src={frontmatter.coverImage}>`
(`src/components/ui/project-card.tsx:37,92`). New projects have no banner.

**Change:**

1. `src/lib/content/types.ts` — `coverImage` stays a `string` but may be `""`.
2. `src/lib/content/projects.ts` — replace `requireString(fm, "coverImage", …)`
   with `optionalString`. All 19 existing projects keep their covers, so no
   regression.
3. `src/components/ui/project-card.tsx` — extract the media block into a small
   `CoverMedia` helper with a 2-level fallback:
   - `coverImage` set → `<Image src={coverImage}>` (today's behaviour).
   - else `favicon` set → the logo centered on a branded tinted panel
     (`bg-panel`, subtle signal-tinted gradient, logo at ~40% width).
   - else → a generated **monogram** panel: the project's initials in the
     display font on the same tinted panel.
   Applies to both `featured` and `compact` variants (compact uses the smaller
   `sm:w-44` frame).

**Result:** the site builds and every card looks intentional with zero uploaded
assets; each card sharpens as Olivier drops a logo into `favicons/`.

## 5. Workstream B — Tech wall categories + Environment row (code)

**New file `src/lib/tech-categories.ts`:** maps a tech name (exact frontmatter
string) → one category. Categories, in display order:

1. `Languages`
2. `Frameworks & Libraries`
3. `Package Managers`
4. `Databases`
5. `Tools & Platforms`

Proposed assignments (extend as new projects introduce tech):

- **Languages:** Python, TypeScript, JavaScript, Rust, PHP, Swift, Java (Java 21), C# via `.NET` handled under Frameworks
- **Frameworks & Libraries:** Next.js, React, Svelte, SvelteKit, Angular, Flutter, FastAPI, Quarkus, .NET / ASP.NET Core 8 / Entity Framework Core, SwiftUI, Ionic, Xamarin, Tailwind CSS, Framer Motion, Socket.io, OpenCV, WebAssembly, ActivityPub, discord.py, Tauri
- **Package Managers:** pnpm (pnpm monorepo), npm
- **Databases:** PostgreSQL, SQLite, MySQL, Prisma (ORM — grouped here), Knex, Flyway
- **Tools & Platforms:** Docker, Vercel, Vite, Git, Chrome Extension APIs, Canvas API, Zod, Webpack, Tampermonkey, Chromedriver, Kali Linux, WPScan

Anything unmapped defaults to `Tools & Platforms` (safe catch-all).

**`src/components/sections/tech-stack.tsx`:** instead of one flat
`icons` array, group the branded icons by category (preserving the category
order above; skip empty categories) and pass grouped data to the grid.

**`src/components/ui/tech-grid.tsx`:** render one labelled block per category
(small mono uppercase heading like the section callsigns), each block a grid of
the existing logo buttons. Click behaviour (`select-tech` event) is unchanged.

**Environment row (new, curated — not derived from projects):**

- New `src/components/ui/environment.tsx` (or a block inside `TechStack`).
- Data: three entries with logo + label:
  - **Windows** — "Primary · years"
  - **Ubuntu / Linux** — "Daily driver · 1+ year"
  - **macOS** — "Recent · 3 months"
- Rendered below the categorised wall under an `Environment` sub-heading, so a
  visitor asking "Windows, Mac or Linux?" gets an immediate answer.
- **Icon caveat:** `simple-icons` v16 has dropped Windows and Apple marks for
  trademark reasons. `siUbuntu` (or `siLinux`) is present. For Windows and
  macOS, add hand-authored SVG `d` paths as constants in `tech-icons.ts` and
  resolve them through the existing `TechIcon` shape (same fallback pattern the
  wall already uses). These are **not** clickable project filters — the OS row
  is informational only.

## 6. Workstream C — Profile image

Site reads `profileImage: "/images/profile.jpg"` (`src/lib/site.ts:49`).
Olivier's replacement (`profile.jpeg`) is **not currently in the repo** (working
tree clean; only the old `public/images/profile.jpg` exists). Pending action:

- Olivier re-adds the new photo.
- We place/rename it to `public/images/profile.jpg` (overwriting the old 14 KB
  file) so no code change is needed. Verify it's a valid image first.

If he'd rather keep the `.jpeg` name, update `site.ts:49` instead. Default:
overwrite `profile.jpg`.

## 7. Workstream D — New project cards (12)

Each new file lives at `content/projects/<slug>.mdx`, logo at
`public/images/favicons/<slug>.png`, `coverImage: ""` (uses fallback).
`github` username is **BaskLash**.

**Status rule:** still-installable/live product → `active`, `endDate: ""`.
One-off event / offline / finished engagement → `archived` with the end month.
Statuses below are proposals; Olivier confirms in §9.

| slug | title | dates (start→end) | status | role | key links | tech |
| --- | --- | --- | --- | --- | --- | --- |
| `clipvault` | ClipVault | 2026-07 → "" | active | Solo — systems & full-stack | repo "ClipVault" (no URL yet) | Rust, Tauri, React, TypeScript, SQLite, Vite, Tailwind CSS |
| `deepl-ultimate` | DeepL Ultimate | 2026-01 → "" | active | Solo — build, publishing | Chrome Web Store | JavaScript, Chrome Extension APIs |
| `linkedin-downvote` | LinkedIn Downvote Engine | 2025-11 → "" | active | Solo — build, publishing | github.com/BaskLash/LinkedIn-Downvote | JavaScript, Chrome Extension APIs |
| `linkedout` | LinkedOut | 2024-09 → "" | active | Solo — build, publishing | linkedin-distraction-blocker.carrd.co · github.com/BaskLash/LinkedOut | JavaScript, Chrome Extension APIs |
| `youtube-time-manager` | YouTube Time Manager | 2024-09 → "" | active | Solo — build, publishing | Chrome Web Store · github.com/BaskLash/YouTube-Time-Manager | JavaScript, Chrome Extension APIs |
| `x-feed-cleaner` | X Feed Cleaner | 2024-09 → "" | active | Solo — build, publishing | x-feed-cleaner.carrd.co · github.com/BaskLash/X-Feed-Cleaner | JavaScript, Chrome Extension APIs |
| `prio` | Prio | 2023-02 → 2025-03 | archived | Solo — full build | — | PHP, MySQL |
| `hangyman` | Hangyman | 2022-01 → 2022-01 | archived | Solo — creator & backend | — | Python, discord.py |
| `febel-security-audit` | Web Security Audit — febel.ch | 2025-12 → 2025-12 | archived | White-hat pentester | febel.ch (client) | JavaScript/Tampermonkey, PHP, Chromedriver |
| `wordpress-security-audit` | WordPress Security Audit | 2025-03 → 2025-03 | archived | White-hat auditor | — | Kali Linux, WPScan |
| `drone-commercial` | Drone Commercial Video | 2023-08 → 2023-08 | archived | Creator — video | — (media) | — |
| `green-owl-video` | Green Owl Animated Video | 2022-06 → 2022-06 | archived | Creator — animation | — (media) | — |

**Card-fit notes:**

- Security audits + videos have empty/near-empty `techStack`, so their cards
  show no tech badges — same shape as the existing `swissquad` non-code card.
- Videos: `liveUrl` = the YouTube link if available; write-ups are short.
- `tags` chosen from the existing vocabulary where possible (e.g. `Chrome
  Extension`, `Productivity`, `Security`, `Hackathon`, `Media`).

## 8. Workstream E — Enrich existing cards (12)

Add links + any missing LinkedIn detail; **keep the current site title/slug**.

| slug | add |
| --- | --- |
| `promptin` | `liveUrl: https://prompt-in.com` (currently empty), `githubUrl: …/PromptIn`, note 5/5 rating |
| `whatsapp-customizer` | `githubUrl: …/WhatsApp-Web-Customizer`, Chrome Store note |
| `tunevote` | Discord community + GitHub note (no repo URL given), 30+ users |
| `trip-xchange` | role → co-founder/product-owner nuance, 40+ users, Google Ads validation |
| `flickclean` | App Store link, ~30k users |
| `sentinel` | MVP-of-event award, connected to Tenity |
| `grammar-mentor` | 20+ users (see date discrepancy §9) |
| `swissquad` | already archived w/ `formerUrl`; light enrichment only (see date discrepancy §9) |
| `knowledge-synthesizer` | = **Finetic**, Arch/Re challenge, SwissHacks 2025 detail |
| `document-intelligence` | = **Catalyst**, SwissHacks 2024 Double Winner detail |
| `keplers-horizon` | = **CosmicClassroom / Chronicles of Exoplanet Exploration** detail |
| `id-scanner` | = **Young Talents Hackathon 2024 (xappido AG)**; reconcile hackathon name (§9) |

## 9. Open questions (Olivier to resolve — non-blocking, flagged inline)

1. **Extension status:** are LinkedOut, X Feed Cleaner, YouTube Time Manager,
   LinkedIn Downvote, DeepL Ultimate still live on their stores? If yes →
   `active`/ongoing as proposed; if taken down → `archived` with the LinkedIn
   end date.
2. **ClipVault status:** personal tool you still use (`active`) or a finished
   one-month build (`archived`, end 2026-07)?
3. **ID-Scanner hackathon name:** site says "HSLU hackathon, 2nd place";
   LinkedIn says "Young Talents Hackathon 2024 (xappido/UMB)". Which is
   correct? (One card either way.)
4. **grammar-mentor dates:** site `2025-09`; LinkedIn `Feb–Apr 2026`. Keep or
   correct?
5. **swissquad dates:** site `2024-01 → 2025-12`; LinkedIn `Jul 2023 → Oct
   2024`. Keep or correct?
6. **Drone Commercial Video:** LinkedIn description line reads "Online Shop für
   Trikots" under a drone-video title — which is it, or are these two things?
7. **Missing repo/store URLs:** several entries reference a GitHub repo or store
   listing without the exact URL. Confirm exact URLs, or leave the link off.
8. **Logo files:** all `favicons/<slug>.png` still to be uploaded; cards use the
   monogram fallback until then.

## 10. Out of scope

- No redesign of card layout beyond the cover fallback.
- No changes to hackathons/maker/sports/community sections (separate TS data).
- The 7 site-only projects with no LinkedIn entry (AutoCropper, Blackbox Lab,
  DroneLog, EasyFormsPaste, FitPub, Kassenwart, PolicyFlow) are left untouched.
- No new `featured` flags; featured set is unchanged.

## 11. Implementation order

1. Workstream A (cover fallback) — unblocks everything visually.
2. Workstream B (tech categories + OS row).
3. Workstream C (profile image) — when the file is re-supplied.
4. Workstream D (new cards) — content.
5. Workstream E (enrich existing) — content.
6. Verify: `next build` / lint clean, every card renders, tech groups + OS row
   display, no broken image requests.
