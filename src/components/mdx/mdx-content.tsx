import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { mdxComponents } from "@/components/mdx/mdx-components";

/**
 * Dual-theme highlighting. Shiki emits `--shiki-light`/`--shiki-dark` custom
 * properties per token and globals.css picks the right one from the theme
 * class, so code blocks recolour instantly with no re-render.
 */
const prettyCodeOptions: PrettyCodeOptions = {
  theme: { light: "github-light", dark: "vesper" },
  keepBackground: false,
  defaultLang: "text",
};

/** Appends a subtle "#" permalink to every heading that rehype-slug gave an id. */
const autolinkOptions = {
  behavior: "append" as const,
  properties: {
    className:
      "ml-2 text-signal no-underline opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100",
    "aria-label": "Link to this section",
  },
  content: { type: "text" as const, value: "#" },
};

export interface MdxContentProps {
  /** Raw MDX body from a content file. */
  source: string;
}

/**
 * The shared MDX renderer used by project pages and blog posts.
 * Everything renders inline — nothing is hidden behind a disclosure.
 */
export function MdxContent({ source }: MdxContentProps) {
  return (
    <div className="text-base">
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [rehypePrettyCode, prettyCodeOptions],
              [rehypeAutolinkHeadings, autolinkOptions],
            ],
          },
        }}
      />
    </div>
  );
}
