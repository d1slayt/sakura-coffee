import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Shared input styles: hairline bottom border, paper fill, no rounded pills. */
export const inputClass =
  "block w-full min-h-12 rounded-(--radius-input) border border-line-strong bg-paper/60 px-3.5 py-2.5 text-base text-ink transition-colors duration-(--duration-quick) placeholder:text-muted/70 hover:border-ink focus:border-ink focus:bg-ivory focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-ink aria-invalid:border-rose-ink";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Label + control + hint/error. The control must set
 * `aria-describedby={describedBy(id, error, hint)}` and `aria-invalid`.
 */
export function Field({ id, label, error, hint, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="meta text-coffee">
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-sm font-medium text-rose-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function describedBy(id: string, error?: string, hint?: string): string | undefined {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}
