"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { NavLink } from "@/lib/site";

export interface MobileNavProps {
  links: readonly NavLink[];
  socials: readonly NavLink[];
}

/**
 * Navigation disclosure for narrow screens.
 *
 * Without this the top-level routes are unreachable on a phone from any page
 * other than the homepage, because the inline links are hidden below `sm`.
 * Escape closes the panel and every link closes it on activation.
 */
export function MobileNav({ links, socials }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line px-3 font-mono text-hud uppercase text-muted transition-colors hover:border-signal hover:text-signal-ink"
      >
        {open ? "Close" : "Menu"}
      </button>

      {open ? (
        <div
          id="mobile-nav-panel"
          className="absolute inset-x-0 top-full border-b border-line bg-ground shadow-panel"
        >
          <ul className="mx-auto max-w-6xl px-5 py-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line py-3 font-mono text-hud uppercase text-text"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => setOpen(false)}
                  className="block border-b border-line py-3 font-mono text-hud uppercase text-muted last:border-0"
                >
                  {social.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
