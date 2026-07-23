import { ImageResponse } from "next/og";

import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/components/og-card";
import { getAllPosts, getPostBySlug } from "@/lib/content/blog";
import { site } from "@/lib/site";

export const alt = "Blog post cover";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.frontmatter.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return new ImageResponse(
      <OgCard eyebrow="Writing" title="Not found" footer={site.name} />,
      size,
    );
  }

  return new ImageResponse(
    (
      <OgCard
        eyebrow={`${post.formattedDate} · ${post.readingMinutes} min read`}
        title={post.frontmatter.title}
        subtitle={post.frontmatter.summary}
        chips={post.frontmatter.tags}
        footer={site.name}
      />
    ),
    size,
  );
}
