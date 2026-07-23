import Link from "next/link";
import type { ReactNode } from "react";

export type ActionVariant = "primary" | "secondary" | "ghost";

const VARIANTS: Record<ActionVariant, string> = {
  primary:
    "bg-signal text-[#0B0F14] border-signal hover:brightness-110 active:brightness-95",
  secondary:
    "border-line-strong bg-panel text-text hover:border-signal hover:text-signal-ink",
  ghost: "border-transparent bg-transparent text-muted hover:text-signal-ink",
};

export interface ActionLinkProps {
  href: string;
  children: ReactNode;
  variant?: ActionVariant;
  /** Opens in a new tab with safe rel attributes. */
  external?: boolean;
  /** Hints to the browser that this navigates to a download. */
  download?: boolean;
  className?: string;
}

/**
 * The site's primary call-to-action. Internal hrefs use next/link; external
 * ones fall through to a plain anchor so target/rel behave predictably.
 */
export function ActionLink({
  href,
  children,
  variant = "secondary",
  external = false,
  download = false,
  className = "",
}: ActionLinkProps) {
  const styles = `inline-flex h-11 items-center justify-center gap-2 rounded-full border px-5 font-mono text-hud uppercase transition-all duration-200 ${VARIANTS[variant]} ${className}`;

  if (external || download || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={styles}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        {...(download ? { download: "" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={styles}>
      {children}
    </Link>
  );
}
