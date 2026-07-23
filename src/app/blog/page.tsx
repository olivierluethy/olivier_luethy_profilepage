import Image from "next/image";
import Link from "next/link";

import { Reticle } from "@/components/reticle";
import { Badge } from "@/components/ui/badge";
import { getAllPosts } from "@/lib/content/blog";

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
      <header className="border-b border-line pb-10">
        <p className="flex items-center gap-2.5 font-mono text-hud uppercase text-signal-ink">
          <Reticle className="size-4" />
          Build log
        </p>
        <h1 className="mt-5 max-w-3xl text-balance font-display text-display-lg font-bold">
          Notes from the build log
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
          Mostly things I got wrong first, written down while the details were
          still fresh.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-16 rounded-lg border border-dashed border-line px-6 py-14 text-center text-muted">
          No posts yet. Add an MDX file to{" "}
          <code className="font-mono text-signal-ink">/content/blog</code> to
          publish one.
        </p>
      ) : (
        <ul className="mt-12 space-y-6">
          {posts.map((post) => (
            <li key={post.frontmatter.slug}>
              <Link
                href={`/blog/${post.frontmatter.slug}`}
                className="group flex flex-col gap-5 rounded-xl border border-line bg-panel p-5 transition-all duration-300 hover:-translate-y-1 hover:border-signal/50 hover:shadow-panel sm:flex-row sm:gap-7 sm:p-6"
              >
                {post.frontmatter.coverImage ? (
                  <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg border border-line sm:w-56">
                    <Image
                      src={post.frontmatter.coverImage}
                      alt={`Cover image for ${post.frontmatter.title}`}
                      fill
                      sizes="(min-width: 640px) 224px, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : null}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-hud uppercase text-faint">
                    <time dateTime={post.frontmatter.date}>
                      {post.formattedDate}
                    </time>
                    <span>{post.readingMinutes} min read</span>
                  </div>

                  <h2 className="mt-3 text-balance font-display text-xl font-semibold transition-colors group-hover:text-signal-ink sm:text-display-sm">
                    {post.frontmatter.title}
                  </h2>
                  <p className="mt-3 text-pretty leading-relaxed text-muted">
                    {post.frontmatter.summary}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {post.frontmatter.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
