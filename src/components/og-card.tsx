import type { ReactElement } from "react";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const GROUND = "#0B0F14";
const LINE = "#1F2A37";
const SIGNAL = "#FF8A3D";
const TEXT = "#E6EDF3";
const MUTED = "#8A9AAB";

export interface OgCardProps {
  /** Small uppercase label above the title, e.g. "Project" or a date. */
  eyebrow: string;
  title: string;
  /** Optional supporting line under the title. */
  subtitle?: string;
  /** Small items rendered as chips along the bottom, e.g. the tech stack. */
  chips?: readonly string[];
  /** Shown bottom-right — normally the site owner's name. */
  footer: string;
}

/**
 * Shared Open Graph card, in the site's HUD language.
 *
 * Rendered by Satori through next/og, which supports only flexbox layout and a
 * subset of CSS — hence the explicit display:flex on every container and the
 * inline styles rather than Tailwind classes.
 */
export function OgCard({
  eyebrow,
  title,
  subtitle,
  chips = [],
  footer,
}: OgCardProps): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: GROUND,
        padding: 64,
        position: "relative",
      }}
    >
      {/* Corner brackets — the site's lock-on frame. */}
      <div style={{ position: "absolute", top: 40, left: 40, width: 56, height: 56, borderTop: `5px solid ${SIGNAL}`, borderLeft: `5px solid ${SIGNAL}`, display: "flex" }} />
      <div style={{ position: "absolute", top: 40, right: 40, width: 56, height: 56, borderTop: `5px solid ${SIGNAL}`, borderRight: `5px solid ${SIGNAL}`, display: "flex" }} />
      <div style={{ position: "absolute", bottom: 40, left: 40, width: 56, height: 56, borderBottom: `5px solid ${SIGNAL}`, borderLeft: `5px solid ${SIGNAL}`, display: "flex" }} />
      <div style={{ position: "absolute", bottom: 40, right: 40, width: 56, height: 56, borderBottom: `5px solid ${SIGNAL}`, borderRight: `5px solid ${SIGNAL}`, display: "flex" }} />

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: SIGNAL,
          }}
        >
          {eyebrow}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: title.length > 46 ? 62 : 76,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: -2,
            color: TEXT,
          }}
        >
          {title}
        </div>

        {subtitle ? (
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 28,
              lineHeight: 1.4,
              color: MUTED,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          {chips.slice(0, 5).map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                border: `2px solid ${LINE}`,
                borderRadius: 999,
                padding: "8px 18px",
                fontSize: 20,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: MUTED,
              }}
            >
              {chip}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          {footer}
        </div>
      </div>
    </div>
  );
}
