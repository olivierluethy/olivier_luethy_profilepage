import { cache } from "react";

/**
 * Decides at build time whether a URL can be shown in an iframe.
 *
 * A browser gives no usable client-side signal when framing is refused — the
 * iframe simply stays blank and no error event fires — so the headers are
 * inspected here instead and the page renders the correct variant from the
 * start. Anything uncertain (network failure, placeholder URL, timeout)
 * resolves to `false`, because a working "Try it" button is always better
 * than an empty embed.
 */

const TIMEOUT_MS = 5000;

function frameAncestorsBlocks(csp: string): boolean {
  const directive = csp
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.toLowerCase().startsWith("frame-ancestors"));

  if (!directive) return false;

  const value = directive.slice("frame-ancestors".length).trim().toLowerCase();
  // Only a wildcard is permissive enough to rely on for an arbitrary host.
  return value !== "*";
}

async function probe(url: string): Promise<boolean> {
  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return false;
  }

  if (target.protocol !== "https:" && target.protocol !== "http:") return false;

  try {
    const response = await fetch(target, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) return false;

    const xfo = response.headers.get("x-frame-options");
    if (xfo && /deny|sameorigin|allow-from/i.test(xfo)) return false;

    const csp = response.headers.get("content-security-policy");
    if (csp && frameAncestorsBlocks(csp)) return false;

    return true;
  } catch {
    return false;
  }
}

export const canEmbed = cache(
  async (url: string): Promise<boolean> => (url ? probe(url) : false),
);
