import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MdxContent } from "@/components/mdx/mdx-content";
import { Badge } from "@/components/ui/badge";
import { RelatedProjects } from "@/components/ui/related-projects";
import { getAllPosts, getPostBySlug } from "@/lib/content/blog";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.frontmatter.slug }));
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const { frontmatter } = post;

  return (
    <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 font-mono text-hud uppercase text-muted transition-colors hover:text-signal-ink"
      >
        <span aria-hidden="true">←</span> All posts
      </Link>

      <header className="mt-10 border-b border-line pb-10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-hud uppercase text-faint">
          <time dateTime={frontmatter.date}>{post.formattedDate}</time>
          <span>{post.readingMinutes} min read</span>
        </div>

        <h1 className="mt-5 text-balance font-display text-display-lg font-bold">
          {frontmatter.title}
        </h1>
        <p className="mt-5 text-pretty text-xl leading-relaxed text-muted">
          {frontmatter.summary}
        </p>

        {frontmatter.tags.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {frontmatter.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        ) : null}
      </header>

      {frontmatter.coverImage ? (
        <div className="relative mt-10 aspect-video overflow-hidden rounded-xl border border-line">
          <Image
            src={frontmatter.coverImage}
            alt={`Cover image for ${frontmatter.title}`}
            fill
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <MdxContent source={post.body} />

      <RelatedProjects slugs={frontmatter.relatedProjects} />
    </article>
  );
}
