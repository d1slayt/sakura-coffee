"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * The header logo. On other pages it goes home; on the home page itself it
 * scrolls back to the top (smoothly, unless the visitor prefers reduced motion).
 */
export function HomeLink({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  const pathname = usePathname();
  return (
    <Link
      href="/"
      aria-label={label}
      className={className}
      onClick={(event) => {
        if (pathname !== "/") return;
        event.preventDefault();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
    >
      {children}
    </Link>
  );
}
