import Link from "next/link";

import { ActionLink } from "@/components/ui/action-link";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { getLatestPosts } from "@/lib/content/blog";

/** The three most recent posts, linking through to the full blog. */
/**
 * Column counts are looked up as complete class strings so Tailwind can see
 * them at build time. Without this the grid keeps three columns and renders
 * empty cells when there are fewer than three posts.
 */
const COLUMNS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
};

export function LatestPosts() {
  const posts = getLatestPosts(3);

  if (posts.length === 0) return null;

  const columns = COLUMNS[posts.length] ?? COLUMNS[3];

  return (
    <Section
      id="writing"
      callsign="Log"
      title="Notes from the build log"
      lede="Mostly things I got wrong first, written down while the details were still fresh."
      className="bg-panel/40"
    >
      <ul
        className={`grid gap-px overflow-hidden rounded-xl border border-line bg-line ${columns}`}
      >
        {posts.map((post, index) => (
          <li key={post.frontmatter.slug} className="bg-panel">
            <Reveal delay={index * 0.08} className="h-full">
              <Link
                href={`/blog/${post.frontmatter.slug}`}
                className="group flex h-full flex-col p-6 transition-colors hover:bg-panel-raised"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-hud uppercase text-faint">
                  <time dateTime={post.frontmatter.date}>
                    {post.formattedDate}
                  </time>
                  <span>{post.readingMinutes} min read</span>
                </div>

                <h3 className="mt-4 text-balance font-display text-lg font-semibold transition-colors group-hover:text-signal-ink">
                  {post.frontmatter.title}
                </h3>
                <p className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-muted">
                  {post.frontmatter.summary}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {post.frontmatter.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal delay={0.2}>
        <div className="mt-10">
          <ActionLink href="/blog">Read the blog</ActionLink>
        </div>
      </Reveal>
    </Section>
  );
}
