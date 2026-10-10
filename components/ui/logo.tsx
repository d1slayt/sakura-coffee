import { cn } from "@/lib/utils";
import { BlossomMark } from "./blossom-mark";

/** Wordmark in pine with the blossom mark — the only sakura motif on the site. */
export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-display text-[1.25rem] leading-none font-medium tracking-[-0.02em] text-pine min-[360px]:text-[1.375rem]", className)}>
      <BlossomMark className={cn("size-5 text-pink", markClassName)} />
      <span>SakuraCoffee</span>
    </span>
  );
}
