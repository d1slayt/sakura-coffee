"use client";

import { catchError, type ErrorInfo } from "next/error";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface FallbackProps {
  title: string;
  body: string;
  retryLabel: string;
  className?: string;
}

/**
 * Error boundary for database-backed parts of a page. If the menu can't be
 * loaded, only that block shows a calm message with a retry button; the rest
 * of the page keeps working. Error details are never shown to visitors.
 */
function DataFallback({ title, body, retryLabel, className }: FallbackProps, { retry }: ErrorInfo) {
  return (
    <div role="status" className={cn("border-y border-line py-10", className)}>
      <p className="font-display text-display-s">{title}</p>
      <p className="mt-2 max-w-prose text-muted">{body}</p>
      <button
        type="button"
        onClick={() => retry()}
        className="meta mt-6 inline-flex min-h-11 items-center gap-2 text-ink hover:text-pine"
      >
        <RotateCcw aria-hidden className="size-4" strokeWidth={1.5} />
        {retryLabel}
      </button>
    </div>
  );
}

export const DataBoundary = catchError(DataFallback);
