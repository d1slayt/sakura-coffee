/**
 * next/image loader for the static GitHub Pages build, where there is no
 * Next.js image optimizer: Unsplash's CDN resizes and re-encodes instead,
 * so `srcset` still serves appropriately sized AVIF/WebP files.
 */
export default function unsplashLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("https://images.unsplash.com/")) return src;
  const url = new URL(src);
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 70));
  return url.toString();
}
