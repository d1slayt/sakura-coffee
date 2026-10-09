import { useId } from "react";
import { cn } from "@/lib/utils";

const PETALS = [0, 72, 144, 216, 288];

/**
 * The brand device: five petals of a cherry blossom, each drawn as a coffee
 * bean with its centre crease cut out. Decorative unless `title` is given.
 */
export function BlossomMark({ className, title }: { className?: string; title?: string }) {
  const maskId = useId();
  return (
    <svg
      viewBox="-24 -24 48 48"
      className={cn("size-6 shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <mask id={maskId}>
        <rect x="-24" y="-24" width="48" height="48" fill="white" />
        {PETALS.map((angle) => (
          <path
            key={angle}
            d="M0,-19 C1.6,-15 -1.6,-9 0,-4.5"
            transform={`rotate(${angle})`}
            stroke="black"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        ))}
      </mask>
      <g mask={`url(#${maskId})`} fill="currentColor">
        {PETALS.map((angle) => (
          <ellipse key={angle} cx="0" cy="-12" rx="6.2" ry="9" transform={`rotate(${angle})`} />
        ))}
      </g>
    </svg>
  );
}
