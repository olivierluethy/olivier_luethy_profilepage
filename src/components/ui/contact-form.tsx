"use client";

import { useEffect, useRef, useState } from "react";

import { HONEYPOT_FIELD, LIMITS, TURNSTILE_FIELD } from "@/lib/contact";

type Status = "idle" | "submitting" | "success" | "error";

interface TurnstileApi {
  render: (
    el: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "error-callback"?: () => void;
      "expired-callback"?: () => void;
      theme?: "auto" | "light" | "dark";
    },
  ) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

const labelClass = "font-mono text-hud uppercase text-faint";
const fieldClass =
  "mt-2 w-full rounded-lg border border-line-strong bg-panel px-4 py-3 text-sm text-text outline-none transition-colors placeholder:text-faint focus:border-signal";

/**
 * Contact form.
 *
 * The owner's address never reaches the client: submissions POST to
 * `/api/contact`, which validates them, checks the Turnstile token and honeypot,
 * and relays the message via Resend. The Turnstile widget is rendered
 * explicitly so it works regardless of when the script and this component load.
 */
export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const widgetHost = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  // Load the Turnstile script and render the widget explicitly.
  useEffect(() => {
    if (!SITE_KEY) return;

    let cancelled = false;

    const renderWidget = () => {
      if (cancelled) return;
      const host = widgetHost.current;
      if (!host || !window.turnstile || widgetId.current !== null) return;
      widgetId.current = window.turnstile.render(host, {
        sitekey: SITE_KEY,
        theme: "auto",
        callback: (value) => setToken(value),
        "error-callback": () => setToken(""),
        "expired-callback": () => setToken(""),
      });
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${SCRIPT_SRC}"]`,
      );
      if (existing) {
        existing.addEventListener("load", renderWidget);
      } else {
        const script = document.createElement("script");
        script.src = SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        script.addEventListener("load", renderWidget);
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, []);

  const resetTurnstile = () => {
    setToken("");
    if (widgetId.current && window.turnstile) {
      window.turnstile.reset(widgetId.current);
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      [HONEYPOT_FIELD]: String(data.get(HONEYPOT_FIELD) ?? ""),
      [TURNSTILE_FIELD]: token,
    };

    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (res.ok && result.ok) {
        setStatus("success");
        form.reset();
        resetTurnstile();
      } else {
        setStatus("error");
        setError(result.error ?? "Something went wrong. Please try again.");
        resetTurnstile();
      }
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
      resetTurnstile();
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-xl border border-signal/40 bg-signal-wash p-6"
      >
        <p className="font-mono text-hud uppercase text-signal-ink">
          Message sent
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Thanks — your message is on its way and I&apos;ll reply to the address
          you gave. Want to send another?{" "}
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="font-medium text-text underline decoration-signal decoration-2 underline-offset-[3px] transition-colors hover:text-signal-ink"
          >
            Write another message
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
      <div>
        <label htmlFor="contact-name" className={labelClass}>
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          maxLength={LIMITS.name}
          autoComplete="name"
          className={fieldClass}
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClass}>
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          maxLength={LIMITS.email}
          autoComplete="email"
          className={fieldClass}
          placeholder="you@company.com"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          maxLength={LIMITS.message}
          rows={6}
          className={`${fieldClass} resize-y`}
          placeholder="What would you like to talk about?"
        />
      </div>

      {/* Honeypot: hidden from people, tempting to bots. Not focusable. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-company">Company (leave this blank)</label>
        <input
          id="contact-company"
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Turnstile mounts here. */}
      <div ref={widgetHost} />

      {status === "error" ? (
        <p role="alert" className="text-sm text-signal-ink">
          {error}
        </p>
      ) : null}

      {!SITE_KEY ? (
        <p className="font-mono text-hud uppercase text-faint">
          Verification is not configured — set NEXT_PUBLIC_TURNSTILE_SITE_KEY.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-signal bg-signal px-6 font-mono text-hud uppercase text-[#0B0F14] transition-all duration-200 hover:brightness-110 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
