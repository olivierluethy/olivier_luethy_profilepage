import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import {
  isHoneypotTripped,
  TURNSTILE_FIELD,
  validateContact,
} from "@/lib/contact";

// The Resend SDK needs the Node.js runtime (not Edge).
export const runtime = "nodejs";

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Server-side check that the Turnstile token is real and unused. */
async function verifyTurnstile(
  token: string,
  ip: string | null,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("Contact route: TURNSTILE_SECRET_KEY is not set.");
    return false;
  }

  const form = new URLSearchParams();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);

  try {
    const res = await fetch(SITEVERIFY_URL, { method: "POST", body: form });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("Turnstile verification failed:", err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, {
      status: 400,
    });
  }

  // A bot filled the honeypot: accept without sending anything.
  if (isHoneypotTripped(body)) {
    return NextResponse.json({ ok: true });
  }

  const validation = validateContact(body);
  if (!validation.ok) {
    return NextResponse.json({ ok: false, error: validation.error }, {
      status: 400,
    });
  }

  const record = body as Record<string, unknown>;
  const token =
    typeof record[TURNSTILE_FIELD] === "string"
      ? (record[TURNSTILE_FIELD] as string)
      : "";
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Please complete the verification." },
      { status: 400 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const human = await verifyTurnstile(token, ip);
  if (!human) {
    return NextResponse.json(
      { ok: false, error: "Verification failed. Please try again." },
      { status: 403 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error(
      "Contact route misconfigured: RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL must all be set.",
    );
    return NextResponse.json(
      { ok: false, error: "The contact form is temporarily unavailable." },
      { status: 500 },
    );
  }

  const { name, email, message } = validation.data;
  // Newlines are stripped from the subject; the message body is free-form text.
  const subject = `Portfolio contact — ${name}`.replace(/[\r\n]+/g, " ");

  const resend = new Resend(apiKey);
  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { ok: false, error: "Could not send your message. Please try again later." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("Resend threw:", err);
    return NextResponse.json(
      { ok: false, error: "Could not send your message. Please try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
