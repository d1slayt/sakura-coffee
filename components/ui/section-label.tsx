import { cn } from "@/lib/utils";

/** "02 — Story" style label that opens a section, with a hairline after it. */
export function SectionLabel({ children, className, inverse }: { children: string; className?: string; inverse?: boolean }) {
  return (
    <p className={cn("meta flex items-center gap-4", inverse ? "text-ivory-dim" : "text-muted", className)}>
      <span>{children}</span>
      <span aria-hidden className={cn("h-px w-12", inverse ? "bg-line-inverse" : "bg-line-strong")} />
    </p>
  );
}
