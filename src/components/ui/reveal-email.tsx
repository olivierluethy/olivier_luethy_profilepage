"use client";

import { useState } from "react";

export interface RevealEmailProps {
  /**
   * The address, Base64-encoded. Passing it encoded means the readable address
   * — and even its separate local/domain parts — never appear in the server-
   * rendered HTML or the hydration payload. It is decoded in the browser only
   * when the visitor clicks to reveal it.
   */
  data: string;
}

function decode(data: string): string {
  try {
    return atob(data);
  } catch {
    return "";
  }
}

/**
 * Click-to-reveal email.
 *
 * Conventional scrapers parse HTML (or regex the bundle for an address); they
 * find only an opaque Base64 token here. A person gets the address in one click.
 */
export function RevealEmail({ data }: RevealEmailProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const pillClass =
    "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line-strong bg-panel px-5 font-mono text-hud uppercase text-text transition-colors hover:border-signal hover:text-signal-ink";

  if (!address) {
    return (
      <button
        type="button"
        onClick={() => setAddress(decode(data))}
        className={pillClass}
      >
        Show email
      </button>
    );
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a href={`mailto:${address}`} className={pillClass}>
        {address}
      </a>
      <button
        type="button"
        onClick={copy}
        className={pillClass}
        aria-live="polite"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
