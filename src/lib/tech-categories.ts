/** Ordered tech-wall categories. */
export const TECH_CATEGORY_ORDER = [
  "Languages",
  "Frameworks & Libraries",
  "Package Managers",
  "Databases",
  "Tools & Platforms",
] as const;

export type TechCategory = (typeof TECH_CATEGORY_ORDER)[number];

/** Tech name (exact frontmatter string) → category. */
const TECH_TO_CATEGORY: Record<string, TechCategory> = {
  // Languages
  Python: "Languages",
  TypeScript: "Languages",
  JavaScript: "Languages",
  Rust: "Languages",
  PHP: "Languages",
  Swift: "Languages",
  Java: "Languages",
  "Java 21": "Languages",
  // Frameworks & Libraries
  "Next.js": "Frameworks & Libraries",
  React: "Frameworks & Libraries",
  Svelte: "Frameworks & Libraries",
  SvelteKit: "Frameworks & Libraries",
  Angular: "Frameworks & Libraries",
  Flutter: "Frameworks & Libraries",
  FastAPI: "Frameworks & Libraries",
  Quarkus: "Frameworks & Libraries",
  ".NET": "Frameworks & Libraries",
  "ASP.NET Core 8": "Frameworks & Libraries",
  "Entity Framework Core": "Frameworks & Libraries",
  SwiftUI: "Frameworks & Libraries",
  Ionic: "Frameworks & Libraries",
  Xamarin: "Frameworks & Libraries",
  "Tailwind CSS": "Frameworks & Libraries",
  "Framer Motion": "Frameworks & Libraries",
  "Socket.io": "Frameworks & Libraries",
  OpenCV: "Frameworks & Libraries",
  WebAssembly: "Frameworks & Libraries",
  ActivityPub: "Frameworks & Libraries",
  "discord.py": "Frameworks & Libraries",
  Tauri: "Frameworks & Libraries",
  // Package Managers
  pnpm: "Package Managers",
  "pnpm monorepo": "Package Managers",
  npm: "Package Managers",
  // Databases
  PostgreSQL: "Databases",
  SQLite: "Databases",
  MySQL: "Databases",
  Prisma: "Databases",
  Knex: "Databases",
  Flyway: "Databases",
  // Tools & Platforms
  "Node.js": "Tools & Platforms",
  Docker: "Tools & Platforms",
  Vercel: "Tools & Platforms",
  Vite: "Tools & Platforms",
  Git: "Tools & Platforms",
  "Chrome Extension APIs": "Tools & Platforms",
  "Canvas API": "Tools & Platforms",
  Zod: "Tools & Platforms",
  Tampermonkey: "Tools & Platforms",
  "Kali Linux": "Tools & Platforms",
  WPScan: "Tools & Platforms",
};

/** Category for a tech name; unmapped tech falls into Tools & Platforms. */
export function categoryFor(name: string): TechCategory {
  return TECH_TO_CATEGORY[name] ?? "Tools & Platforms";
}
