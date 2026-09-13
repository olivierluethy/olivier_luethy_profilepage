import type { Metadata } from "next";

import { Reticle } from "@/components/reticle";
import { ContactForm } from "@/components/ui/contact-form";
import { RevealEmail } from "@/components/ui/reveal-email";
import { emailEncoded } from "@/lib/contact-address";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch about work, collaboration or anything on this site.",
  path: "/contact",
});

/**
 * Contact page.
 *
 * The form is the primary channel: it relays messages through `/api/contact`
 * (Turnstile + honeypot verified, delivered via Resend) so the address is never
 * exposed to scrapers. For anyone who prefers to write directly, RevealEmail
 * surfaces the address only after a click.
 */
export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <header>
        <p className="flex items-center gap-2.5 font-mono text-hud uppercase text-signal-ink">
          <Reticle className="size-4" />
          Contact
        </p>
        <h1 className="mt-5 text-balance font-display text-display-lg font-bold">
          Get in touch
        </h1>
        <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted">
          Use the form below and I&apos;ll reply to the address you give. I read
          everything and reply to everything, including the messages that turn
          out not to be a fit.
        </p>
      </header>

      <section aria-label="Contact form" className="mt-12">
        <ContactForm />
      </section>

      <section aria-label="Email directly" className="mt-12 border-t border-line pt-10">
        <h2 className="font-mono text-hud uppercase text-faint">
          Prefer to email directly?
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Reveal my address below — it&apos;s kept out of the page so bots
          can&apos;t harvest it.
        </p>
        <div className="mt-5">
          <RevealEmail data={emailEncoded} />
        </div>
      </section>
    </div>
  );
}
