/**
 * Contact-form validation, shared by the client form and the API route.
 *
 * Kept free of any framework or network imports so the rules can be unit-tested
 * in isolation and reused on both sides of the request.
 */

/**
 * Name of the honeypot field. It is rendered visually hidden and off the tab
 * order, so a human never fills it; automated bots that fill every field do.
 * A tripped honeypot is treated as success and silently dropped.
 */
export const HONEYPOT_FIELD = "company";

/** Field the Turnstile widget reports its token under. */
export const TURNSTILE_FIELD = "cf-turnstile-response";

export const LIMITS = {
  name: 100,
  email: 254,
  message: 5000,
} as const;

export interface ContactData {
  name: string;
  email: string;
  message: string;
}

export type ValidationResult =
  | { ok: true; data: ContactData }
  | { ok: false; error: string };

/**
 * Excludes whitespace on both sides of the `@`, so a CR/LF can never reach the
 * value used as a `reply-to` address — no header injection is possible.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateContact(raw: unknown): ValidationResult {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "Invalid request." };
  }
  const body = raw as Record<string, unknown>;
  const name = asString(body.name);
  const email = asString(body.email);
  const message = asString(body.message);

  if (name.length < 1 || name.length > LIMITS.name) {
    return { ok: false, error: "Please enter your name." };
  }
  if (email.length > LIMITS.email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (message.length < 1 || message.length > LIMITS.message) {
    return { ok: false, error: "Please enter a message." };
  }

  return { ok: true, data: { name, email, message } };
}

/** True when the honeypot field carries any value — i.e. a bot filled it. */
export function isHoneypotTripped(raw: unknown): boolean {
  if (typeof raw !== "object" || raw === null) return false;
  const value = (raw as Record<string, unknown>)[HONEYPOT_FIELD];
  return typeof value === "string" && value.trim().length > 0;
}
