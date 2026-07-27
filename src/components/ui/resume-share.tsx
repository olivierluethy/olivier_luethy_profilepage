"use client";

import { useEffect, useState } from "react";

import { site } from "@/lib/site";

/**
 * Share actions for the résumé page.
 *
 * "Forward it" is a first-class use case — a recruiter who wants to pass the CV
 * to a hiring manager should not have to download and re-attach it. Both actions
 * read `window.location` at click time rather than from `site.url`, so they stay
 * correct on any deploy (including previews) and before the production domain is
 * set, and there is nothing to hydrate on the server.
 */
const BUTTON_STYLES =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line-strong bg-panel px-5 font-mono text-hud uppercase text-text transition-all duration-200 hover:border-signal hover:text-signal-ink";

export function ResumeShare() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  function forward() {
    const url = window.location.href;
    const subject = `${site.name} — Résumé`;
    const body = `Hi,\n\nHere is ${site.name}'s résumé: ${url}\n\nYou can read it in the browser or download the PDF from that page.\n`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      // Clipboard blocked (insecure context or denied permission): the
      // "Forward" and "Open" actions still work, so fail quietly.
      setCopied(false);
    }
  }

  return (
    <>
      <button type="button" onClick={forward} className={BUTTON_STYLES}>
        Forward it
      </button>
      <button type="button" onClick={copyLink} className={BUTTON_STYLES}>
        {copied ? "Link copied" : "Copy link"}
      </button>
    </>
  );
}
