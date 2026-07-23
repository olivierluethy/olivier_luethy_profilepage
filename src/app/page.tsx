import { Reticle } from "@/components/reticle";
import { site } from "@/lib/site";

/**
 * Placeholder home page. Replaced by the full single-scroll layout in Phase 2 —
 * for now it exercises the type scale and colour tokens in both themes.
 */
export default function Home() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col justify-center px-5 py-24 sm:px-8 sm:py-32">
      <p className="flex items-center gap-2.5 font-mono text-hud uppercase text-signal-ink">
        <Reticle className="size-4" />
        Phase 0 — scaffold
      </p>

      <h1 className="mt-6 max-w-4xl text-balance font-display text-display-xl font-bold">
        {site.name}
      </h1>

      <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted">
        {site.tagline}
      </p>

      <div className="mt-12 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
        {[
          { label: "Ground", className: "bg-ground" },
          { label: "Panel", className: "bg-panel" },
          { label: "Raised", className: "bg-panel-raised" },
          { label: "Signal", className: "bg-signal" },
        ].map((swatch) => (
          <div key={swatch.label} className={`${swatch.className} p-4`}>
            <span className="font-mono text-hud uppercase text-muted">
              {swatch.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
