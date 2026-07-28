import { OS_ICON_PATHS } from "@/lib/tech-icons";

/** Which OSes I work on, and how much — informational, so not clickable. */
const OS = [
  { name: "Windows", label: "Primary · years" },
  { name: "Ubuntu", label: "Daily driver · 1+ year" },
  { name: "macOS", label: "Recent · 3 months" },
] as const;

export function Environment() {
  return (
    <div className="mt-10">
      <h3 className="mb-3 font-mono text-hud uppercase text-faint">Environment</h3>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {OS.map((os) => (
          <li
            key={os.name}
            className="flex items-center gap-3 rounded-lg border border-line bg-panel px-4 py-3 text-muted"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7 shrink-0">
              <path d={OS_ICON_PATHS[os.name]} fill="currentColor" />
            </svg>
            <span className="min-w-0">
              <span className="block font-display text-base font-semibold text-signal-ink">
                {os.name}
              </span>
              <span className="block font-mono text-hud uppercase text-faint">
                {os.label}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
