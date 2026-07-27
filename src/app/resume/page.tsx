import type { Metadata } from "next";

import { Reticle } from "@/components/reticle";
import { ActionLink } from "@/components/ui/action-link";
import { ResumeShare } from "@/components/ui/resume-share";
import { buildMetadata } from "@/lib/metadata";
import { RESUME_URL, site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Résumé",
  description:
    "Read Olivier Lüthy's résumé in the browser, download the PDF, or forward it — no download needed to look.",
  path: "/resume",
});

/**
 * Résumé viewer.
 *
 * The CV is shown inline, framed with the same lock-on brackets as the hero
 * portrait, so it reads as the acquired subject rather than an attachment.
 * Viewing costs nothing; downloading and forwarding are one click each, for the
 * recruiter who wants the file and the one who wants to pass it on.
 */
export default function ResumePage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
      <header>
        <p className="flex items-center gap-2.5 font-mono text-hud uppercase text-signal-ink">
          <Reticle className="size-4" />
          Résumé
        </p>
        <h1 className="mt-5 text-balance font-display text-display-lg font-bold">
          Read it here — no download required
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
          The full CV is below. Look it over in the browser, grab the PDF if you
          want your own copy, or forward it straight to whoever needs to see it.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <ActionLink href={RESUME_URL} variant="primary" download>
            Download PDF
          </ActionLink>
          <ActionLink href={RESUME_URL} external>
            Open in new tab
          </ActionLink>
          <ResumeShare />
        </div>
      </header>

      <section aria-label="Résumé preview" className="mt-12">
        {/* Top rail — OSD readout, echoing the hero. */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-line pb-4 font-mono text-hud uppercase text-faint">
          <span className="flex items-center gap-2 text-signal-ink">
            <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
            Document
          </span>
          <span>PDF</span>
          <span className="hidden sm:inline">olivier_luethy_cv.pdf</span>
        </div>

        {/* Framed preview with lock-on corner brackets. */}
        <div className="relative mt-6">
          <span
            aria-hidden="true"
            className="absolute -left-2 -top-2 z-10 size-6 border-l-2 border-t-2 border-signal"
          />
          <span
            aria-hidden="true"
            className="absolute -right-2 -top-2 z-10 size-6 border-r-2 border-t-2 border-signal"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-2 -left-2 z-10 size-6 border-b-2 border-l-2 border-signal"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-2 -right-2 z-10 size-6 border-b-2 border-r-2 border-signal"
          />

          <div className="relative h-[70vh] min-h-[32rem] overflow-hidden rounded-lg border border-line bg-panel sm:h-[82vh]">
            <iframe
              src={`${RESUME_URL}#view=FitH&toolbar=1`}
              title={`Résumé of ${site.name}`}
              className="size-full"
            />
          </div>
        </div>

        <p className="mt-5 font-mono text-hud uppercase text-faint">
          Preview not loading?{" "}
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="text-signal-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-signal"
          >
            Open the PDF directly
          </a>
        </p>
      </section>
    </div>
  );
}
