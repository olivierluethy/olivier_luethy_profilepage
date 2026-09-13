# Bot-safe contact — design

**Date:** 2026-09-13
**Status:** Approved

## Problem

The email address `olivier.luethy@gmx.net` is exposed in plaintext across the
site (contact page, footer, closing CTA) and — most damagingly — as a
machine-readable field in the homepage JSON-LD (`schema.ts`). Scrapers harvest
these and send automated/spam mail. The goal: real people (recruiters) can
reach the owner easily, while conventional bots cannot read the address or
trivially auto-send mail.

## Approach (chosen)

Contact form as the primary channel, with the address removed from all HTML and
structured data. A click-to-reveal direct email remains as a secondary channel.

- **Spam protection:** Cloudflare Turnstile (invisible, privacy-friendly CAPTCHA
  — the modern reCAPTCHA replacement) verified server-side, plus a honeypot
  field and server-side input validation.
- **Delivery:** Resend, sending from `contact@olivierluethy.com` (owner-verified
  domain) to the owner's real inbox, with `reply-to` set to the sender so
  replies go straight back to the recruiter.
- **Hosting:** Vercel (Next.js Route Handler runs as a serverless function;
  secrets via Vercel env vars).

## Components

### 1. Contact form — `src/components/ui/contact-form.tsx` (client)
- Fields: name, email (sender's), message; accessible labels, required.
- Honeypot: a visually-hidden, `aria-hidden`, `tabindex=-1`, `autocomplete=off`
  field (e.g. `company`). Any value → treated as bot, silently accepted.
- Turnstile: script loaded, widget rendered explicitly; token held in state.
- Submits JSON to `/api/contact`; shows submitting / success / error states;
  disables submit while pending. Styled in the site's OSD/HUD language.

### 2. API route — `src/app/api/contact/route.ts` (POST, Node runtime)
- Parse + validate: name (1–100), email (format + ≤254), message (1–5000).
- Honeypot filled → return `{ ok: true }` without sending (bot trap).
- Verify Turnstile token via `https://challenges.cloudflare.com/turnstile/v0/siteverify`
  with the secret key and the client IP.
- Send via Resend: `from` = `CONTACT_FROM_EMAIL`, `to` = `CONTACT_TO_EMAIL`,
  `replyTo` = sender email, subject/body from input. Inputs used only as
  structured fields / body text (no CRLF header injection).
- Responses are status + generic JSON only; the address never appears in any
  response or client bundle.
- Validation/honeypot logic factored into a pure, testable helper.

### 3. Reveal email — `src/components/ui/reveal-email.tsx` (client)
- "Show email" button assembles `user@domain` from split parts **on click**;
  then offers copy + a click-time `mailto:`. Nothing scrapable in initial HTML.

### 4. Removals / rewiring
- `site.ts`: drop `email`; add `emailUser` + `emailDomain` (split, used only by
  the reveal component).
- `contact/page.tsx`: replace mailto pill with `<ContactForm>` + `<RevealEmail>`.
- `site-footer.tsx`: "Email" mailto → link to `/contact`.
- `contact-cta.tsx`: mailto button (which printed the address) → drop; keep
  "Contact me" → `/contact`.
- `schema.ts`: remove `email` from the Person JSON-LD.
- `resume-share.tsx`: unchanged (`mailto:?subject=` has no recipient — no leak).

## Environment variables
- `RESEND_API_KEY` — server
- `CONTACT_FROM_EMAIL` — server (e.g. `contact@olivierluethy.com`)
- `CONTACT_TO_EMAIL` — server (owner inbox)
- `TURNSTILE_SECRET_KEY` — server
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — client

Shipped with `.env.example` and a README "Contact form" setup section (Resend
domain verification, Turnstile keys, Vercel env). Cloudflare test keys documented
for local dev.

## Non-goals
- Rate limiting: omitted (Vercel serverless is stateless; Turnstile + honeypot
  cover the threat). Can be added later via Upstash if abuse appears.

## Verification
- `npm run lint` and `npm run build` pass.
- Unit-test the pure validation + honeypot helper (scratch runner; no test
  framework is configured in the repo).
- Manual smoke test with Cloudflare/Resend test keys.
- Confirm the address no longer appears in rendered HTML or JSON-LD
  (`curl | grep`).
