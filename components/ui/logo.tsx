import { cn } from "@/lib/utils";
import { BlossomMark } from "./blossom-mark";

/** Text logo: "Sakura" upright, "Coffee" italic, with the blossom mark. */
export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-display text-[1.25rem] leading-none tracking-[-0.01em] min-[360px]:text-[1.375rem]", className)}>
      <BlossomMark className={cn("size-5 text-rose", markClassName)} />
      <span>
        Sakura<em className="italic">Coffee</em>
      </span>
    </span>
  );
}
