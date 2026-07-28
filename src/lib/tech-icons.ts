/**
 * Brand-logo lookup for tech-stack chips.
 *
 * Runs on the server only: it reads paths out of `simple-icons` and hands the
 * client nothing heavier than a `d` string, so the icon set never ships to the
 * browser. Anything without a brand mark (Tesseract, Core Data, …) falls back
 * to a neutral hexagon so every chip still reads as a chip.
 */
import * as si from "simple-icons";

/** A neutral component glyph for tech with no brand icon. */
export const FALLBACK_TECH_PATH =
  "M12 1.5l9.093 5.25v10.5L12 22.5l-9.093-5.25V6.75L12 1.5z";

/** Tech name (as written in frontmatter) → simple-icons export key. */
const TECH_TO_ICON: Record<string, string> = {
  Python: "siPython",
  TypeScript: "siTypescript",
  JavaScript: "siJavascript",
  React: "siReact",
  "Next.js": "siNextdotjs",
  "Node.js": "siNodedotjs",
  FastAPI: "siFastapi",
  Swift: "siSwift",
  SwiftUI: "siSwift",
  Flutter: "siFlutter",
  PHP: "siPhp",
  Docker: "siDocker",
  SvelteKit: "siSvelte",
  Svelte: "siSvelte",
  Angular: "siAngular",
  OpenCV: "siOpencv",
  PostgreSQL: "siPostgresql",
  Prisma: "siPrisma",
  Rust: "siRust",
  "Tailwind CSS": "siTailwindcss",
  Vercel: "siVercel",
  Vite: "siVite",
  "Socket.io": "siSocketdotio",
  WebAssembly: "siWebassembly",
  ActivityPub: "siActivitypub",
  Quarkus: "siQuarkus",
  SQLite: "siSqlite",
  MySQL: "siMysql",
  "Chrome Extension APIs": "siGooglechrome",
  "Canvas API": "siHtml5",
  Zod: "siZod",
  pnpm: "siPnpm",
  "pnpm monorepo": "siPnpm",
  Flyway: "siFlyway",
  Xamarin: "siXamarin",
  Ionic: "siIonic",
  ".NET": "siDotnet",
  "ASP.NET Core 8": "siDotnet",
  "Entity Framework Core": "siDotnet",
  "Framer Motion": "siFramer",
  Java: "siOpenjdk",
  "Java 21": "siOpenjdk",
  Tauri: "siTauri",
  npm: "siNpm",
  Knex: "siKnexdotjs",
  "discord.py": "siDiscord",
  Tampermonkey: "siTampermonkey",
  "Kali Linux": "siKalilinux",
};

export interface TechIcon {
  name: string;
  /** SVG `d` for a 24×24 viewBox; the fallback hexagon when there is no brand mark. */
  path: string;
  /** True when this is a real brand logo rather than the fallback glyph. */
  branded: boolean;
}

/** Resolves the icon for a tech name, always returning a drawable path. */
export function techIcon(name: string): TechIcon {
  const key = TECH_TO_ICON[name];
  const icon = key ? (si as Record<string, { path?: string }>)[key] : undefined;

  if (icon?.path) {
    return { name, path: icon.path, branded: true };
  }
  return { name, path: FALLBACK_TECH_PATH, branded: false };
}

/** Windows has no simple-icons mark (trademark removal); hand-drawn 24×24 flag. */
const WINDOWS_PATH =
  "M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801";

/** OS marks for the curated Environment row. Ubuntu/Apple come from simple-icons. */
export const OS_ICON_PATHS: Record<"Windows" | "Ubuntu" | "macOS", string> = {
  Windows: WINDOWS_PATH,
  Ubuntu:
    (si as Record<string, { path?: string }>).siUbuntu?.path ?? FALLBACK_TECH_PATH,
  macOS:
    (si as Record<string, { path?: string }>).siApple?.path ?? FALLBACK_TECH_PATH,
};
