import Link from "next/link";

import { MobileNav } from "@/components/mobile-nav";
import { Reticle } from "@/components/reticle";
import { ThemeToggle } from "@/components/theme-toggle";
import { navLinks, site, socials } from "@/lib/site";

/**
 * Sticky top navigation. Section jump-links are added in Phase 2 — this is the
 * persistent shell that every page shares.
 */
export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ground/80 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-nav max-w-6xl items-center gap-4 px-5 sm:px-8"
      >
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-mono text-hud uppercase text-text"
        >
          <Reticle className="size-4 text-signal transition-transform duration-300 group-hover:rotate-90" />
          <span className="truncate">{site.name}</span>
        </Link>

        <div className="ml-auto flex items-center gap-1">
          <ul className="hidden items-center gap-1 sm:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex h-8 items-center rounded-full px-3 font-mono text-hud uppercase text-muted transition-colors hover:text-signal-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
          <MobileNav links={navLinks} socials={socials} />
        </div>
      </nav>
    </header>
  );
}
