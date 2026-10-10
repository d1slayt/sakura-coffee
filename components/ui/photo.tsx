import Image from "next/image";
import type { Photo as PhotoData } from "@/lib/images";
import { cn } from "@/lib/utils";

interface PhotoProps {
  photo: PhotoData;
  /** Responsive `sizes` attribute; required so the browser fetches the right width. */
  sizes: string;
  /** Aspect ratio of the frame, e.g. "4/5". The image covers the frame. */
  ratio?: string;
  caption?: string;
  /** Above-the-fold images load eagerly with high priority. */
  priority?: boolean;
  className?: string;
  frameClassName?: string;
  imageClassName?: string;
  captionClassName?: string;
}

/**
 * A photograph in a fixed-ratio frame with an optional plain caption.
 * Without `ratio` the frame fills its parent (the parent sets the height).
 */
export function Photo({
  photo,
  sizes,
  ratio,
  caption,
  priority,
  className,
  frameClassName,
  imageClassName,
  captionClassName,
}: PhotoProps) {
  return (
    <figure className={cn("relative", className)}>
      <div
        className={cn("relative w-full overflow-hidden bg-paper-deep", !ratio && "h-full", frameClassName)}
        style={ratio ? { aspectRatio: ratio } : undefined}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          quality={70}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          className={cn("object-cover", imageClassName)}
        />
      </div>
      {caption ? <figcaption className={cn("meta mt-3 font-medium text-muted", captionClassName)}>{caption}</figcaption> : null}
    </figure>
  );
}
