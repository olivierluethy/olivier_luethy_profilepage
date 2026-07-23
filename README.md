# Portfolio site

A personal portfolio built with Next.js (App Router), TypeScript, Tailwind CSS
v4, Framer Motion and MDX. Projects and blog posts are plain MDX files in
`/content` — adding one is a matter of dropping in a file.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build; also validates all content frontmatter
npm run lint
```

---

## First: replace the placeholders

Everything meant to be edited is wrapped in `[[double brackets]]`. To find all
of them:

```bash
grep -rn "\[\[" src content
```

The ones that matter most:

| What | Where |
| --- | --- |
| Name, tagline, description, email, job title, location | `src/lib/site.ts` |
| **Site URL** — canonical tags, sitemap and OG images all depend on it | `src/lib/site.ts` (`site.url`) |
| GitHub and LinkedIn URLs | `src/lib/site.ts` (`socials`) |
| The three hero stats | `src/lib/site.ts` (`heroStats`) |
| Experience and education timeline | `src/lib/data/timeline.ts` |
| Hackathons (`won: true` shows the winner badge) | `src/lib/data/hackathons.ts` |
| FPV / 3D-printing builds | `src/lib/data/maker.ts` |
| Race results and the Strava embed slot | `src/lib/data/sports.ts` |
| Volunteering | `src/lib/data/community.ts` |

**`site.url` is still `https://example.com`.** Set it to the real domain before
deploying, or every canonical URL, sitemap entry and Open Graph image URL will
point at the wrong host.

### Files to overwrite

These are real placeholder files, so nothing renders broken before you swap
them. Keep the paths and replace the contents:

- `public/resume.pdf` — your CV, linked from the hero's Resume button
- `public/images/profile.jpg` — your photo
- `public/images/projects/*`, `public/images/blog/*`, `public/images/hackathons/*`,
  `public/images/maker/*`, `public/images/sports/*` — every placeholder is
  labelled with its purpose and pixel size

---

## Adding a project

Create `content/projects/your-slug.mdx`. The build fails with a message naming
the file and the field if anything is missing, so a typo cannot ship silently.

```mdx
---
title: "Project name"
slug: "your-slug"              # must match the filename and be URL-safe
summary: "One line. Shown on cards and used as the meta description."
role: "What you actually did"
status: "active"               # active | archived
startDate: "2026-04"           # YYYY-MM
endDate: ""                    # empty = ongoing
techStack: ["Swift", "SwiftUI"]
interfaces: ["RevenueCat"]     # third-party services and APIs
aiModels: []                   # AI APIs used, if any
liveUrl: "https://..."         # optional
githubUrl: "https://..."       # optional
linkedinPostUrl: ""            # optional
coverImage: "/images/projects/your-cover.png"
featured: true                 # true puts it in the Featured section
tags: ["iOS", "Monetization"]
---

Your write-up. Everything renders inline — nothing hides behind a click.
```

That is all. The project automatically appears on the homepage, in the
filterable list and in the sitemap, and gets its own page, OG image and
`SoftwareApplication` structured data.

## Adding a blog post

Create `content/blog/your-slug.mdx`:

```mdx
---
title: "Post title"
slug: "your-slug"
date: "2026-06-12"                          # YYYY-MM-DD
summary: "One line, used as the meta description."
coverImage: "/images/blog/your-cover.png"   # optional
tags: ["Monetization"]
relatedProjects: ["flickclean"]             # slugs, rendered as linked cards
---
```

`relatedProjects` silently skips slugs that do not exist, so renaming a project
cannot break an old post.

---

## Writing in MDX

Standard Markdown and GitHub-flavoured tables all work. Beyond that:

**Images.** Write plain Markdown — dimensions are measured from `/public` at
build time, so there is no layout shift and nothing to specify. The title
becomes a caption, and images are click-to-zoom.

```md
![Descriptive alt text](/images/projects/shot.png "Optional caption")
```

**Code.** Fenced blocks are syntax-highlighted in both themes. Optional
`showLineNumbers`, a `title`, and line highlighting:

````md
```ts showLineNumbers title="worker.ts" {3-4}
const x = 1;
```
````

**Diagrams.** `<Diagram />` is available without importing anything:

```mdx
<Diagram src="/images/architecture.drawio.svg" alt="Describe the diagram" caption="Architecture" />
```

An exported `.svg` or `.png` is preferred — it needs no third party and stays
crisp. A raw `.drawio` / `.xml` file is embedded through the diagrams.net
viewer instead, which fetches the file over the network and therefore needs
`site.url` set to the deployed origin (it will not resolve on localhost).

**3D models.** Export from Fusion 360 as `.glb` or `.gltf` into `public/models`
and point a `maker.ts` entry at it with `model: "/models/your-part.glb"`. The
viewer bundle only downloads once that section nears the viewport, and falls
back to the photo if it fails.

---

## The contact form

`src/app/contact/page.tsx` has no form and no backend by design. Paste the
EasyContactForms embed into the marked container:

```tsx
<section aria-label="Contact form" className="...">
  {/* EasyContactForms embed goes here — external form will be pasted in later */}
</section>
```

The `mailto:` link above it works in the meantime.

## Strava / DataSport stats

Paste the provider's embed snippet into `sportsProfile.embedHtml` in
`src/lib/data/sports.ts`. While it is an empty string the placeholder image is
shown instead.

---

## How it is put together

```
content/                 MDX — the only place you add projects and posts
src/app/                 Routes, sitemap.ts, robots.ts, opengraph-image.tsx
src/components/          UI, one component per file
  mdx/                   MDX renderer and its element map
  sections/              The homepage sections
  ui/                    Reusable pieces (cards, badges, buttons, reveal)
src/lib/
  content/               Typed loaders + frontmatter validation
  data/                  Hand-edited content for the non-MDX sections
  site.ts                Central configuration
  sections.ts            Homepage sections — drives the jump nav and scroll-spy
```

A few decisions worth knowing before changing things:

- **Design tokens live in `src/app/globals.css`.** Both themes are designed,
  not inverted. `signal` is for graphic use and `signal-ink` is the same accent
  tuned to clear AA as small text — use `signal-ink` for anything readable.
  `muted` and `faint` are pinned at the lightest values that still hit 4.5:1 on
  both the ground and panel colours; lightening them breaks contrast.
- **Adding a homepage section** means adding it to `src/lib/sections.ts` and
  rendering it in `src/app/page.tsx`. The jump nav and scroll-spy pick it up
  from that list automatically.
- **The theme follows the visitor's OS preference.** To force dark for
  everyone, change `defaultTheme` in `src/app/layout.tsx`.
- **Above-the-fold content is never wrapped in `<Reveal>`.** It is the LCP
  content and must paint from the server HTML rather than waiting for
  JavaScript. Use `<Reveal>` below the fold, where it belongs.
- **Reduced motion is respected throughout**, including forcing reveal wrappers
  visible in CSS, so a reduced-motion visitor never depends on hydration to see
  content.

## Deploying

Any host that runs Next.js works; the site is fully static apart from image
optimisation. Set `site.url` first.

Note that the live-preview embed on project pages probes each `liveUrl` for
`X-Frame-Options` and CSP `frame-ancestors` **at build time**. A build without
network access simply falls back to the cover image and a "Try it" button,
which is the safe outcome rather than an error.
