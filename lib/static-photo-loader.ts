import { PHOTO_WIDTHS } from "./photo-sources";

/**
 * next/image loader for the static GitHub Pages build, where there is no
 * Next.js image optimizer. Photos are pre-generated in several widths
 * (public/photos/<key>-<width>.webp); this picks the smallest one that is at
 * least as wide as requested, so `srcset` still serves the right size.
 */
export default function staticPhotoLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const match = /^\/photos\/(.+)-\d+\.webp$/.exec(src);
  if (!match) return src;
  const chosen = PHOTO_WIDTHS.find((w) => w >= width) ?? PHOTO_WIDTHS[PHOTO_WIDTHS.length - 1];
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/photos/${match[1]}-${chosen}.webp`;
}
