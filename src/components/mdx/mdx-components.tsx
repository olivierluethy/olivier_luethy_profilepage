import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { Diagram } from "@/components/mdx/diagram";
import { MdxImage } from "@/components/mdx/mdx-image";
import { getImageSize } from "@/lib/image-size";

/**
 * The MDX element map.
 *
 * Prose is styled explicitly here rather than with a typography plugin, so the
 * rendered article uses the same design tokens as the rest of the site and
 * every element is accounted for. Headings carry `group` so the anchor link
 * appended by rehype-autolink-headings can reveal itself on hover.
 */

function Heading2({ className, ...props }: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2
      className={`group mt-14 scroll-mt-28 font-display text-display-sm font-bold text-balance ${className ?? ""}`}
      {...props}
    />
  );
}

function Heading3({ className, ...props }: ComponentPropsWithoutRef<"h3">) {
  return (
    <h3
      className={`group mt-10 scroll-mt-28 font-display text-xl font-semibold text-balance ${className ?? ""}`}
      {...props}
    />
  );
}

function Heading4({ className, ...props }: ComponentPropsWithoutRef<"h4">) {
  return (
    <h4
      className={`group mt-8 scroll-mt-28 font-mono text-label uppercase text-muted ${className ?? ""}`}
      {...props}
    />
  );
}

function Paragraph(props: ComponentPropsWithoutRef<"p">) {
  return <p className="mt-5 leading-[1.75] text-muted text-pretty" {...props} />;
}

function Anchor({ href = "", ...props }: ComponentPropsWithoutRef<"a">) {
  const styles =
    "font-medium text-text underline decoration-signal decoration-2 underline-offset-[3px] transition-colors hover:text-signal-ink";

  if (href.startsWith("/")) {
    return <Link href={href} className={styles} {...props} />;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={styles}
      {...props}
    />
  );
}

function UnorderedList(props: ComponentPropsWithoutRef<"ul">) {
  return (
    <ul
      className="mt-5 space-y-2.5 [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-1 [&>li]:before:top-[0.6em] [&>li]:before:size-1.5 [&>li]:before:bg-signal"
      {...props}
    />
  );
}

function OrderedList(props: ComponentPropsWithoutRef<"ol">) {
  return (
    <ol
      className="mt-5 list-decimal space-y-2.5 pl-6 marker:font-mono marker:text-signal-ink"
      {...props}
    />
  );
}

function ListItem(props: ComponentPropsWithoutRef<"li">) {
  return <li className="leading-[1.75] text-muted" {...props} />;
}

function Blockquote(props: ComponentPropsWithoutRef<"blockquote">) {
  return (
    <blockquote
      className="my-8 border-l-2 border-signal bg-signal-wash py-4 pl-6 pr-4 [&>p]:mt-0 [&>p]:text-text [&>p+p]:mt-4"
      {...props}
    />
  );
}

function HorizontalRule() {
  return <hr className="my-12 border-0 border-t border-line" />;
}

function Strong(props: ComponentPropsWithoutRef<"strong">) {
  return <strong className="font-semibold text-text" {...props} />;
}

/** Tables scroll horizontally on narrow screens rather than overflowing. */
function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="my-8 overflow-x-auto rounded-lg border border-line">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  );
}

function TableHead(props: ComponentPropsWithoutRef<"th">) {
  return (
    <th
      className="border-b border-line bg-panel px-4 py-3 text-left font-mono text-hud uppercase text-muted"
      {...props}
    />
  );
}

function TableCell(props: ComponentPropsWithoutRef<"td">) {
  return (
    <td
      className="border-b border-line px-4 py-3 align-top text-muted last:border-0"
      {...props}
    />
  );
}

type CodeProps = ComponentPropsWithoutRef<"code"> & {
  "data-language"?: string;
};

/**
 * rehype-pretty-code sets `data-language` on fenced blocks. Inline code has no
 * such attribute and gets the compact chip treatment instead.
 */
function Code({ className, ...props }: CodeProps) {
  const isBlock = props["data-language"] !== undefined;

  if (isBlock) {
    return <code className={`grid ${className ?? ""}`} {...props} />;
  }

  return (
    <code
      className={`rounded border border-line bg-panel px-1.5 py-0.5 font-mono text-[0.875em] text-signal-ink ${className ?? ""}`}
      {...props}
    />
  );
}

function Pre({ className, ...props }: ComponentPropsWithoutRef<"pre">) {
  return (
    <pre
      className={`overflow-x-auto rounded-lg border border-line bg-panel py-4 text-sm leading-relaxed ${className ?? ""}`}
      {...props}
    />
  );
}

/**
 * Markdown images. Dimensions are measured from `/public` at build time so the
 * layout never shifts; a markdown title becomes the caption.
 */
async function MdxImg({ src, alt, title }: ComponentPropsWithoutRef<"img">) {
  if (typeof src !== "string") return null;

  const { width, height } = await getImageSize(src);

  return (
    <MdxImage
      src={src}
      alt={alt ?? ""}
      width={width}
      height={height}
      caption={title}
    />
  );
}

export const mdxComponents = {
  h2: Heading2,
  h3: Heading3,
  h4: Heading4,
  p: Paragraph,
  a: Anchor,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  blockquote: Blockquote,
  hr: HorizontalRule,
  strong: Strong,
  table: Table,
  th: TableHead,
  td: TableCell,
  code: Code,
  pre: Pre,
  img: MdxImg,
  /** Available in MDX without an import: <Diagram src="..." alt="..." /> */
  Diagram,
};
