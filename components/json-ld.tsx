/**
 * Renders Schema.org JSON-LD. `<` is escaped so data can't break out of the
 * script tag (see Next.js JSON-LD guide).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
