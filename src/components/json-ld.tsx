export interface JsonLdProps {
  /** A schema.org object. Serialised into a ld+json script tag. */
  data: Record<string, unknown>;
}

/**
 * Renders structured data.
 *
 * `<` is escaped so a stray "</script>" inside any string value cannot close
 * the tag early — the values here are ours, but the escape costs nothing and
 * removes the failure mode entirely.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
