import { Reticle } from "@/components/reticle";
import { site } from "@/lib/site";

/**
 * Contact page.
 *
 * Deliberately has no form, no API route and no backend. The external form
 * provider's embed is pasted into the marked container below; until then the
 * mailto link is the working way to get in touch.
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
          Use the form below, or email me directly. I read everything and reply
          to everything, including the messages that turn out not to be a fit.
        </p>
      </header>

      <div className="mt-10">
        <a
          href={`mailto:${site.email}`}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line-strong bg-panel px-5 font-mono text-hud uppercase text-text transition-colors hover:border-signal hover:text-signal-ink"
        >
          {site.email}
        </a>
      </div>

      <section
        aria-label="Contact form"
        className="mt-12 min-h-80 rounded-xl border border-dashed border-line-strong bg-panel/40 p-6"
      >
        {/* EasyContactForms embed goes here — external form will be pasted in later */}
      </section>
    </div>
  );
}
