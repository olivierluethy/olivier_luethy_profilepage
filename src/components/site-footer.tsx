import Link from "next/link";

import { Reticle } from "@/components/reticle";
import { navLinks, site, socials } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line bg-panel">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <Reticle className="size-4 text-signal" />
              <span className="font-mono text-hud uppercase">{site.name}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {site.description}
            </p>
          </div>

          <div className="flex gap-12">
            <nav aria-label="Footer">
              <h2 className="font-mono text-hud uppercase text-faint">Site</h2>
              <ul className="mt-4 space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-signal-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="font-mono text-hud uppercase text-faint">
                Elsewhere
              </h2>
              <ul className="mt-4 space-y-2.5">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-sm text-muted transition-colors hover:text-signal-ink"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-sm text-muted transition-colors hover:text-signal-ink"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Status bar — the OSD readout that closes every page. */}
        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-6 font-mono text-hud uppercase text-faint">
          <span>&copy; {year}</span>
          <span>{site.location}</span>
          <span className="ml-auto flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
            Open to opportunities
          </span>
        </div>
      </div>
    </footer>
  );
}
