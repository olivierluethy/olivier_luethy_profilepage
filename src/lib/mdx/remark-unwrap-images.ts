/**
 * Lifts images out of the paragraph Markdown wraps them in.
 *
 * `![alt](src)` on its own line becomes `<p><img></p>`. Our image component
 * renders a `<figure>`, and a `<figure>` inside a `<p>` is invalid HTML — the
 * browser closes the paragraph early, so the parsed DOM no longer matches what
 * React rendered on the server and hydration fails with React error #418.
 *
 * Unwrapping the image at the Markdown level fixes the nesting at the source,
 * rather than making the image render as an inline element it is not.
 */

interface MdastNode {
  type: string;
  value?: string;
  children?: MdastNode[];
}

/** A paragraph holding only images (and whitespace) can be replaced by them. */
function holdsOnlyImages(node: MdastNode): boolean {
  if (node.type !== "paragraph" || !node.children?.length) return false;

  const hasImage = node.children.some((child) => child.type === "image");
  const onlyImagesAndSpace = node.children.every(
    (child) =>
      child.type === "image" ||
      (child.type === "text" && (child.value ?? "").trim() === ""),
  );

  return hasImage && onlyImagesAndSpace;
}

function unwrap(node: MdastNode): void {
  if (!node.children) return;

  node.children = node.children.flatMap((child) => {
    unwrap(child);
    return holdsOnlyImages(child)
      ? (child.children ?? []).filter((leaf) => leaf.type === "image")
      : child;
  });
}

export function remarkUnwrapImages() {
  return (tree: MdastNode): void => unwrap(tree);
}
