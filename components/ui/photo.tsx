import Image from "next/image";
import type { Photo as PhotoData } from "@/lib/images";
import { cn } from "@/lib/utils";

interface PhotoProps {
  photo: PhotoData;
  /** Responsive `sizes` attribute; required so the browser fetches the right width. */
  sizes: string;
  /** Aspect ratio of the frame, e.g. "4/5". The image covers the frame. */
  ratio: string;
  caption?: string;
  /** Rotated caption along the left edge (method notes). */
  verticalCaption?: string;
  /** Above-the-fold images load eagerly with high priority. */
  priority?: boolean;
  className?: string;
  frameClassName?: string;
  imageClassName?: string;
  captionClassName?: string;
}

/**
 * An editorial figure: a fixed-ratio frame, optional numbered caption below,
 * optional vertical caption beside it. Square corners by design.
 */
export function Photo({
  photo,
  sizes,
  ratio,
  caption,
  verticalCaption,
  priority,
  className,
  frameClassName,
  imageClassName,
  captionClassName,
}: PhotoProps) {
  return (
    <figure className={cn("relative", className)}>
      <div className="flex gap-3">
        {verticalCaption ? (
          <p aria-hidden className="meta vertical-caption hidden self-end text-muted sm:block">
            {verticalCaption}
          </p>
        ) : null}
        <div className={cn("relative w-full overflow-hidden bg-paper", frameClassName)} style={{ aspectRatio: ratio }}>
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
      </div>
      {caption ? (
        <figcaption className={cn("mt-3 font-display text-[0.9375rem] italic text-muted", verticalCaption && "sm:pl-7", captionClassName)}>
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
